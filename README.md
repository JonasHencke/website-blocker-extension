## Website Blocker Extension

A small React + Vite-based browser extension that lets you block distracting websites with a custom overlay. The popup UI is built with React; a content script injects the blocking overlay on matched pages.

## Project Structure

- `extension/` – main extension source (React + Vite)
  - `src/` – React popup UI
  - `public/manifest.json` – Chrome extension manifest (v3)
  - `public/content.js` – content script injected on pages

## Getting Started

1. Install dependencies:

   ```bash
   cd extension
   npm install
   ```

2. Run the dev server (for working on the popup UI):

   ```bash
   npm run dev
   ```

   This starts Vite; open the shown URL in your browser to iterate on the popup UI.

## Building the Extension

Build the production bundle:

```bash
cd extension
npm run build
```

The built files will be output to `extension/dist/`.

## Loading in Chrome

1. Open `chrome://extensions`.
2. Enable **Developer mode**.
3. Click **Load unpacked** and select the `extension/dist` folder.
4. The "Website Blocker" extension should now appear in your toolbar.

## Useful Commands

Inside the `extension/` folder:

- `npm run dev` – start Vite dev server for the popup UI.
- `npm run build` – type-check and build the extension bundle.
- `npm run preview` – preview the production build locally.
- `npm run lint` – run ESLint over the codebase.

## Notes

- The popup entry point is `extension/index.html`.
- The content script is registered via `extension/public/manifest.json` and runs on `<all_urls>` at `document_start`.
