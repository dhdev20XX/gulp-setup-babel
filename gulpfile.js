const { src, dest, series, watch } = require("gulp");
const babel = require('gulp-babel');
const sass = require("gulp-sass")(require("sass"));
const minifyCss = require("gulp-clean-css");
const sourcemaps = require("gulp-sourcemaps");
const uglify = require("gulp-uglify");
const concat = require("gulp-concat");
const browsersync = require("browser-sync").create();
const autoprefixer = require('gulp-autoprefixer');
var buffer = require('vinyl-buffer');
var source = require('vinyl-source-stream')
var rollupStream = require('@rollup/stream');


function sassTask() {
    return src("src/scss/style.scss")
        .pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(autoprefixer('last 2 versions'))
        .pipe(minifyCss())
        //.pipe(concat("bundle.css"))
        .pipe(sourcemaps.write("."))
        .pipe(dest("dist/css"));
}

// function jsTask() {
//     return src("src/js/*.js")
//         .pipe(sourcemaps.init())
//         .pipe(babel({presets: ['@babel/env']}))
//         // .pipe(concat("main.js"))
//         .pipe(uglify())
//         .pipe(sourcemaps.write())
//         .pipe(dest("dist/js"));
// }

function jsTask() {
    const options = { input: 'src/js/main.js', output: { sourcemap: true } };
    return rollupStream(options)
        .pipe(source('bundle.js'))
        .pipe(buffer())
        .pipe(sourcemaps.init())
        .pipe(babel({presets: ['@babel/env']}))
        // .pipe(concat("main.js"))
        .pipe(uglify())
        .pipe(sourcemaps.write())
        .pipe(dest("dist/js"));
}

function browsersyncServe(cb) {
    browsersync.init({
        server: {
            baseDir: ".",
        },
    });
    cb();
}

function browsersyncReload(cb) {
    browsersync.reload();
    cb();
}

function watchTask() {
    watch("*.html", browsersyncReload);
    watch("src/scss/*.scss", series(sassTask, browsersyncReload));
    watch("src/js/*.js", series(jsTask, browsersyncReload));
}

exports.default = series(sassTask, jsTask, browsersyncServe, watchTask);
