const folders = {
  Applications: [
    ["Finder", "Open folders and fake files", "finder"],
    ["Terminal", "Type help to see commands", "terminal"],
    ["Notes", "Tiny saved note", "notes"],
    ["Settings", "Themes", "settings"]
  ],
  Documents: [
    ["pearos.txt", "pearOS is a static browser desktop made for Hack Club."],
    ["roadmap.md", "Add sketch pad, wallpaper picker, and better file previews."],
    ["hackclub.md", "Draggable windows, devlogs, no password, custom feature."]
  ],
  Projects: [
    ["window-manager.js", "Pointer Events, focus stacking, resize, and persistence."],
    ["pear-wallpaper.css", "Original gradients and pear shapes."],
    ["command-palette.md", "Ctrl K opens a searchable launcher."]
  ],
  Devlogs: [
    ["devlog-1.md", "Desktop foundation."],
    ["devlog-2.md", "Window manager and apps."],
    ["devlog-3.md", "Custom polish."]
  ],
  System: [
    ["version.txt", "pearOS 1.0 static edition."],
    ["storage.json", "Theme, note, and layout stay in this browser."],
    ["public.flag", "Anyone can test without a login gate."]
  ]
};

const logs = [
  ["Desktop foundation", "I started with the wallpaper, menu bar, dock, icons, and Finder shell. The first draft used too much glass, so I made app content more solid and kept the pear identity in CSS."],
  ["Window manager and apps", "I added dragging, stacking, resize, close, minimize, maximize, Finder folders, and Terminal commands. Pointer capture fixed drag bugs when the pointer moved fast."],
  ["Custom features and polish", "I added the Command Palette, Notes saving, three themes, layout persistence, devlog tabs, and a mobile layout that is easier to test on a phone."]
];

const appMeta = {
  finder: ["Finder", "□", "finder-glyph", 660, 420],
  terminal: ["Terminal", "›_", "terminal-glyph", 640, 390],
  notes: ["Notes", "✎", "notes-glyph", 540, 380],
  devlogs: ["Devlogs", "✦", "devlog-glyph", 620, 430],
  settings: ["Settings", "●", "settings-glyph", 520, 340],
  about: ["About", "?", "about-glyph", 560, 430]
};
