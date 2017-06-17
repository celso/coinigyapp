# Coinigy Desktop App

This is a non official Coinigy App for the Desktop.

It uses [Elecron][2] to build a native wrapper for the Coinigy Website, with a few tweaks.

The app runs nothing but Coinigy's own website and code, with the exception of [this][3] locally injected javascript which you can audit.

![Coinigy](https://raw.githubusercontent.com/celso/coinigyapp/master/assets/screenshot.png)

**Features**

 * Runs independently from your browser, as any desktop app, allowing background running, access through normal app-switching, independent full-screen, dock placement, etc.
 * Quick access to Coinigy's features, including your favorite markets, using standard app menus and shortcuts
 * Menubar icon for quick access
 * Uses native desktop notifications along with Coinigy's web-based, on-screen.

**Caveats**

 * It's been tested of Macs only for now. I have no Windows or Linux machine at hand.

## Build

You'll need [yarn][5].

To build the app from source, open the terminal and type:

```
git clone git@github.com:celso/coinigyapp.git
cd coinigyapp
yarn install
yarn run build
open ~/Desktop/Coinigy-darwin-x64/
```

Move the app to your /Applications folder. You're done.

**Download**

You can find pre-built downloadable binaries in the [releases section][4].

## Disclaimer

I'm not affiliated in any way with Coinigy Inc. I've made this wrapper for my own use. Use it at your own risk. I assume no responsibility or liability for any errors or omissions with this software. The information contained here is provided on an “as is” basis with no guarantees of completeness, accuracy, usefulness or timeliness and without any warranties of any kind whatsoever, express or implied.

[2]: https://electron.atom.io/
[3]: https://github.com/celso/coinigyapp/blob/master/app/preload.js
[4]: https://github.com/celso/coinigyapp/releases
[5]: https://yarnpkg.com/
