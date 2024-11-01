const { src, dest, series, watch } = require('gulp');
// CSS-related plug-ins
const sass = require('gulp-sass')(require('sass'));
const postcss = require('gulp-postcss');
const cssnano = require('cssnano');
const autoprefixer = require('autoprefixer');
// Plug-in used to rename files and change their extensions and location
const rename = require('gulp-rename');
// JavaScript-related plug-ins
const babel = require('gulp-babel');
const terser = require('gulp-terser');
// Sourcemaps
const sourcemaps = require('gulp-sourcemaps');
// BrowserSync & reload
const browserSync = require('browser-sync').create();
const reload = browserSync.reload;

const paths = {
  html: "./docs/index.html",
  styles: {
    src: "./src/scss/**/*.scss",
    dist: "./docs/css"
  },
  scripts: {
    src: "./src/js/script.js",
    dist: "./docs/js"
  },
};

function prepareCSS() {
  return src(paths.styles.src)
    .pipe(sourcemaps.init())
    .pipe(sass().on("error", (error) => {
      console.error(`Sass error: ${error}`);
    }))
    .pipe(postcss([
      autoprefixer(),
      cssnano()
    ]))
    .pipe(rename({
      basename: 'style',
      suffix: '.min',
      extname: '.css'
    }))
    .pipe(sourcemaps.write("."))
    .pipe(dest(paths.styles.dist));
}

function transformJS() {
  return src(paths.scripts.src)
    .pipe(sourcemaps.init())
    .pipe(babel({
      presets: ['@babel/env'],
    }).on("error", (error) => {
      console.error(`Babel error: ${error}`);
    }))
    .pipe(terser({
      toplevel: true
    }))
    .pipe(rename({
      basename: 'script',
      suffix: '.min',
      extname: '.js'
    }))
    .pipe(sourcemaps.write("."))
    .pipe(dest(paths.scripts.dist));
}

function startBrowserSync(callback) {
  browserSync.init(
    {
      host: "192.168.1.101",
      port: 3000,
      injectChanges: true,
      server: {
        baseDir: "./docs",
        index: "index.html"
      },
    }
  );

  callback();
}

function watchForChanges() {
  watch(paths.html).on("change", reload);
  watch(paths.styles.src, prepareCSS).on("change", reload);
  watch(paths.scripts.src, transformJS).on("change", reload);
}

module.exports.default = series(prepareCSS, transformJS, startBrowserSync, watchForChanges);