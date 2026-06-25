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
      name: "About",
      kind: "Application",
      detail: "Project identity and checklist.",
      app: "about"
    }
  ],
  Documents: [
    {
      name: "pearos.txt",
      kind: "Text",
      detail: "pearOS is a static browser desktop made for Hack Club.",
      body: "A small desktop simulation with draggable windows, a dock, themes, a command palette, and saved local notes."
    },
    {
      name: "roadmap.md",
      kind: "Markdown",
      detail: "Polish tasks that would make the OS feel more complete.",
      body: "Next ideas: wallpaper picker, sketch pad, file search, split-view windows, and exportable notes."
    },
    {
      name: "hackclub.md",
      kind: "Markdown",
      detail: "Requirements tracked for a public WebOS-style mission.",
      body: "No password gate. Include devlogs. Keep the design original. Make the page easy to test."
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
  ["Desktop foundation", "I started with the wallpaper, menu bar, dock, icons, and Finder shell. The first draft used too much glass, so I made app content more solid and kept the pear identity in CSS."],
  ["Window manager and apps", "I added dragging, stacking, resize, close, minimize, maximize, Finder folders, and Terminal commands. Pointer capture fixed drag bugs when the pointer moved fast."],
  ["Custom features and polish", "I added the Command Palette, Notes saving, three themes, layout persistence, devlog tabs, and a mobile layout that is easier to test on a phone."]
];

const appMeta = {
  finder: ["Finder", "□", "finder-glyph", 720, 460, "Files and apps"],
  terminal: ["Terminal", ">_", "terminal-glyph", 680, 420, "Command shell"],
  notes: ["Notes", "✎", "notes-glyph", 560, 400, "Local note"],
  devlogs: ["Devlogs", "✦", "devlog-glyph", 640, 440, "Build journal"],
  settings: ["Settings", "●", "settings-glyph", 540, 360, "Desktop controls"],
  about: ["About", "?", "about-glyph", 580, 440, "Project info"]
};
