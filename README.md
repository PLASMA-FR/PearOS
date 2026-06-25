# pearOS

pearOS is a pear-themed web desktop made for a Hack Club WebOS-style mission. It is inspired by polished desktop operating systems, but it does not copy Apple logos, official macOS icons, proprietary wallpapers, or branded assets.

The project is a complete static site using only HTML, CSS, and JavaScript. It works by opening `index.html`, running a small local server, or publishing the repository with GitHub Pages.

## Features

- Multiple draggable and resizable windows
- Dock and desktop icons that open or focus apps
- Finder, Terminal, Notes, Calculator, Sketch, Pear Catch, Pear Pairs, Devlogs, Settings, and About apps
- Close, minimize, maximize, focus, and dock indicators
- Interactive Terminal commands for help, app launching, themes, and layout reset
- Finder folders with app launch files and pearOS/Hack Club project notes
- Editable Notes saved in localStorage
- Three themes: Pear Light, Midnight Green, and Graphite
- Safe window layout, note, and theme persistence
- Command Palette opened with Ctrl + K or Command + K
- App Runner search from the dock
- Responsive mobile layout
- Original CSS pear logo, icons, and wallpaper
- No password or login gate

## Terminal commands

```text
help
about
apps
open finder
open terminal
open notes
open devlogs
open settings
open about
clear
whoami
```

The terminal also accepts `open calculator`, `open sketch`, `open pearcatch`, `open pairs`, `theme light`, `theme midnight`, `theme graphite`, `reset layout`, `date`, `pwd`, and `ls`.

## Custom feature

The custom feature beyond the guide is the Command Palette. Press Ctrl + K or Command + K, search for an app, use arrow keys to choose, then press Enter to launch it. It avoids inputs and textareas so Terminal and Notes keep normal typing behavior.

pearOS also includes a small dock App Runner, two mini games, a sketch canvas, safe localStorage fallbacks, and an in-OS Finder preview pane.

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

This repository includes a single GitHub Pages workflow at `.github/workflows/pages.yml`.

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
- [x] Works as a static GitHub Pages app
- [x] Original design, not exactly like the guide
- [x] At least three devlogs
- [x] At least one extra feature beyond the guide
- [x] Dock, desktop icons, Finder files, Terminal, and Command Palette can all launch apps
- [x] Mobile layout keeps every app testable
- [x] No password, so anyone can test it

## Devlogs

- [Devlog 1: Desktop foundation](devlogs/devlog-1.md)
- [Devlog 2: Window manager and apps](devlogs/devlog-2.md)
- [Devlog 3: Custom features and polish](devlogs/devlog-3.md)

## Notes

pearOS is a browser simulation, so Finder files are fake project files rather than real filesystem access. On small screens, windows use a centered mobile-friendly layout instead of desktop dragging.
