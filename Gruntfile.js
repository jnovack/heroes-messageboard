module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        nodemon: {
            dev: {
                script: 'bin/www',
                options: {
                    ignore: ['node_modules/**', 'public/**','views/**'],
                    ext: 'js',
                    watch: ['.'],
                    env: {
                        NODE_ENV: 'dev'
                    },
                    nodeArgs: ['--debug'],
                    cwd: __dirname,
                    callback: function (nodemon) {
                        nodemon.on('log', function (event) {
                            console.log(event.colour);
                        });
                    },
                }
            }
        },
        watch: {
            files: ['*.js', '**/*.js', '**/*.json', '!**/node_modules/**'],
            tasks: ['jshint']
        },
        jshint: {
            all: ['Gruntfile.js', '*.js', '**/*.js', '**/*.json'],
            options: {
                ignores: ['public/**/*.js','node_modules/**/*.js']
            },
        },
        concurrent: {
            options: {
                "logConcurrentOutput": true
            },
            dev: {
                tasks: ['nodemon', 'watch']
            },
            debug: {
                tasks: ['nodemon', 'watch']
            }
        },
        simplemocha: {
            options: {
                globals: [], // Add whitelisted globals here
                timeout: 3000,
                ignoreLeaks: false,
                ui: 'bdd',
                reporter: 'spec'
            },
            all: { src: ['test/**/*.js'] }
        }
    });

    // Load plugins/tasks
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-concurrent');
    grunt.loadNpmTasks('grunt-nodemon');
    grunt.loadNpmTasks('grunt-simple-mocha');

    // Grunt task(s).
    grunt.registerTask('default', ['concurrent:dev']);
    grunt.registerTask('test', ['simplemocha']);
};