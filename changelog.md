# Changelog

## 1.7.0
- you can load up the library, and add scenes in a nodejs environment (but you cannot render).
- `getAllScenes()` returns array of all scenes

## 1.6.0
- added `getConfig(name)` to retrive a config value.

## 1.5.0
- added `setConfig(name, value)` to configure the engine's mechanics.
- BUGFIX: Having a prompt being a string breaks it. String Prompts are now placed inside of a `div>p`
- Option's texts can be null or return null to hide.
- Multiple seperators will collapse into one seperator.
    - Disable with `setConfig("collapseSeperators", false)`

- `setConfig("debugPanel", boolean)` will show/hide the debug panel, regardless of the $hideDebug panel.
- `setConfig("showBrokenLinks", boolean)` will show/hide broken option links by applying a class to the links.

- `<ul>` containing options now has className `options-ul`
- `<div>` containing prompt now has className `prompt`

## 1.4.0
- `getAllFlags()`
- `getScene()`
- `getSceneInfo(id)`
- fixed `resetFlags()` so it properly resets all flags
- error pages now contain a "go back one" button.

## 1.3.0
- Added Debug Panel
    - Highlights broken links
    - Warps to scenes
    - Enable by setting global `$hideDebug` to `false` (if undefined it defaults to true)
- added `setScene(newscene, source)`.
- added `resetFlags()`

## 1.2.0
- Custom HTML can use the scene.
- `.d.ts` typing information
- option seperators
- if `if` returns false, it can add a disabledText, and it will be displayed instead of being hidden
- jsx can be used as prompts without being a function

## 1.0.0