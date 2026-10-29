# Resume Maker Pro (Free, Offline Windows App)

A beginner-friendly bilingual (English/Hindi) desktop resume maker. It has 120 template variants, editable resume fields, optional photo, live preview, local save/edit/delete, and PDF export. It uses no paid API and has no subscription.

## Build a Windows installer with GitHub (no local Node.js needed)

1. Sign in to GitHub and create a new **empty** repository, for example `resume-maker-pro`.
2. Download/unzip this project ZIP on your computer.
3. Open the new repository on GitHub and choose **Add file → Upload files**.
4. Upload the *contents* of this folder (including `.github/workflows/build-windows.yml`) and commit to `main`.
5. Open the repository's **Actions** tab. Select **Build Resume Maker Pro for Windows**.
6. Click **Run workflow** (if it did not start automatically after the commit).
7. Wait until the workflow has a green check mark.
8. Open that successful workflow run. At the bottom, under **Artifacts**, download `ResumeMakerPro-Windows`.
9. Extract the downloaded ZIP and run `ResumeMakerPro-Setup-1.0.0.exe`.

You do not need Node.js on your own PC. GitHub's hosted Windows runner installs the build dependencies. GitHub account and internet are needed for building/downloading.

## Run locally (optional, requires Node.js)
- `npm install`
- `npm start`
- `npm run dist`

## Features
- 120 selectable template variants generated from 10 layout variants and multiple color/name combinations.
- Hindi/English UI toggle for main form labels.
- Live preview, profile photo (up to 2 MB), and editable details.
- Save/edit/delete multiple resumes in the app's local browser storage.
- PDF export via native Windows save dialog.
- No login, no paid API, no subscription.

## Privacy and limitations
- Resume data is stored locally in the app's local storage on this computer. Do not uninstall/reset the app or clear app data without exporting/backing up important resumes.
- Template titles/layout variations are built-in; this is not 120 individually hand-designed premium templates.
- Hindi/English toggle translates the interface labels. Resume content is whatever you type, so you can write it in either language.
- No AI-generated writing is included because you requested no paid API.
- The app uses a local font stack and does not require an API. A Google Fonts CSS import is included as a visual enhancement; if offline, fallback fonts will be used. Remove the `@import` in `styles.css` for a fully network-independent first load.
- Windows may show a SmartScreen warning for an unsigned installer. The app is not code-signed; choose only to continue if you trust the source you built.
- This project has not been built on your PC yet. GitHub Actions builds the `.exe` after you upload the source repository.

## Files
- `main.js`, `preload.js`: Electron desktop app and PDF export.
- `index.html`, `styles.css`, `renderer.js`: dashboard, templates, form, preview, save/edit and language toggle.
- `.github/workflows/build-windows.yml`: automatic Windows build.
