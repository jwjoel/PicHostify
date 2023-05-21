<p align="center">
  <a href="https://github.com/jwjoel/PicHostify" >
    <img src="https://cdn.staticaly.com/gh/jwjoel/images-hosting@main/1280800.623frevhd1w0.png" alt="1280800" />
  </a>
</p>

<h1 align="center"> PicHostify - Versatile Image Hosting</h1>

<p align="center">
  <a href="https://github.com/jwjoel/PicHostify/releases"><img src="https://img.shields.io/github/release/jwjoel/PicHostify.svg" alt="Release"></a>
  <a href="https://github.com/jwjoel/PicHostify/blob/main/LICENSE.md"><img src="https://img.shields.io/github/license/jwjoel/PicHostify.svg" alt="License"></a>
</p>

PicHostify is a browser extension based on PicX, offering a comprehensive image hosting solution and image toolkit using the GitHub API. It's free, secure, and facilitates image uploading, hosting, link generation, and offers various image manipulation tools.

---

## :star2: Highlights

- **Quick:** No deployment necessary. Use it directly in your browser with no limitations.
- **Free:** PicHostify is powered by Vue.js and is entirely free of charge.
- **Secure:** Sensitive data like API Keys are stored locally using IndexedDB.

## :book: How to use

Start by creating a [GitHub Token](https://github.com/settings/tokens/new) and use it to configure your PicHostify. It's that simple!

## :inbox_tray: Installation

[PicHostify](https://chrome.google.com/webstore/detail/pichostify/ijfbmlefagnfgejnnpamioalofgicadb) is now available in the Google Chrome App Store, try it [here](https://chrome.google.com/webstore/detail/pichostify/ijfbmlefagnfgejnnpamioalofgicadb).

If you wish to deploy locally:

1. Clone the repository or download the source code:

   ```
   git clone https://github.com/jwjoel/PicHostify.git
   ```

2. Build PicHostify with the commands `npm install` and `npm run build`

3. Open the Extensions page in your browser:

   - In Chrome, navigate to `chrome://extensions/`
   - In Firefox, navigate to `about:addons`

4. Enable developer mode (you'll usually find this as a toggle in the top-right corner of the Extensions page).

5. Click "Load unpacked extension" (Chrome) or "Load Temporary Add-on" (Firefox) and select the `dist` directory within your project folder.

6. PicHostify extension should now be installed and ready to use in your browser's toolbar.

## :sparkles: Features

- **Drop, Paste, File Selection:** Multiple ways to upload images.
- **Image Renaming & Hashing:** Ensure unique names and setting naming prefixes.
- **Batch Operations:** Uploading, deleting, and batch copying of image links.
- **Multi-level Directory Management:** Create and view images in multi-level directories.
- **One-click Copying:** Easily copy image links and freely convert between Markdown and HTML formats.
- **Multiple Image Link Rules:** Built-in support for Staticaly, jsDelivr, ChinaJsDelivr, and more.
- **Custom Image Link Rules:** Configure to suit your needs.
- **Image Compression:** Built-in efficient compression algorithm (webp, mozjpeg, avif) with automatic compression before uploading.
- **Image Watermarks:** Configure for added image protection.
- **Base64 Encoder:** Convert image to Base64 format.
- **Dark Mode:** A more comfortable viewing experience at night.

## :heart: Acknowledgement

We would like to express our deepest gratitude to the original project, [PicX](https://github.com/XPoet/picx), and its [author](https://github.com/XPoet). Their work has laid a solid foundation for PicHostify and inspired our efforts. If you're interested in a web version of PicHostify, we highly recommend visiting the original PicX project.

## :speech_balloon: Feedback

Should you encounter any issues during use, please raise an [issue](https://github.com/jwjoel/PicHostify/issues) for the author to address.

## :handshake: Contribution

We welcome contributions including but not limited to, improving the user interface, adding new features, optimizing performance, fixing bugs, and enhancing documentation.

Thanks to all of the contributors:

<p align="center">
  <a href="https://github.com/jwjoel/PicHostify/graphs/contributors">
    <img src="https://contrib.rocks/image?repo=jwjoel/PicHostify" />
  </a>
</p>

## :balance_scale: License

This project is licensed under [AGPL-3.0](https://github.com/jwjoel/PicHostify/blob/master/LICENSE).
