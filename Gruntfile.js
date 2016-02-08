'use strict';

// # Globbing
// for performance reasons we're only matching one level down:
// '<%= config.src %>/templates/pages/{,*/}*.hbs'
// use this if you want to match all subfolders:
// '<%= config.src %>/templates/pages/**/*.hbs'

module.exports = function(grunt) {

    // Grunt tasks execution time
    require('time-grunt')(grunt);

    grunt.initConfig({

        pkg: grunt.file.readJSON('package.json'),

        assemble: {
            pages: {
                options: {
                    flatten: true,
                    jsApp: 'js',
                    cssApp: 'css',
                    img: 'img',
                    layout: '<%= config.src %>/templates/layouts/default.hbs',
                    data: '<%= config.src %>/data/*.{json,yml}',
                    partials: '<%= config.src %>/templates/partials/*.hbs'
                },
                files: {
                    '<%= config.release %>/': ['<%= config.src %>/templates/pages/*.hbs']
                }
            }
        },


        // Before generating any new files,
        // remove any previously-created files.
        clean: ['<%= config.dist %>/**/*', '<%= config.release %>/**/*'],

        concat: {
            options: {
                separator: ';'
            },
            dist: {
                src: ['<%= config.src %>/js/partials/documentReadyOpen.js','<%= config.src %>/js/vendor/test.js', '<%= config.src %>/js/partials/documentReadyClose.js'],
                dest: '<%= config.release %>/js/momo.js'
            }
        },

        config: {
            dist: 'dist',
            release: 'release',
            src: 'src'
        },

        connect: {
            options: {
                port: 8800,
                livereload: 35729,
                // change this to '0.0.0.0' to access the server from outside
                hostname: 'localhost'
            },
            livereload: {
                options: {
                    open: true,
                    base: [
                        '<%= config.dist %>'
                    ]
                }
            }
        },

        copy: {
            assets: {
                expand: true,
                cwd: '<%= config.src %>/assets/',
                src: '**',
                dest: '<%= config.dist %>/assets/'
            },
            fonts: {
                expand: true,
                cwd: '<%= config.src %>/fonts/',
                src: '**',
                dest: '<%= config.dist %>/fonts/'
            },
            images: {
                expand: true,
                cwd: '<%= config.src %>/img/',
                src: '**',
                dest: '<%= config.dist %>/img/'
            }, js: {
                expand: true,
                cwd: '<%= config.src %>/js/vendor',
                src: '**',
                dest: '<%= config.dist %>/js/vendor'
            }
        },

        // Minify the CSS files
        cssmin: {
            target: {
                files: [{
                    expand: true,
                    cwd: '<%= config.release %>/css',
                    src: ['*.css', 'lang/*.css', '!*.min.css'],
                    dest: '<%= config.dist %>/css',
                    ext: '.min.css'
                }]
            }
        },

        less: {
            production: {
                files: {
                    "<%= config.release %>/css/momo.css": "<%= config.src %>/css/main.less"
                }
            }
        },

        // Prettify the release HTML for distribution
        prettify: {
            all: {
                expand: true,
                cwd: '<%= config.release %>/',
                ext: '.html',
                src: ['*.html'],
                dest: '<%= config.dist %>/'
            }
        },

        uglify: {
            my_target: {
                files: {
                    '<%= config.dist %>/js/momo.min.js': ['<%= config.release %>/js/momo.js']
                }
            }
        },

        watch: {
            assemble: {
                files: ['<%= config.src %>/{content,data,templates}/{,*/}*.{md,hbs,yml,json}'],
                tasks: ['assemble', 'prettify']
            },
            images: {
                files: '<%= config.src %>/img/{,*/}*.{png,jpg,jpeg,gif,webp,svg}',
                tasks: ['copy:images']
            },
            js: {
                files: '<%= config.src %>/js/partials/*.js',
                tasks: ['concat', 'uglify']
            },
            less: {
                files: '<%= config.src %>/css/**/*.less',
                tasks: ['less', 'cssmin']
            },
            livereload: {
                options: {
                    livereload: '<%= connect.options.livereload %>'
                },
                files: [
                    '<%= config.dist %>/{,*/}*.html',
                    '<%= config.dist %>/css/{,*/}*.css',
                    '<%= config.dist %>/js/{,*/}*.js',
                    '<%= config.dist %>/img/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
                ]
            }
        }
    });

    /* load every plugin in package.json */
    grunt.loadNpmTasks('assemble');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-handlebars');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-prettify');

    // GRUNT TASKS
    // Default
    grunt.registerTask('default', ['build']);

    // Build
    grunt.registerTask('build', [
        'clean',
        'copy',
        'less',
        'assemble',
        'cssmin',
        'prettify',
        'concat',
        'uglify',
        'prettify'
    ]);

    // Server
    grunt.registerTask('server', [
        'build',
        'connect:livereload',
        'watch'
    ]);

};
