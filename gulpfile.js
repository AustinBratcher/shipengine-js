var gulp = require('gulp'); 
var eslint = require('gulp-eslint'); 
var babel = require('gulp-babel'); 
var jasmine = require('gulp-jasmine'); 

var paths = {
    scripts : 'src/**/*.js'
}; 


// gulp.task('default', ['lint'], () => {
//     console.log('Gulp is running'); 
// }); 

gulp.task('default', () => {
    gulp.src(paths.scripts)
        .pipe(gulp.dest('dist'))
});

gulp.task('watch', ()=> {
    gulp.watch(path.scripts, ['default']); 
})

// Clean up source code
gulp.task('lint', () => {
    gulp.src(path.scripts)
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError())
}); 

// Transpile source for distribution
gulp.task('babel', () => {
    gulp.src(paths.scripts)
        .pipe(bable({
            presets: ['@babel/env']
        }))
        .pipe(gulp.dest('dist')); 
});

gulp.task('test', () => {

}); 

