# pearOS

pearOS is a pear-themed web desktop made for a Hack Club WebOS-style mission. It is inspired by polished desktop operating systems, but it does not copy Apple logos, official macOS icons, proprietary wallpapers, or branded assets.

The project is a complete static site using only HTML, CSS, and JavaScript. It works by opening `index.html`, running a small local server, or publishing the repository with GitHub Pages.

## Features

- Multiple draggable and resizable windows
- Finder, Terminal, Notes, Devlogs, Settings, and About apps
- Close, minimize, maximize, focus, and dock indicators
- Interactive Terminal commands
- Editable Notes saved in localStorage
- Three themes: Pear Light, Midnight Green, and Graphite
- Window layout and theme persistence
- Command Palette opened with Ctrl + K or Command + K
- Responsive mobile layout
- Original CSS pear logo, icons, and wallpaper
- No password or login gate

## Terminal commands

```text
help
about
apps
open finder
open notes
open devlogs
open settings
clear
whoami
```

The terminal also accepts `open terminal` and `open about`.

## Custom feature

The custom feature beyond the guide is the Command Palette. Press Ctrl + K or Command + K, search for an app, use arrow keys to choose, then press Enter to launch it.

## Run locally

Open `index.html` directly in a browser, or run a small local server:

```bash
python3 -m http.server 8000
```

Then visit:

```text
http://localhost:8000
```

No package install or build step is required.

## GitHub Pages deployment

This repository includes a GitHub Pages workflow at `.github/workflows/pages.yml`.

To publish it:

1. Open the repository on GitHub.
2. Go to Settings.
3. Open Pages.
4. Set the source to GitHub Actions if it is not already selected.
5. Push to main or run the workflow manually.

Expected public URL for this repo:

```text
https://plasma-fr.github.io/PearOS/
```

## Hack Club requirement checklist

- [x] Working webpage with multiple draggable windows
- [x] Original design, not exactly like the guide
- [x] At least three devlogs
- [x] At least one extra feature beyond the guide
- [x] No password, so anyone can test it

## Devlogs

- [Devlog 1: Desktop foundation](devlogs/devlog-1.md)
- [Devlog 2: Window manager and apps](devlogs/devlog-2.md)
- [Devlog 3: Custom features and polish](devlogs/devlog-3.md)

## Notes

pearOS is a browser simulation, so Finder files are fake project files rather than real filesystem access. On small screens, windows use a centered mobile-friendly layout instead of desktop dragging.
