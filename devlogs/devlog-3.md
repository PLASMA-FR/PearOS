# Devlog 3: Custom features and polish

## What I built

I finished the Command Palette, which is the extra feature beyond the basic WebOS guide. Pressing Ctrl K or Command K opens a centered launcher where I can search apps and press Enter to open one.

I also added three themes, editable Notes, devlogs inside the OS, localStorage persistence, keyboard resizing from the handle, an App Runner search panel, desktop icons, and a mobile-friendly window layout.

## What problem happened

The desktop layout did not translate well to phones. Saved desktop positions could push a window partly off screen, and resizing was too awkward for touch.

The global keyboard shortcuts also needed to avoid breaking normal typing in Terminal and Notes.

## How I solved it

On small screens, pearOS ignores desktop coordinates visually and gives open windows a predictable centered frame. The dock remains usable, so every app can still be opened and tested. Keyboard shortcuts skip inputs and textareas so typing stays normal.

## What changed visually or technically

- Added Command Palette search
- Added App Runner search and desktop launch icons
- Added Pear Light, Midnight Green, and Graphite themes
- Saved the selected theme to localStorage
- Saved Notes content locally
- Improved mobile behavior
- Added the final About checklist

## What is next

A future version could add a small drawing app, a wallpaper picker, and more Finder file previews while keeping the project simple.
