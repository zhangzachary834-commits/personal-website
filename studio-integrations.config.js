// Public browser configuration for optional Studio integrations.
// OAuth web client IDs are public identifiers, not secrets. Never put a client secret here.
window.DimensionStudioConfig = window.DimensionStudioConfig || {};
window.DimensionStudioConfig.google = {
    // Paste the Google Cloud "Web application" OAuth client ID here.
    // Example shape: "1234567890-abc123.apps.googleusercontent.com"
    clientId: "",
    scope: [
        "openid",
        "email",
        "profile",
        "https://www.googleapis.com/auth/drive.appdata",
        "https://www.googleapis.com/auth/documents"
    ].join(" ")
};

// Backward-compatible alias for the Google Docs integration.
window.DimensionStudioConfig.googleDocs = window.DimensionStudioConfig.google;
