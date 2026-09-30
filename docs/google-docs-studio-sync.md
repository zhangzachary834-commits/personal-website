# Google Docs sync for Dimension of Thought Studio

The Studio can link each local article draft to one Google Doc and push/pull the Markdown source without a backend. Google Identity Services issues a short-lived browser access token; no OAuth client secret is stored in the repository.

## Google-side setup

1. In Google Cloud Console, create or select a project for Dimension of Thought.
2. Enable **Google Docs API**.
3. Open **Google Auth platform** and configure the consent screen / audience.
   - For a private development app, Testing mode is fine.
   - Add the Google account(s) that will use the Studio as test users when Google requires it.
4. Create an OAuth client:
   - Application type: **Web application**
   - Authorized JavaScript origins:
     - `http://localhost:8000`
     - `https://zhangzachary834-commits.github.io`
     - Later, add `https://thedimensionofthought.com` (and `https://www.thedimensionofthought.com` if that host is used)
5. Copy the OAuth client ID into `studio-integrations.config.js`:

```js
window.DimensionStudioConfig.googleDocs.clientId =
    "YOUR_WEB_CLIENT_ID.apps.googleusercontent.com";
```

Do **not** add a client secret. Browser OAuth clients do not use one here.

## Sync semantics

- **Create Google Doc** creates a Doc using the current Studio title and immediately pushes the Studio body.
- **Link existing Doc** accepts either a full Google Docs URL or a document ID.
- **Push to Docs** replaces the linked Doc body with the exact Studio Markdown source.
- **Pull from Docs** replaces the Studio body with the Doc's plain text.
- The integration stores the Google Docs `revisionId` after every successful sync.
- If the remote revision changed since the previous sync, a normal push is blocked. Pull first, or explicitly choose **Force push** to overwrite the remote body.
- Each Studio draft stores its own Google Docs link metadata. Duplicating a Studio draft intentionally does **not** duplicate the Google Docs link.

This first pass intentionally preserves the Studio Markdown source rather than attempting a lossy rich-text conversion. Rich Google Docs formatting ↔ Markdown translation can be layered on later.

## Local test

Run the existing local server:

```bash
./launch.command
```

Open `http://localhost:8000/studio.html`, click **Google Docs**, authorize, create or link a Doc, then exercise push/pull and conflict detection.
