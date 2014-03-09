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
            showv:
                src: ['src/**/*.ts']
                dest: 'build/chant.ts'
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

    grunt.loadNpmTasks 'grunt-typescript'
    grunt.loadNpmTasks 'grunt-contrib-concat'
    grunt.loadNpmTasks 'grunt-contrib-clean'
    grunt.loadNpmTasks 'grunt-exec'
    grunt.loadNpmTasks 'grunt-regarde'

    grunt.registerTask 'build',   ['typescript:compile','exec:release']
    grunt.registerTask 'watch',   ['build', 'regarde:default']

    grunt.registerTask 'default', ['build']
