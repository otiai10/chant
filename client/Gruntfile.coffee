module.exports = (grunt) ->
    grunt.initConfig
        pkg: grunt.file.readJSON 'package.json'
        typescript:
            compile:
                src: ['src/**/*.ts']
                dest: 'build/chant.js'
                options:
                    module: 'commonjs'
                    target: 'es3'
        concat:
            release:
                src: [
                    # dependencies
                    'bower_components/showv/build/showv.js'
                    'bower_components/handlebars/handlebars.js'
                    # tpl
                    'build/tpl/all.js'
                    # src
                    'build/chant.js'
                ]
                dest: 'build/chant.js'
        clean:
            all:
                src: ['build/**/*']
        regarde:
            default:
                files: ['src/**/*.ts']
                tasks: ['build']
        exec:
            release:
                cmd: "cp build/chant.js ../public/javascripts/"
        handlebars:
            options:
                namespace: "HBS"
            compile:
                files:
                    "build/tpl/all.js": "asset/tpl/**/*.hbs"
        uglify:
            release:
                files:
                    "build/chant.min.js":["build/chant.js"] 

    grunt.loadNpmTasks 'grunt-typescript'
    grunt.loadNpmTasks 'grunt-contrib-concat'
    grunt.loadNpmTasks 'grunt-contrib-clean'
    grunt.loadNpmTasks 'grunt-contrib-uglify'
    grunt.loadNpmTasks 'grunt-exec'
    grunt.loadNpmTasks 'grunt-regarde'
    grunt.loadNpmTasks 'grunt-contrib-handlebars'

    grunt.registerTask 'build',   ['handlebars','typescript:compile','concat:release','exec:release']
    grunt.registerTask 'release', ['handlebars','typescript:compile','concat:release','uglify:release','exec:release']
    grunt.registerTask 'watch',   ['build', 'regarde:default']

    grunt.registerTask 'default', ['build']
