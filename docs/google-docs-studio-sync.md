# Person Workspace + Google Docs sync

Dimension of Thought Studio treats a **Person** as the real human being. Google is only the identity and storage provider used to recognize which Person is present and to guard that Person's private creative workspace.

The private Studio is now split into three responsibilities:

- **Google Identity / OpenID Connect** — recognizes the active Person.
- **Google Drive `appDataFolder`** — stores that Person's private Studio workspace (drafts, active draft, artwork, Studio mode).
- **Google Docs API** — optionally binds an individual article draft to a Google Doc for editing and collaboration.

No OAuth client secret is stored in this repository.

## Google-side setup

1. In Google Cloud Console, create or select a project for Dimension of Thought.
2. Enable both:
   - **Google Drive API**
   - **Google Docs API**
3. Open **Google Auth platform** and configure the consent screen / audience.
   - Testing mode is fine while developing.
   - Add the Google identities that should be allowed to enter the Studio as test identities when required.
4. Add these OAuth scopes to the app's data-access configuration:
   - `openid`
   - `email`
   - `profile`
   - `https://www.googleapis.com/auth/drive.appdata`
   - `https://www.googleapis.com/auth/documents`
5. Create an OAuth client:
   - Application type: **Web application**
   - Authorized JavaScript origins:
     - `http://localhost:8000`
     - `https://zhangzachary834-commits.github.io`
     - Later: `https://thedimensionofthought.com`
     - Add `https://www.thedimensionofthought.com` too if that host is used.
6. Copy the OAuth client ID into `studio-integrations.config.js`:

```js
window.DimensionStudioConfig.google.clientId =
    "YOUR_WEB_CLIENT_ID.apps.googleusercontent.com";
```

Do **not** add a client secret.

## Person semantics

The code intentionally uses names such as `Person`, `personId`, `Person Workspace`, and `providerIdentity`.

A Google identity is not treated as the Person. It is a provider relation used to recognize the Person for this Studio session:

```text
Person
  └── providerIdentity
        ├── provider: google
        └── subject: stable Google OIDC subject
```

The stable Google OpenID Connect `sub` claim is used as the provider-side identifier. The Person Workspace refuses to load a stored workspace whose recorded Person identity does not match the active Person.

## Private storage model

The canonical private Studio state is stored as:

`dimension-of-thought-person-workspace.json`

inside that Person's Google Drive **application data folder**.

The snapshot currently contains:

- article drafts
- active draft ID
- 2D Studio artwork / strokes
- current Studio mode
- Person/provider identity metadata
- workspace update timestamp

The Drive application-data folder is intentionally used instead of ordinary My Drive storage: it is app-specific, hidden from normal Drive UI, and scoped to the authenticated Person.

Private draft bodies and artwork are no longer written to the old shared-origin Studio `localStorage` keys.

### Legacy migration

On the first entry into a Person Workspace, if browser-only Studio data from the pre-Person architecture exists, Studio asks whether it should be imported into the active Person's private cloud workspace. After a successful cloud write, the old private Studio keys are removed.

## Cross-device write protection

The runtime remembers the Drive file's `modifiedTime`.

Before overwriting an existing private workspace, Studio verifies that the cloud file has not changed since it was last loaded/saved. If another device changed it, the write is refused instead of silently overwriting that remote work.

This is intentionally conservative. A later merge layer can reconcile draft-level changes automatically.

## Google Docs semantics

Each article draft may independently bind to one Google Doc.

- **Create Google Doc** creates a Doc using the current article title and pushes the Studio body.
- **Link existing Doc** accepts either a full Google Docs URL or a document ID.
- **Push to Docs** replaces the linked Doc body with the exact Studio Markdown source.
- **Pull from Docs** replaces the Studio body with the Doc's plain text.
- The draft stores the Google Docs `revisionId` after successful synchronization.
- If the Doc revision changed remotely, a normal push is refused.
- **Force push** appears only as an explicit conflict override.
- Duplicating a Studio draft intentionally clears its Google Doc binding.

The Docs integration reuses the currently active Person's Google authorization. It does not maintain a second independent login.

## Local test

Run:

```bash
./launch.command
```

Then open:

`http://localhost:8000/studio.html`

Test this sequence:

1. Enter the Person Workspace with Google.
2. Create an article draft and a few drawing strokes.
3. Reload, re-enter with the same Google identity, and confirm the private workspace returns.
4. Leave the Person Workspace and enter with a different Google identity; confirm the previous Person's drafts do not appear.
5. Link or create a Google Doc and exercise Push / Pull.
6. Edit the Doc remotely and confirm a stale Studio push is blocked.
