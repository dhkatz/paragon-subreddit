const { task, src, dest, watch, series } = require('gulp');

const sass = require('gulp-sass');
const mash = require('gulp-concat-css');
const csso = require('gulp-csso');
const replace = require('gulp-replace');
const autoprefixer = require('gulp-autoprefixer');

const browserSync = require('browser-sync');
const fs = require('fs');

task('build', () => {
    return src('src/theme.scss')
        .pipe(sass())
		.pipe(autoprefixer())
	  	.pipe(mash('paragon.css'))
        .pipe(dest('./build'))
        .pipe(mash('paragon.min.css'))
        .pipe(csso())
        .pipe(dest('./build'))
});

task('serve:scss', () => {

	return src('src/theme.scss')
		.pipe(sass())
		.pipe(autoprefixer())
		.pipe(mash('paragon.css'))
		.pipe(replace(/%%([\w-]+)%%/g, (match, path) => {
			return `/images/${path}.${fs.existsSync(`${process.cwd()}/assets/images/${path}.png`) ? 'png' : 'jpg'}`
		}))
		.pipe(dest('./assets/css'))
		.pipe(mash('paragon.min.css'))
		.pipe(csso())
		.pipe(dest('./assets/css'))
		.pipe(browserSync.stream());
});

task('serve', series(task('serve:scss'), () => {
	browserSync.init({
		proxy: 'https://old.reddit.com/r/paragon',
		files: ['assets/**'],
		injectChanges: true,
		serveStatic: ['./assets'],
		rewriteRules: [
			{
				match: 'https://b.thumbs.redditmedia.com/IcftFLHWVvXurkmMtTxmdRw4hpyDRSuBpGn-GrL_kqk.css',
				fn: () => '/css/paragon.min.css'
			}
		]
	});

	watch('src/**/*.scss', task('serve:scss'));
}));

task('build', task('build'));