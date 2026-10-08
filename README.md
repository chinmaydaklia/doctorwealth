# DoctorWealth (Docfin) v11

Offline-first personal + practice finance app for a physician in India. One self-contained `index.html` (pure ES5, data in this browser's localStorage).

- `index.html` – the whole app. Open it from GitHub Pages (needed for Google Drive sync) or as a local file.
- `sw.js` – optional service worker: lets the installed app open with no network. The app works without it.

v11 highlights: money stored as integer paise (automatic, lossless migration from older versions), bank-statement import (PDF incl. password-protected, CSV, XLS/XLSX) with an editable preview, duplicate detection and per-import undo, Zerodha tax P&L import into the per-person Tax tab, auto-categorisation rules, multi-device sync (Google Drive appDataFolder encrypted with your passphrase, nearby WebRTC, or sync file), and quick + / − entry on the home screen.
