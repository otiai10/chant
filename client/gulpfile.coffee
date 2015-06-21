gulp      = require 'gulp'
react     = require 'gulp-react'
using     = require 'gulp-using' # ファイル名の出力
plumber   = require 'gulp-plumber' # エラー発生時もタスクを継続する
concat    = require 'gulp-concat'

gulp.task 'react', () =>
    gulp.src ['./src/**/*.jsx', './src/*.jsx']
        .pipe plumber() # エラーでも続けて
        .pipe using() # ファイル名出して
        .pipe concat '_chant.jsx' # ひとつのファイルにして
        .pipe react() # jsxをビルドして
        .pipe gulp.dest 'dest/'
        .pipe gulp.dest '../public/js/'

gulp.task 'watch', ['react'], () =>
    gulp.watch ['./src/**/*.jsx'], ['react']

gulp.task 'default', ['watch']
