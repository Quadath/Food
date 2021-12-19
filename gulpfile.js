const gulp        = require('gulp');
const browserSync = require('browser-sync');
const sass        = require('gulp-sass')(require('sass'));
const rename = require("gulp-rename");
const htmlmin = require('gulp-htmlmin');

function server() {
    browserSync({server:{baseDir: "src"}});
    browserSync.stream;
    gulp.watch("src/*.html", reloading);
    }

function reloading(done)
{
    browserSync.reload();
    console.log('\x1b[32m','Site reloaded')
    done();
}

function styles(done)
{
    gulp.src('src/sass/*sass')
        .pipe(sass({
            errorLogToConsole:true,
        })).on('error', console.error.bind(console))
        .pipe(gulp.dest('src/css/'))
        .pipe(browserSync.reload({
            stream: true
          }))
        done();
    gulp.src('src/sass/*sass')
        .pipe(sass({
            errorLogToConsole:true,
            outputStyle:'compressed'
        })).on('error', console.error.bind(console))
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('src/css/'));
    console.log('\x1b[32m','SASS compiled.');
}
gulp.task('watch', function() {
    gulp.watch("src/sass/*.+(scss|sass|css)", gulp.parallel(styles, reloading));
    gulp.watch("src/*.html").on('change', gulp.parallel('html'));
    gulp.watch("src/js/**/*.js").on('change', gulp.parallel('scripts'));
    gulp.watch("src/fonts/**/*").on('all', gulp.parallel('fonts'));
    gulp.watch("src/icons/**/*").on('all', gulp.parallel('icons'));
    gulp.watch("src/img/**/*").on('all', gulp.parallel('images'));
});

gulp.task('html', function () {
    return gulp.src("src/*.html")
        .pipe(htmlmin({ collapseWhitespace: true }))
        .pipe(gulp.dest("dist/"));
});
gulp.task('scripts', function () {
    return gulp.src("src/js/**/*.js")
        .pipe(gulp.dest("dist/js"))
        .pipe(browserSync.stream());
});

gulp.task('fonts', function () {
    return gulp.src("src/fonts/**/*")
        .pipe(gulp.dest("dist/fonts"))
        .pipe(browserSync.stream());
});

gulp.task('icons', function () {
    return gulp.src("src/icons/**/*")
        .pipe(gulp.dest("dist/icons"))
        .pipe(browserSync.stream());
});

gulp.task('images', function () {
    return gulp.src("src/img/**/*")
        .pipe(gulp.dest("dist/img"))
        .pipe(browserSync.stream());
});

function print(done)
{
    console.log('\x1b[36m','SASS compiling started.');
    done();
}
gulp.task('default', gulp.parallel('watch', server, styles, 'scripts', 'fonts', 'icons', 'html', 'images'));