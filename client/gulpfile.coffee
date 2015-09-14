gulp      = require 'gulp'
react     = require 'gulp-react'
using     = require 'gulp-using' # ファイル名の出力
plumber   = require 'gulp-plumber' # エラー発生時もタスクを継続する
concat    = require 'gulp-concat'
uglify    = require 'gulp-uglify'

build = (device) =>
  return gulp.src ['./src/common/**/*.jsx', "./src/#{device}/**/*.jsx"]
    .pipe plumber() # エラーでも続けて
    .pipe using() # ファイル名出して
    .pipe concat "_chant.#{device}.jsx" # ひとつのファイルにして
    .pipe react() # jsxをビルドして
    .pipe gulp.dest 'dest/' # destにはきれいなjsを置いて

gulp.task 'desktop.release', () =>
  build 'desktop'
    .pipe uglify() # mangleして
    .pipe gulp.dest '../public/js/'

gulp.task 'desktop.dev', () =>
  build 'desktop'
    # .pipe uglify() mangleしない
    .pipe gulp.dest '../public/js/'

gulp.task 'mobile.release', () =>
  build 'mobile'
    .pipe uglify() # mangleして
    .pipe gulp.dest '../public/js/'

gulp.task 'mobile.dev', () =>
  build 'mobile'
    # .pipe uglify() mangleして
    .pipe gulp.dest '../public/js/'

gulp.task 'all.release', ['mobile.release', 'desktop.release']
gulp.task 'all.dev', ['mobile.dev', 'desktop.dev']

gulp.task 'watch', ['all.dev'], () =>
    gulp.watch ['./src/**/*.jsx'], ['all.dev']

gulp.task 'release', ['all.release']

gulp.task 'default', ['watch']
