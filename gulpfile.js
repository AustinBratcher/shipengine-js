var gulp = require('gulp'); 
var eslint = require('gulp-eslint'); 
var babel = require('gulp-babel'); 
var jasmine = require('gulp-jasmine'); 
var del = require('del'); 


var paths = {
    src : 'src/**/*.js',
    dest: 'dist'
}; 


gulp.task('default', ['lint'], () => {
    console.log('Gulp is running'); 
    // gulp.start('test');
    gulp.start('babel');
}); 

gulp.task('clean', () => {
    return del([paths.dest+'/**/*.js']);
});

gulp.task('watch', () => {
    gulp.watch(path.src, ['default']); 
})

// Clean up source code
gulp.task('lint', () => {
    return gulp.src(paths.src)
        .pipe(eslint({
            useEslintrc: true,
            configFile: './.eslintrc', 
            fix: true
        }))
        .pipe(eslint.format())
        .pipe(eslint.failAfterError())
}); 

// Transpile source for distribution
gulp.task('babel', ['clean'], () => {

    gulp.src(paths.src)
        .pipe(gulp.dest(paths.dest));
    // gulp.src(paths.scripts)
    //     .pipe(bable({
    //         presets: ['@babel/env']
    //     }))
    //     .pipe(gulp.dest('dist')); 
});

gulp.task('test', () => {

}); 

