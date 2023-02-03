# WebExtension Vite Starter
A Vite-powered WebExtension ([Chrome](https://developer.chrome.com/docs/extensions/reference/), Firefox, etc.).
 
<p align="center">
<sub>Figma 设计图</sub><br/>
<img width="655" src="https://cdn.jsdelivr.net/gh/pinky-pig/pic-bed/images20230203135717.png"><br/>
</p>

## Features

- ⚡️ 
- 🥝 
- 💬 
- 🌈 
- 🦾 
- 📦 
- 🌟 
- 🖥 
- 🌍 
- 📃 


### UI Frameworks

- [UnoCSS](https://github.com/unocss/unocss) - the instant on-demand Atomic CSS engine


## Usage

### Folders

- `src` - main source.
content script - scripts and components to be injected as `content_script`
  - `background` - scripts for background.
  - `components` - auto-imported Vue components that are shared in the popup and options page.
  - `styles` - styles shared in popup and options page
  - `assets` - assets used in Vue components
  - `manifest.ts` - manifest for the extension.
- `extension` - extension package root.
  - `assets` - static assets (mainly for `manifest.json`).
  - `dist` - built files, also serve stub entry for Vite on development.
- `scripts` - development and bundling helper scripts.

