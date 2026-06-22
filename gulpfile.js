/*global console, require, process*/

const { series, watch, parallel, src, dest }	= require('gulp');
const { deleteAsync }							= require('del');
const chalk										= require('chalk').default;
const pug										= require('gulp-pug');
const sass										= require('gulp-sass')(require('sass'));
const log										= require('fancy-log');
const transpile									= parallel(build_html, build_js, build_styles, build_docs, build_server, build_imgContent, build_imgCfg);

const paths = {
  html: {
    src: "src/scripts/pug/**/*.pug",
    dest: "dist/",
  },
  styles: {
    src: "src/scripts/sass/main.sass",
    watch: "src/scripts/sass/**/*.sass",
    dest: "dist/css/",
  },
  scripts: {
    src: "src/scripts/js/**/*.js",
    dest: "dist/js/",
  },
  docs: {
    src: "src/docs/**",
    dest: "dist/docs/",
  },
  server: {
    src: "src/server/**",
    dest: "dist/",
  },
  imgContent: {
    src: "src/images/content/**",
    dest: "dist/images/",
  },
  imgCfg: {
    src: "src/images/cfg/**",
    dest: "dist/",
  }
};

async function clean_dist() {
	await deleteAsync(['dist/**', '!dist']);
	log(
		'CleanUp:  Distribution Files Removed from' + chalk.cyan(' ./dist/')
	);
}

function build_html() {
	return src(paths.html.src)
		.pipe(pug())
		.pipe(dest(paths.html.dest));
}
function build_js() {
	return src(paths.scripts.src)
		.pipe(dest(paths.scripts.dest));
}
function build_styles() {
	return src(paths.styles.src)
		.pipe(sass())
		.pipe(dest(paths.styles.dest));
}
function build_docs() {
	return src(paths.docs.src, { encoding: false })
		.pipe(dest(paths.docs.dest));
}
function build_server() {
	return src(paths.server.src)
		.pipe(dest(paths.server.dest));
}
function build_imgContent() {
	return src(paths.imgContent.src, { encoding: false })
		.pipe(dest(paths.imgContent.dest));
}
function build_imgCfg() {
	return src(paths.imgCfg.src, { encoding: false })
		.pipe(dest(paths.imgCfg.dest));
}
function watch_files() {
	watch(paths.html.src, build_html);
	watch(paths.styles.watch, build_styles);
	watch(paths.docs.src, build_docs);
	watch(paths.server.src, build_server);
	watch(paths.imgCfg.src, build_imgCfg);
	watch(paths.imgContent.src, build_imgContent);
}

exports.clean = clean_dist;
exports.transpile = transpile;
exports.watch = series(clean_dist, transpile, watch_files);
exports.default = series(clean_dist, transpile);
