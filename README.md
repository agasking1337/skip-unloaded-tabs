# Skip Unloaded Tabs (Zen)

Switch to the next/previous loaded tab in Zen Browser while skipping any unloaded (discarded/sleeping) tabs.

IMPORTANT: This add-on only works with your Logitech horizontal wheel if you map the wheel to custom keystrokes in Logi Options+. The browser cannot capture raw horizontal scroll events.

## Features

- **Skip unloaded tabs**: Jumps over tabs with `discarded === true`.
- **Wrap-around**: Keeps cycling through tabs in the current window.
- **Respects pinned tabs**: Loaded pinned tabs are included; unloaded pinned tabs are skipped.

## Files

- `manifest.json`
- `background.js`

## Requirements

- Zen Browser
- Logi Options+

## Default Shortcuts

The manifest suggests cross-platform shortcuts you can customize:

- **Next loaded tab**: `Ctrl+Shift+Up`
- **Previous loaded tab**: `Ctrl+Shift+Down`

You can change them any time in `about:addons` → gear icon → "Manage Extension Shortcuts".

Note: Browser-reserved keys like `Ctrl+Tab`/`Ctrl+Shift+Tab` cannot be bound by extensions.

## Logitech Horizontal Wheel Mapping (Required)

To make the thumb wheel trigger the extension commands:

- In Logi Options+, create or edit the Zen app profile.
- Assign Keyboard Shortcuts for the thumb wheel:
  - **Scroll Up** → `Ctrl+Shift+Up` (or your chosen "Next" shortcut)
  - **Scroll Down** → `Ctrl+Shift+Down` (or your chosen "Previous" shortcut)
- Ensure you are NOT using the built-in "Switch Tabs" action; it will wake sleeping tabs.

## How It Works

- `background.js` listens for extension commands.
- It queries tabs in the current window sorted by `tab.index`.
- Starting from the active tab, it finds the next/previous tab where `tab.discarded === false`.
- It activates that tab via `browser.tabs.update(tab.id, { active: true })`.

