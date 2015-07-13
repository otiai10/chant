gulp      = require 'gulp'
react     = require 'gulp-react'
using     = require 'gulp-using' # ファイル名の出力
plumber   = require 'gulp-plumber' # エラー発生時もタスクを継続する
concat    = require 'gulp-concat'
uglify    = require 'gulp-uglify'

gulp.task 'react.desktop', () =>
    gulp.src ['./src/common/**/*.jsx', './src/desktop/**/*.jsx']
        .pipe plumber() # エラーでも続けて
        .pipe using() # ファイル名出して
        .pipe concat '_chant.desktop.jsx' # ひとつのファイルにして
        .pipe react() # jsxをビルドして
        .pipe gulp.dest 'dest/' # destにはきれいなjsを置いて
        .pipe uglify() # mangleして
        .pipe gulp.dest '../public/js/'

gulp.task 'react.mobile', () =>
    gulp.src ['./src/common/**/*.jsx', './src/mobile/**/*.jsx']
        .pipe plumber() # エラーでも続けて
        .pipe using() # ファイル名出して
        .pipe concat '_chant.mobile.jsx' # ひとつのファイルにして
        .pipe react() # jsxをビルドして
        .pipe gulp.dest 'dest/' # destにはきれいなjsを置いて
        .pipe uglify() # mangleして
        .pipe gulp.dest '../public/js/'

gulp.task 'react.all', ['react.mobile', 'react.desktop']
gulp.task 'watch', ['react.all'], () =>
    gulp.watch ['./src/**/*.jsx'], ['react.all']

gulp.task 'default', ['watch']
