const folders = {
  Applications: [
    {
      name: "Finder",
      kind: "Application",
      detail: "Browse apps, documents, devlogs, and system notes.",
      app: "finder"
    },
    {
      name: "Terminal",
      kind: "Application",
      detail: "Run pearOS commands and open apps by name.",
      app: "terminal"
    },
    {
      name: "Notes",
      kind: "Application",
      detail: "Keep one local note between visits.",
      app: "notes"
    },
    {
      name: "Calculator",
      kind: "Application",
      detail: "A tiny pear-green calculator for quick math.",
      app: "calculator"
    },
    {
      name: "Sketch",
      kind: "Application",
      detail: "Draw quick pearOS doodles on a local canvas.",
      app: "sketch"
    },
    {
      name: "Devlogs",
      kind: "Application",
      detail: "Read the build journal from inside the desktop.",
      app: "devlogs"
    },
    {
      name: "Settings",
      kind: "Application",
      detail: "Change theme and reset window layout.",
      app: "settings"
    },
    {
      name: "About pearOS",
      kind: "Application",
      detail: "Project identity and checklist.",
      app: "about"
    }
  ],
  Games: [
    {
      name: "Pear Catch",
      kind: "Game",
      detail: "Click the drifting pear before the timer runs out.",
      app: "pearcatch"
    },
    {
      name: "Pear Pairs",
      kind: "Game",
      detail: "Match pearOS cards with a soft desktop theme.",
      app: "pairs"
    }
  ],
  Documents: [
    {
      name: "pearos.txt",
      kind: "Text",
      detail: "A quick project summary for reviewers.",
      body: "pearOS is a static Hack Club WebOS-style desktop with draggable windows, a dock, desktop icons, themes, a command palette, games, notes, and devlogs."
    },
    {
      name: "roadmap.md",
      kind: "Markdown",
      detail: "Polish tasks that would make the OS feel more complete.",
      body: "Next ideas: wallpaper picker, note export, more mini apps, split-view windows, and a tiny file preview search."
    },
    {
      name: "hackclub.md",
      kind: "Markdown",
      detail: "Requirements tracked for a public WebOS-style mission.",
      body: "No password gate. Include devlogs. Keep the design original. Make the page easy to test."
    },
    {
      name: "live-url.txt",
      kind: "Text",
      detail: "Expected GitHub Pages address.",
      body: "https://plasma-fr.github.io/PearOS/"
    }
  ],
  Projects: [
    {
      name: "window-manager.js",
      kind: "Code",
      detail: "Pointer Events, focus stacking, resize, maximize, and persistence.",
      body: "The window manager keeps windows inside the viewport, restores saved layout, and updates dock state."
    },
    {
      name: "pear-wallpaper.css",
      kind: "Stylesheet",
      detail: "Layered gradients and a CSS pear mark.",
      body: "The wallpaper uses original CSS layers so the project has its own identity without borrowed assets."
    },
    {
      name: "command-palette.md",
      kind: "Markdown",
      detail: "Searchable app launcher.",
      body: "Press the palette shortcut, type an app name, and launch it without reaching for the dock."
    }
  ],
  Devlogs: [
    {
      name: "devlog-1.md",
      kind: "Devlog",
      detail: "Desktop foundation.",
      app: "devlogs",
      body: "Built the wallpaper, menu bar, dock, icon language, and initial Finder shell."
    },
    {
      name: "devlog-2.md",
      kind: "Devlog",
      detail: "Window manager and apps.",
      app: "devlogs",
      body: "Added dragging, stacking, resize, app renderers, and terminal commands."
    },
    {
      name: "devlog-3.md",
      kind: "Devlog",
      detail: "Custom polish.",
      app: "devlogs",
      body: "Added the command palette, themes, saved notes, layout persistence, and mobile adjustments."
    }
  ],
  System: [
    {
      name: "version.txt",
      kind: "System",
      detail: "pearOS 1.1 static edition.",
      body: "A browser-only desktop. No build step, no backend, no login gate."
    },
    {
      name: "storage.json",
      kind: "System",
      detail: "Theme, note, and layout stay in this browser.",
      body: "Saved values are local to this browser. Settings can reset the window layout at any time."
    },
    {
      name: "public.flag",
      kind: "System",
      detail: "Anyone can test without a login gate.",
      body: "This demo is intentionally public and portable."
    }
  ]
};

const logs = [
  ["Desktop foundation", "I started with the wallpaper, menu bar, dock, desktop icons, and Finder shell. The first draft used too much glass, so I made app content more solid and kept the pear identity in CSS instead of borrowed assets."],
  ["Window manager and apps", "I added dragging, stacking, resize, close, minimize, maximize, Finder folders, Terminal commands, Notes, Calculator, Sketch, and two small games. Pointer capture fixed drag bugs when the pointer moved fast."],
  ["Custom features and polish", "I added the Command Palette, app runner search, three themes, Notes saving, layout persistence, devlogs inside the OS, and a mobile layout that keeps every app testable on a phone."]
];

const appMeta = {
  finder: ["Finder", "□", "finder-glyph", 635, 440, "Files and apps"],
  terminal: ["Terminal", ">_", "terminal-glyph", 260, 420, "Command shell"],
  notes: ["Notes", "✎", "notes-glyph", 365, 270, "Local note"],
  calculator: ["Calculator", "+", "calc-glyph", 360, 470, "Quick math"],
  sketch: ["Sketch", "✎", "sketch-glyph", 620, 480, "Canvas"],
  pearcatch: ["Pear Catch", "●", "game-glyph", 440, 460, "Arcade game"],
  pairs: ["Pear Pairs", "▦", "pairs-glyph", 520, 430, "Memory game"],
  devlogs: ["Devlogs", "✦", "devlog-glyph", 640, 440, "Build journal"],
  settings: ["Settings", "●", "settings-glyph", 540, 360, "Desktop controls"],
  about: ["About pearOS", "P", "about-glyph", 580, 440, "Project info"]
};
