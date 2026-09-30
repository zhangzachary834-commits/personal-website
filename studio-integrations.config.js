// Public browser configuration for optional Studio integrations.
// OAuth web client IDs are public identifiers, not secrets. Never put a client secret here.
window.DimensionStudioConfig = window.DimensionStudioConfig || {};
window.DimensionStudioConfig.googleDocs = {
    // Paste the Google Cloud "Web application" OAuth client ID here.
    // Example shape: "1234567890-abc123.apps.googleusercontent.com"
    clientId: "",
    scope: "https://www.googleapis.com/auth/documents"
};
