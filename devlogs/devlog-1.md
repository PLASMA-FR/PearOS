# Devlog 1: Desktop foundation

## What I built

I started pearOS by building the static desktop: wallpaper, top menu bar, desktop icons, dock, and the basic app window shape. I made the pear logo, icon backgrounds, and wallpaper with CSS so the project would not rely on copied desktop assets.

## What problem happened

The first design had too much blur and transparency. It looked cool, but Finder text was not readable over bright parts of the wallpaper. It also felt like a generic glass UI instead of something specific to pearOS.

## How I solved it

I kept the blur on the top bar, dock, and title bars, but made the app content more solid. I added pear-green accents, warm off-white panels, and a soft original gradient wallpaper.

## What changed visually or technically

- Added a custom CSS pear mark
- Built desktop icons and the dock
- Created a readable window layout
- Chose the main pearOS colors
- Kept everything static and dependency-free

## What is next

Next I need to make the windows actually move, stack correctly, and open from the dock and desktop.
