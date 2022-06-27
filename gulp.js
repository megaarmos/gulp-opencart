let domain       = 'opencart3x.loc'; 		//Local domain name
let theme        = 'neutron'; 			    //Custom theme opencart name
let preprocessor = 'scss'; 			        // Preprocessor (sass, scss)
let fileswatch   = '+(twig|php|tpl)'; 	// File monitoring, extensions

const { src, dest, parallel, series, watch } = require('gulp');

const sass = require('gulp-sass')(require('sass'));
const postcss = require('gulp-postcss');
const cssnano = require('cssnano');
const terser = require('gulp-terser');
const browsersync = require('browser-sync').create();

// compilation of styles
function styleTask() {
	return src(`catalog/view/theme/${theme}/${preprocessor}/stylesheet.${preprocessor}`, { sourcemaps: true })
		.pipe(sass())
		.pipe(postcss([cssnano()]))
		.pipe(dest(`catalog/view/theme/${theme}/stylesheet`, { sourcemaps: '.' }))
}

// compression of javascript
function jsTask() {
	return src(`catalog/view/theme/${theme}/js/app.js`, { sourcemaps: true })
		.pipe(terser())
		.pipe(dest(`catalog/view/theme/${theme}/javascript`, { sourcemaps: '.' }))
}

function browsersyncServe(cb) {
	browsersync.init({
		proxy: `${domain}`,
		notify: false
	});
	cb();
}

function browsersyncReload(cb) {
	browsersync.reload();
	cb();
}

function watchTask() {
	watch(`catalog/view/theme/${theme}/template/**/*.${fileswatch}`, browsersyncReload);
	watch(`catalog/view/theme/${theme}/${preprocessor}/**/*.${preprocessor}`, series(styleTask, browsersyncReload));
	watch(`catalog/view/theme/${theme}/js/**/*.js`, series(jsTask, browsersyncReload));
}

// run 'gulp' in command line
exports.default = series(
	styleTask,
	jsTask,
	browsersyncServe,
	watchTask
);
