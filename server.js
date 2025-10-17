const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { Firestore } = require('@google-cloud/firestore');
const path = require('path');

// --- Firestore Initialization ---
// The Firestore client will automatically use the credentials provided by
// the Google Cloud environment (like Cloud Run) or from the
// GOOGLE_APPLICATION_CREDENTIALS environment variable.
const firestore = new Firestore();
const contentCollection = firestore.collection('content');
const configCollection = firestore.collection('config');
const categoriesDoc = contentCollection.doc('categories_doc');
const configDoc = configCollection.doc('site_settings');


const app = express();
const PORT = process.env.PORT || 8080; // Use port 8080 for Cloud Run compatibility

// --- Initial Data for Seeding ---
// FIX: Wrap the require in a try-catch to prevent a server crash if the file is missing in the deployment environment.
let INITIAL_CATEGORIES = [];
try {
    const data = require(path.join(__dirname, 'data', 'initial-data.js'));
    INITIAL_CATEGORIES = data.INITIAL_CATEGORIES;
    console.log('Successfully loaded initial data from file.');
} catch (e) {
    console.error('CRITICAL: Could not load initial-data.js. The server will start, but the database cannot be seeded with initial content. Error:', e.message);
}
const INITIAL_CONFIG = { siteName: 'Myflix', isCartoonSectionEnabled: true };

// --- Database Seeding Functions ---
const seedDatabase = async () => {
    try {
        const doc = await categoriesDoc.get();
        if (!doc.exists) {
            console.log('No content data found in Firestore. Seeding database...');
            if (INITIAL_CATEGORIES.length > 0) {
                await categoriesDoc.set({ data: INITIAL_CATEGORIES });
                console.log('Database seeded successfully.');
            } else {
                 console.warn('Initial data file was not loaded, skipping database seed.');
            }
        } else {
            console.log('Content data found in Firestore. Skipping seed.');
        }
    } catch (error) {
        console.error('Error seeding database:', error);
        // If seeding fails, the application might not work correctly.
        // It's important to ensure Firestore permissions are set up.
    }
};

const seedConfig = async () => {
    try {
        const doc = await configDoc.get();
        if (!doc.exists) {
            console.log('No site config found in Firestore. Seeding config...');
            await configDoc.set(INITIAL_CONFIG);
            console.log('Site config seeded successfully.');
        } else {
             // Ensure existing config has all necessary fields
            const data = doc.data();
            if (data.isCartoonSectionEnabled === undefined) {
                console.log('Existing config is missing fields. Updating...');
                await configDoc.set({ ...INITIAL_CONFIG, ...data });
            } else {
                console.log('Site config found in Firestore. Skipping seed.');
            }
        }
    } catch (error) {
        console.error('Error seeding site config:', error);
    }
};


// --- Middleware ---
app.use(cors());
app.use(bodyParser.json());

// --- API Endpoints ---

// GET /api/config
app.get('/api/config', async (req, res) => {
    try {
        const doc = await configDoc.get();
        if (!doc.exists) {
            // If config doesn't exist, create it with defaults and return it.
            console.log('No config found on GET, creating with defaults.');
            await configDoc.set(INITIAL_CONFIG);
            return res.json(INITIAL_CONFIG);
        }
        res.json({ ...INITIAL_CONFIG, ...doc.data() });
    } catch (error) {
        console.error('Error fetching config:', error);
        res.status(500).json({ error: 'Failed to fetch config.' });
    }
});

// POST /api/config
app.post('/api/config', async (req, res) => {
    const { siteName, isCartoonSectionEnabled } = req.body;
    if (siteName === undefined || typeof siteName !== 'string' || isCartoonSectionEnabled === undefined) {
        return res.status(400).json({ error: 'Invalid data format. Expected siteName and isCartoonSectionEnabled.' });
    }

    try {
        await configDoc.set({ siteName, isCartoonSectionEnabled });
        console.log('POST /api/config - Site config updated successfully.');
        res.status(200).json({ message: 'Configuration updated successfully.' });
    } catch (error) {
        console.error('Error updating config:', error);
        res.status(500).json({ error: 'Failed to update config.' });
    }
});


// GET /api/content
// Returns the current list of all categories and their movies from Firestore.
app.get('/api/content', async (req, res) => {
    try {
        const doc = await categoriesDoc.get();
        if (!doc.exists) {
            return res.status(404).json({ error: 'Content not found.' });
        }
        // The categories are stored in the 'data' field of the document.
        res.json(doc.data().data);
    } catch (error) {
        console.error('Error fetching content:', error);
        res.status(500).json({ error: 'Failed to fetch content.' });
    }
});

// POST /api/content
// Receives a new array of categories and replaces the existing data in Firestore.
app.post('/api/content', async (req, res) => {
    const updatedCategories = req.body;
    if (!Array.isArray(updatedCategories)) {
        console.error('POST /api/content - Invalid data format received.');
        return res.status(400).json({ error: 'Invalid data format. Expected an array of categories.' });
    }

    try {
        // Overwrite the document with the new array of categories.
        await categoriesDoc.set({ data: updatedCategories });
        console.log('POST /api/content - Content updated successfully in Firestore.');
        res.status(200).json({ message: 'Content updated successfully.' });
    } catch (error) {
        console.error('Error updating content:', error);
        res.status(500).json({ error: 'Failed to update content.' });
    }
});


// --- Static File Serving & Client-side Routing ---
// This should come after API routes to ensure they are not overridden.
// Serve static files from the root of the project directory.
app.use(express.static(path.join(__dirname)));

// For any other request, serve the index.html file so client-side routing can take over.
app.get('*', (req, res) => {
    // Ensure this doesn't accidentally catch API calls that fell through.
    if (req.path.startsWith('/api/')) {
        return res.status(404).send('API endpoint not found.');
    }
    res.sendFile(path.join(__dirname, 'index.html'));
});


// --- Server Start ---
app.listen(PORT, async () => {
    console.log(`
    ==================================================
    Backend server is starting...
    ==================================================
  `);
    // Seed the database before the server starts accepting requests.
    await seedDatabase();
    await seedConfig();
    console.log(`
    ==================================================
    Server is running on http://localhost:${PORT}
    ==================================================
  `);
});