module.exports = function(grunt) {

    require('load-grunt-plugins-from-parent')(grunt);

    grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

	  	/* SASS */
		sass: {
            dev: {
                options: {
                    style: 'expanded',
                    sourcemap: 'none',
                },
                files: {
                    'html/css/mip_global_grid.css':'assets/scss/mip_global_grid.scss'
                }
            }
        },
        
        
	  	/* LIQUID */
        liquid: {
            options: {
                includes: 'templates/includes',
            },
            pages: {
                files: [{ 
                    expand: true, 
                    flatten: true, 
                    src: 'templates/*.liquid', 
                    dest: 'html/', 
                    ext: '.html' 
                }]
            }
        },
        
        
	  	/* AUTO PREFIX COMPILED CSS */
        autoprefixer: {
            options: {
                browsers: ['last 2 versions']
            },
            // prefix all files in html/css root
            multiple_files: {
                expand: true,
                flatten: true,
                src: 'html/css/*.min.css',
                dest: 'html/css'
            }
        },
        

	  	/* BROWSER SYNC */
        browserSync: {
            bsFiles: {
                src: [
                    'html/css/*.css',
                    'html/*.html',
                    'html/img/*.jpg',
                    'html/img/*.png',
                    'html/img/*.gif'
                ],
            },
            options: {
                watchTask: true,
                debugInfo: true,
                    server: {
                        baseDir: "html/"
                    }
            }
        },


	  	/* MINIFY CSS AND JS */
        cssmin: {
            options: {
                keepSpecialComments: 0
            },            
            target: {
                files: [{
                    expand: true,
                    cwd: 'html/css/',
                    src: ['*.css', '!*.min.css'],
                    dest: 'html/css/',
                    ext: '.min.css'
                }]
            }
        },


	  	/* WATCH */
		watch: {   
            options: {
                livereload: true
            },
            scripts: {
                files: 'assets/scss/**/*.scss',
                tasks: ['sass', 'autoprefixer']
            },
            liquidTemplate: {
                options: {
                    spawn: true
                },
                files: "templates/**/*.liquid",
                tasks: ['liquid']
            }
		},


        /* COPY COMPILED AND AUTOPREFIXED CSS FROM HTML/CSS TO LOCATION ON STAGING */
        copy: {
            main: {
                files: [
                    // includes files within path
                    {
                        expand: true, 
                        flatten: true,
                        src: ['html/css/mip_global_grid.css'], 
                        dest: 'html/css/', // CHANGE TO MATCH THE CSS LOCATION ON STAGING
                        filter: 'isFile'
                    },
                ],
            },
        },
        

        /* REPLACE NEW VERSION ON STAGING WITH UPDATED URL VERSION SO THAT IMAGES AND FONTS WILL WORK*/
        replace: {
            mipglobal: {
                src: ['html/css/mip_global_grid.css'],
                overwrite: true, // overwrite matched source files 
                replacements: [{
                    from: '../fonts/chinese_icons/',
                    to: "/fonts/globallandingpagesv2/global/chinese_icons/"
                }]
            }
        }
	});


    /* LOAD TASK */
    grunt.loadNpmTasksFromParent('grunt-contrib-sass')
    grunt.loadNpmTasksFromParent('grunt-liquid');
    grunt.loadNpmTasksFromParent('grunt-import');
    grunt.loadNpmTasksFromParent('grunt-browser-sync');
    grunt.loadNpmTasksFromParent('grunt-autoprefixer');
    grunt.loadNpmTasksFromParent('grunt-contrib-cssmin');
    grunt.loadNpmTasksFromParent('grunt-contrib-watch');

    /* LOAD TASKS TO UPDATE CSS ON STAGING */
    grunt.loadNpmTasksFromParent('grunt-contrib-copy');
    grunt.loadNpmTasksFromParent('grunt-text-replace');

    /* RUN TASKS */
	grunt.registerTask('default',['sass', 'autoprefixer', 'liquid', 'import']);
	grunt.registerTask('server',['browserSync', 'watch']);
	grunt.registerTask('minify',['cssmin']);

    grunt.registerTask('mipglobal',['sass', 'autoprefixer', 'copy:main', 'replace:mipglobal', 'cssmin']);
}