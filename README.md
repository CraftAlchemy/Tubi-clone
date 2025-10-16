# Myflix - Production Deployment Guide

This guide provides instructions for configuring and deploying the Myflix application to a production environment using **Google Cloud Run** and **Firestore**.

## Architecture Overview

-   **Frontend**: A React application that is served by the backend.
-   **Backend**: A Node.js/Express server that serves the frontend and provides a content API.
-   **Database**: Google Firestore is used as a persistent NoSQL database to store movie and category information.
-   **Deployment**: The entire application is containerized using Docker and deployed as a stateless service on Google Cloud Run.

---

## Prerequisites

1.  **Google Cloud Platform (GCP) Account**: You need a GCP account with billing enabled.
2.  **gcloud CLI**: The [Google Cloud SDK](https://cloud.google.com/sdk/docs/install) installed and authenticated on your local machine.
3.  **Docker**: [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed on your local machine.

---

## Step 1: Set Up Google Cloud Project & Firestore

1.  **Create or Select a GCP Project**:
    -   Go to the [GCP Console](https://console.cloud.google.com/) and create a new project or select an existing one.
    -   Note your **Project ID**.

2.  **Enable Required APIs**:
    -   In your project, enable the following APIs:
        -   Cloud Run Admin API
        -   Cloud Build API
        -   Cloud Firestore API
    -   You can do this by navigating to "APIs & Services" > "Library" in the console.

3.  **Create a Firestore Database**:
    -   Navigate to "Firestore" in the GCP console.
    -   Click **"Create database"**.
    -   Choose **Native Mode**.
    -   Select a location (e.g., `us-central1`).
    -   Click **"Create"**.

---

## Step 2: Configure Service Account (for Local Development)

To run the server locally while connected to your live Firestore database, you need to authenticate using a service account.

1.  **Create a Service Account**:
    -   In the GCP console, go to "IAM & Admin" > "Service Accounts".
    -   Click **"+ Create Service Account"**.
    -   Give it a name (e.g., `myflix-server-dev`).
    -   Grant it the **"Cloud Datastore User"** role (this role provides permissions for Firestore).
    -   Click **"Done"**.

2.  **Download the Key File**:
    -   Find the service account you just created in the list.
    -   Click on the three-dot menu under "Actions" and select **"Manage keys"**.
    -   Click **"Add Key"** > **"Create new key"**.
    -   Choose **JSON** as the key type and click **"Create"**.
    -   A JSON file will be downloaded to your computer. **Keep this file secure and do not commit it to version control.**

3.  **Set Environment Variable**:
    -   Move the downloaded JSON file to the root of this project and rename it to `gcp-credentials.json`.
    -   Set an environment variable that points to this file. The Node.js client library will automatically find and use it.
    -   In your terminal (for macOS/Linux):
        ```bash
        export GOOGLE_APPLICATION_CREDENTIALS="[PATH_TO_YOUR_PROJECT]/gcp-credentials.json"
        ```
    -   For Windows (Command Prompt):
        ```cmd
        set GOOGLE_APPLICATION_CREDENTIALS="[PATH_TO_YOUR_PROJECT]\gcp-credentials.json"
        ```

---

## Step 3: Run the Application Locally

1.  **Install Dependencies**:
    ```bash
    npm install
    ```

2.  **Start the Server**:
    ```bash
    npm start
    ```
    -   The server will start, connect to your Firestore database, and seed it with initial data if it's empty.

---

## Step 4: Deploy to Google Cloud Run

1.  **Configure gcloud CLI**:
    -   Set your project: `gcloud config set project [YOUR_PROJECT_ID]`
    -   Set your region: `gcloud config set run/region [YOUR_CHOSEN_REGION]` (e.g., `us-central1`)

2.  **Deploy the Service**:
    -   Run the following command from the root of your project directory:
    ```bash
    gcloud run deploy myflix-service --source . --allow-unauthenticated
    ```
    -   This command will:
        -   Use the Cloud Build API to build a container image from your `Dockerfile`.
        -   Push the image to the Artifact Registry.
        -   Deploy the image to a new Cloud Run service named `myflix-service`.
        -   The `--allow-unauthenticated` flag makes the service publicly accessible.

3.  **Access Your Application**:
    -   After the deployment is complete, the `gcloud` command will output a **Service URL**. You can access your fully deployed application at this URL.
    -   **Note**: On Cloud Run, you do not need the `gcp-credentials.json` file. The service runs with the identity of the default Compute Engine service account, which has sufficient permissions to access other services like Firestore within the same project.