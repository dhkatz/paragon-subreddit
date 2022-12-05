# Paragon Subreddit ![version](https://img.shields.io/badge/version-2.3.0-blue)

[![Build](https://github.com/dhkatz/paragon-subreddit/actions/workflows/build.yml/badge.svg)](https://github.com/dhkatz/paragon-subreddit/actions/workflows/build.yml)
[![Test](https://github.com/dhkatz/paragon-subreddit/actions/workflows/test.yml/badge.svg)](https://github.com/dhkatz/paragon-subreddit/actions/workflows/test.yml)

[/r/Paragon](https://old.reddit.com/r/paragon/) Subreddit CSS - 
Managed by [/u/JejuneKai](https://www.reddit.com/user/JejuneKai)
and [/u/MCiLuZiioNz](https://www.reddit.com/user/mciluziionz)

## Features

**SCSS Features**

* Header image
* User flair
* News ticker
* Link flair
* Featured carousel
* Emotes
* Event and holiday themes
* and so much more!

**Development Features**

* BrowserSync for live reloading
* Sass for CSS preprocessing
* Automatic [CSS validation](./scripts/validate.js) against Reddit's CSS validator
* Automated builds and publishing using GitHub Actions

## Development

### Install

Clone the repository and run `npm install` to install the required dependencies
for building and developing.

### Configuration

Before publishing, you must create a configuration file.
You must create a new file called `config.json` with the necessary options
specified in `config.example.json`.

### Building

To compile the `.scss` to `.css` simply run `npm run build`. The `.scss` will be compiled to
a single `theme.css` and `theme.min.css` file inside the `/build` directory.

### Developing

Running the project in development mode is extremely useful and easy. Simply
run `npm run serve`. This will launch a browser-sync instance with live reloading.
Any changes done to the source files in `src/**/*.scss` will automatically be
re-injected into the webpage. This should work for images as well.

**Note:** You may receive an invalid SSL certificate warning. Simply ignore this as
it is trying to load Reddit's certificate on the proxy site.

### Publishing

#### Manual

You can use the login information supplied inside `config.json` to automatically
publish all changes to the specified subreddit. This includes the stylesheet and
any images referenced inside.

When you're ready to publish, simply run `npm run publish`. This will compile the
`.scss` to `.css` and then upload the stylesheet and any referenced images to the subreddit.

Please note that this process may delete unused images from the subreddit that were
not found inside the built `theme.css`. If you wish to make a backup beforehand or
prevent deletion entirely, please use the appropriate configuration options.

#### Automated

This repository uses GitHub Actions to automate stylesheet publishing. To enable this on
your own repository, please add a `CONFIG` repository secret containing the JSON from your
`config.json` file (just copy and paste it).

Whenever a new tag is pushed to the repository, the publish workflow will automatically
upload the stylesheet and all referenced images to the subreddit based on your configuration.
