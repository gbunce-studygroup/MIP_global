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
                    'html/css/mip_brand_style.css':'assets/scss/mip_brand_style.scss',
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
            brand: {
                files: [
                    // includes files within path
                    {
                        expand: true, 
                        flatten: true,
                        src: ['html/css/mip_brand_style.css'], 
                        dest: 'html/css/', // CHANGE TO MATCH THE CSS LOCATION ON STAGING
                        filter: 'isFile'
                    },
                ],
            },
        },
        

        /* REPLACE NEW VERSION ON STAGING WITH UPDATED URL VERSION SO THAT IMAGES AND FONTS WILL WORK*/
        replace: {
            mipglobal: {
                src: ['html/css/mip_global_grid.css'], // CHANGE TO MATCH THE CSS LOCATION ON STAGING
                overwrite: true, // overwrite matched source files 
                replacements: [{
                    from: '../fonts/',
                    to: "/fonts/globallandingpagesv2/global/" // CHANGE TO MATCH THE FONTS LOCATION ON STAGING
                }]
            },
            glpbrand: {
                src: ['html/css/mip_brand_style.css'], // CHANGE TO MATCH THE CSS LOCATION ON STAGING
                overwrite: true, // overwrite matched source files 
                replacements: [{
                    from: '../fonts/custom_font/',
                    to: "/fonts/globallandingpagesv2/brand/__________ADD_BRAND_FONT_FOLDER_NAME_HERE__________/" // CHANGE TO MATCH THE FONTS LOCATION ON STAGING
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
    grunt.registerTask('mipbrand',['sass', 'autoprefixer', 'copy:brand', 'replace:glpbrand', 'cssmin']);
}