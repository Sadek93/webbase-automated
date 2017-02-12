module.exports = function(grunt) {

    require('load-grunt-tasks')(grunt, {
        pattern: ['grunt-*', '@*/grunt-*', 'grunt-contrib-*']
    });

    // Base folders
    var sourcebase = 'assets';
    var targetbase = 'target';
    var distDev = '/distDev';
    var distProd = '/distProd';

    var targetHtmlFilename = '/index.html';
    var targetJsFilename = '/app.min.js';
    var targetCssFilename = '/styles.css';

    var folderstructure = {
        first: '/html/',
        second: '/css/',
        third: '/js/',
        fourth: '/ressources/'
    };

    var config = {
        src: {
            html: sourcebase + folderstructure.first,
            css: sourcebase + folderstructure.second,
            js: sourcebase + folderstructure.third,
            ressources: sourcebase + folderstructure.fourth
        },

        target: {
            dev: {
                html: targetbase + distDev + folderstructure.first,
                css: targetbase + distDev + folderstructure.second,
                js: targetbase + distDev + folderstructure.third,
                ressources: targetbase + distDev + folderstructure.fourth
            },
            prod: {
                html: targetbase + distProd + folderstructure.first,
                css: targetbase + distProd + folderstructure.second,
                js: targetbase + distProd + folderstructure.third,
                ressources: targetbase + distProd + folderstructure.fourth
            }
        }
    };

    // Project configuration
    grunt.initConfig({

        pkg: grunt.file.readJSON('package.json'),

        connect: {
            dev: {
                options: {
                    base: config.target.dev.html
                }
            },
            prod: {
                options: {
                    base: config.target.prod.html,
                    keepalive: true
                }
            }
        },

        uglify: {
            dev: {
                options: {
                    mangle: false,
                    beautify: true
                },
                src: config.src.js + '**/*.js',
                dest: config.target.dev.js + 'app.min.js'
            },
            prod: {
                options: {
                    banner: '/*\nproject: <%= pkg.name %>\ngenerated_on: <%= grunt.template.today("yyyy-mm-dd") %>\nauthor: <%= pkg.author %>\nlicence: <%= pkg.license %> \n*/\n',
                    sourceMap: true,
                    preserveComments: false
                },
                src: config.src.js + '**/*.js',
                dest: config.target.prod.js + targetJsFilename
            }
        },

        // Formerly jade
        pug: {
            dev: {
                options: {
                    pretty: true // output indended html
                },
                src: config.src.html + '*.pug',
                dest: config.target.dev.html + targetHtmlFilename
            },
            prod: {
                src: config.src.html + '*.pug',
                dest: config.target.prod.html + targetHtmlFilename
            }
        },

        clean: {
            html: [config.target.dev.html + '*'],
            css: [config.target.dev.css + '*'],
            js: [config.target.dev.js + '*'],
            res: [config.target.dev.ressources + '*'],

            dev: [targetbase + distDev + '/*'],
            prod: [config.target.prod.html, config.target.prod.css, config.target.prod.js, config.target.prod.ressources]

        },

        copy: {
            res: {
                expand: true,
                cwd: config.src.ressources,
                src: '**/*',
                dest: config.target.dev.ressources
            },
            'res-prod': {
                expand: true,
                cwd: config.src.ressources,
                src: '**/*',
                dest: config.target.prod.ressources
            }
        },

        // Sass css preprocessor
        sass: {
            dev: {
                src: config.src.css + '**/*.sass',
                dest: config.target.dev.css + targetCssFilename
            },
            prod: {
                src: config.src.css + '**/*.sass',
                dest: config.target.prod.css + targetCssFilename
            }
        },

        // Css post processing
        postcss: {
            options: {
                processors: [
                    require('autoprefixer')({
                        browsers: 'last 2 versions'
                    }) // add vendor prefixes
                ]
            },

            dev: {
                src: config.target.dev.css + targetCssFilename
            },
            prod: {
                options: {
                    map: true, // generate inline sourcemaps
                    processors: [
                        require('pixrem')(), // add fallbacks for rem units
                        require('cssnano')() // minify the result
                    ]
                },
                src: config.target.prod.css + targetCssFilename

            }
        },

        jshint: {
            gruntfile: ['Gruntfile.js'],
            base: [config.src.js + '**/*.js'],
        },

        puglint: {
            base: [config.src.html + '**/*.pug']
        },

        sasslint: {
            base: [config.src.css + '**/*.sass']
        },

        // Only used for "exclude" directive
        preprocess: {
            options: {
                inline: true
            },
            html: {
                src: config.target.prod.html + targetHtmlFilename
            },
            css: {
                src: config.target.prod.css + targetCssFilename
            },
            js: {
                src: config.target.prod.js + targetJsFilename
            }
        },


        watch: {
            gruntfile: {
                files: ['Gruntfile.js'],
                tasks: ['jshint:gruntfile']
            },
            html: {
                files: [config.src.html + '**/*.pug'],
                tasks: ['puglint:base', 'clean:html', 'pug:dev']
            },
            res: {
                files: [config.src.ressources + '**/*'],
                tasks: ['clean:res', 'copy:res']
            },
            js: {
                files: [config.src.js + '**/*.js'],
                tasks: ['jshint:base', 'clean:js', 'uglify:dev']
            },
            sass: {
                files: [config.src.css + '**/*'],
                tasks: ['sasslint:base', 'clean:css', 'sass:dev', 'postcss:dev']
            },
            livereload: {
                options: {
                    livereload: true
                },
                files: [ targetbase + distDev + '/**/*']
            }
        }
    });

    // ####################################
    // ## TASKS
    // ####################################

    // The order of the targets defined in the build tasks is important
    // Distributes the entrire dev branch from scratch
    grunt.registerTask('build-dev', ['puglint:base', 'sasslint:base', 'jshint:base', 'clean:dev', 'pug:dev', 'copy:res', 'uglify:dev', 'sass:dev', 'postcss:dev']);
    // Distributes the entrire prod branch from scratch
    grunt.registerTask('build-prod', ['puglint:base', 'sasslint:base', 'jshint:base', 'clean:prod', 'pug:prod', 'preprocess', 'copy:res-prod', 'uglify:prod', 'sass:prod', 'postcss:prod']);

    // Starts a local server with the prod distribution as its base
    grunt.registerTask('prod', ['connect:prod']);
    // Starts a local server with the dev build as its base and watches for changes
    grunt.registerTask('dev-server', ['connect:dev', 'watch']);
    grunt.registerTask('dev', function(){
      grunt.task.run('build-dev', 'dev-server');
    });
    // watches and lints the gruntfile (just for developing purposes)
    // grunt dev watches the gruntfile as well
    grunt.registerTask('gruntfile-dev', ['watch:gruntfile']);
};
