# Devlog 2: Window manager and apps

## What I built

I added the window manager and the main apps. Windows can open from desktop icons or the dock, move by dragging the title bar, come to the front when clicked, resize from the corner, minimize, maximize, and close.

Finder now has folders, fake project files, previews, and app files that open apps. Terminal supports real commands instead of just displaying fake terminal text.

## What problem happened

Dragging worked only when the pointer stayed exactly on the title bar. If I moved too fast, the window stopped following the pointer. I also had a few places changing z-index separately, which made focus feel inconsistent.

## How I solved it

I used Pointer Events with pointer capture so dragging continues until the pointer is released. I also moved focus behavior into one function that updates z-index, active window styling, dock indicators, and the top-bar app name together.

## What changed visually or technically

- Multiple windows can overlap
- Focus and stacking behave consistently
- Dock dots show running apps
- Finder folders update the file area and preview pane
- Terminal can open every app with commands
- Window geometry can be saved locally

## What is next

Next I want to add the custom feature, theme settings, Notes persistence, and a better mobile layout.
