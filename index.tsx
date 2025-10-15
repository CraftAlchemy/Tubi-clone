import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// FIX: Add global declaration for ion-icon to fix TypeScript errors.
declare global {
    namespace JSX {
        interface IntrinsicElements {
            "ion-icon": any;
        }
    }
}

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);