const gulp          = require('gulp'),
		gutil         = require('gulp-util' ),
		sass          = require('gulp-sass'),
		browserSync   = require('browser-sync'),
		concat        = require('gulp-concat'),
		uglify        = require('gulp-uglify'),
		cleancss      = require('gulp-clean-css'),
		rename        = require('gulp-rename'),
		autoprefixer  = require('gulp-autoprefixer'),
		notify        = require('gulp-notify'),
		rsync         = require('gulp-rsync'),
		del 			= require('del'),
		imagemin = require('gulp-imagemin'),
		pngquant = require('imagemin-pngquant');

gulp.task('browser-sync', function() {
	browserSync({
		server: {
			baseDir: 'app'
		},
		notify: false,
		open: true,
		// online: false, // Work Offline Without Internet Connection
		// tunnel: true, tunnel: "projectname", // Demonstration page: http://projectname.localtunnel.me
	})
});

gulp.task('styles', function() {
	return gulp.src('app/sass/**/*.sass')
	.pipe(sass({ outputStyle: 'expanded' }).on("error", notify.onError()))
	.pipe(rename({ suffix: '.min', prefix : '' }))
	.pipe(autoprefixer(['last 15 versions']))
	.pipe(cleancss( {level: { 1: { specialComments: 0 } } })) // Opt., comment out when debugging
	.pipe(gulp.dest('app/css'))
	.pipe(browserSync.stream())
});

gulp.task('scripts', function() {
	return gulp.src([
		'app/js/common.js' // Always at the end
		])
	.pipe(concat('scripts.min.js'))
	.pipe(uglify()) // Mifify js (opt.)
	.pipe(gulp.dest('app/js'))
	.pipe(browserSync.reload({ stream: true }))
	.on('error', gutil.log)
});

gulp.task('code', function() {
	return gulp.src('app/*.html')
	.pipe(browserSync.reload({ stream: true }))
});

gulp.task('img', function(){
	return gulp.src('app/img/**/*')
						.pipe(imagemin({
							interlaced : true,
							progressive : true,
							svgoPlugins : [{removeViewBox : false}],
							use : [pngquant()]
						}))
						.pipe(gulp.dest('dist/img'))
})

gulp.task('rsync', function() {
	return gulp.src('app/**')
	.pipe(rsync({
		root: 'app/',
		hostname: 'username@yousite.com',
		destination: 'yousite/public_html/',
		// include: ['*.htaccess'], // Includes files to deploy
		exclude: ['**/Thumbs.db', '**/*.DS_Store'], // Excludes files from deploy
		recursive: true,
		archive: true,
		silent: false,
		compress: true
	}))
});


gulp.task('watch', function() {
	gulp.watch('app/sass/**/*.sass', gulp.parallel('styles'));
	gulp.watch(['libs/**/*.js', 'app/js/common.js'], gulp.parallel('scripts'));
	gulp.watch('app/*.html', gulp.parallel('code'))
});


gulp.task('default', gulp.parallel('watch', 'styles', 'scripts', 'browser-sync'));



//Building

gulp.task('clean', function(){
	return del(['dist/*']);
});

gulp.task('buildCSS', function(){
	return gulp.src('app/css/main.min.css').pipe(gulp.dest('dist/css'));
});

gulp.task('buildJS', function(){
	return gulp.src('app/js/scripts.min.js').pipe(gulp.dest('dist/js'));
});

gulp.task('buildFonts', function(){
	return gulp.src('app/fonts/*').pipe(gulp.dest('dist/fonts'));
});


gulp.task('buildHtml', function(){
	return 	gulp.src('app/**/*.html').pipe(gulp.dest('dist'));	
});




gulp.task('build',	gulp.series('clean', 'styles', 'scripts', 'buildCSS', 'buildJS', 'buildFonts', 'img', 'buildHtml'));

		
		
		
		


