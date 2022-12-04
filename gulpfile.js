const config = require("./config.json");
const { task, src, dest, watch, series } = require("gulp");

const sass = require("gulp-sass")(require("sass"));
const mash = require("gulp-concat-css");
const clean = require("gulp-clean-css");
const replace = require("gulp-replace");
const autoprefixer = require("gulp-autoprefixer");

const fs = require("fs");
const util = require("util");
const path = require("path");

const browserSync = require("browser-sync");
const fetch = require("node-fetch").default;
const cheerio = require("cheerio");
const snoowrap = require("snoowrap");

task("build", () => {
  return src("src/theme.scss")
    .pipe(sass())
    .pipe(autoprefixer())
    .pipe(mash("theme.css"))
    .pipe(replace(/(\.\.[\/]?)*\/assets\/([\w-]+)\.(png|jpg)/g, "%%$2%%"))
    .pipe(dest("./build"))
    .pipe(mash("theme.min.css"))
    .pipe(clean({ level: { 2: { all: true } } }))
    .pipe(dest("./build"));
});

task("serve:scss", () => {
  return src("src/theme.scss")
    .pipe(sass())
    .pipe(autoprefixer())
    .pipe(mash("theme.css"))
    .pipe(replace(/((\.\.[\/]?)*\/assets)(\/([\w-]+)\.(png|jpg))/g, "$3"))
    .pipe(dest("./assets/css"))
    .pipe(mash("theme.min.css"))
    .pipe(clean({ level: { 2: { all: true } } }))
    .pipe(dest("./assets/css"))
    .pipe(browserSync.stream());
});

task(
  "serve",
  series(task("serve:scss"), async () => {
    const url = `https://old.reddit.com/r/${config.options.subreddit}`;
    const res = await fetch(url);
    const body = await res.text();
    const $ = cheerio.load(body);
    const stylesheet = $("link[title=applied_subreddit_stylesheet]").attr(
      "href"
    );

    browserSync.init({
      proxy: url,
      files: ["assets/**"],
      injectChanges: true,
      serveStatic: ["./assets"],
      rewriteRules: [
        {
          match: stylesheet,
          fn: () => "/css/theme.min.css",
        },
      ],
    });

    watch("src/**/*.scss", task("serve:scss"));
  })
);

task(
  "publish",
  series(task("build"), async () => {
    const reddit = new snoowrap({
      username: config.username,
      password: config.password,
      clientId: config.clientId,
      clientSecret: config.clientSecret,
      userAgent: "Paragon Subreddit (Stylesheet)",
    });

    const subreddit = await reddit
      .getSubreddit(config.options.subreddit)
      .fetch();
    const css = fs.readFileSync("./build/theme.min.css").toString();

    const data = await reddit.oauthRequest({
      uri: `/r/${config.options.subreddit}/about/stylesheet`,
    });

    if (config.options.backup) {
      const writeFile = util.promisify(fs.writeFile);

      if (!fs.existsSync("./backup")) {
        fs.mkdirSync("./backup");
      }

      await Promise.all(
        data.images.map(async ({ name, url }) => {
          const res = await fetch(url);
          const data = await res.arrayBuffer();

          await writeFile(
            `./backup/${name}.${url.slice(-3)}`,
            Buffer.from(data)
          );
        })
      );
    }

    if (config.options.images) {
      const stylesheetImages = [
        ...new Set([...css.matchAll(/%%([\w-]+)%%/g)].map((i) => i[1])),
      ];

      await Promise.all(
        data.images.map(async ({ name, url }) => {
          if (config.options.delete && !stylesheetImages.includes(name)) {
            console.log(`\tDeleting '${name}.${url.slice(-3)}'...`);
            return await subreddit.deleteImage({ imageName: name });
          }
        })
      );

      await Promise.all(
        stylesheetImages.map(async (name) => {
          const assets = path.join(process.cwd(), "./assets/");
          const ext = fs.existsSync(`${assets}/${name}.png`) ? "png" : "jpg";

          console.log(`\tUploading '${name}.${ext}'...`);

          await subreddit.uploadStylesheetImage({
            name,
            file: path.join(process.cwd(), `./assets/${name}.${ext}`),
            imageType: ext,
          });

          console.log(`\tUploaded '${name}.${ext}!'`);
        })
      );
    }

    if (config.options.stylesheet) {
      console.log(`\tUploading stylesheet 'theme.css'...`);

      await subreddit.updateStylesheet({
        css,
        reason: `Publish from /r/${config.options.subreddit} build tool.`,
      });
    }
  })
);

task("default", task("build"));
