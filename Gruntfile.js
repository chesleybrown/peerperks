'use strict';

module.exports = function(grunt) {
	require('load-grunt-tasks')(grunt);
	
	grunt.initConfig({
		browserify: {
			options: {
				debug: true
			},
			deps: {
				files: {
					'build/js/compiled/deps.js': [
						'web/components/angular/angular.min.js',
						'web/components/angular-route/angular-route.min.js',
						'web/components/firebase/firebase.js',
						'web/components/firebase-simple-login/firebase-simple-login.js',
						'web/components/angularfire/angularfire.min.js',
						'web/components/angularjs-gravatardirective/dist/angularjs-gravatardirective.min.js',
						'web/components/angular-flash/dist/angular-flash.min.js'
					]
				}
			},
			client: {
				files: {
					'build/js/compiled/client.js': [
						'build/js/compiled/config.app.js',
						'web/js/client.js',
						'web/js/directives/**/*.js',
						'web/js/services/**/*.js',
						'web/js/filters/**/*.js'
					]
				}
			}
		},
		uglify: {
			options: {
				mangle: false
			},
			deps: {
				files: {
					'build/js/compiled/deps.js': ['build/js/compiled/deps.js']
				}
			},
			client: {
				files: {
					'build/js/compiled/client.js': ['build/js/compiled/client.js']
				}
			}
		},
		sass: {
			build: {
				options: {
					outputStyle: 'nested',
					includePaths: [
						'web/components/bootstrap-sass-official/vendor/assets/stylesheets'
					]
				},
				files: {
					'build/css/compiled/base.css': 'web/css/base.scss'
				}
			}
		},
		cssmin: {
			options: {
				keepSpecialComments: 0
			},
			build: {
				files: {
					'build/css/compiled/site.css': [
						'build/css/compiled/base.css'
					]
				}
			}
		},
		clean: {
			build: [
				'build'
			],
			css: [
				'build/css/compiled'
			],
			js: [
				'build/js/compiled'
			]
		},
		copy: {
			build: {
				expand: true,
				cwd: 'web',
				src: [
					'*',
					'components/bootstrap-sass-official/vendor/assets/fonts/bootstrap/*'
				],
				dest: 'build/'
			},
			html: {
				expand: true,
				cwd: 'web',
				src: [
					'*.html'
				],
				dest: 'build/'
			}
		},
		connect: {
			server: {
				options: {
					port: 3002,
					hostname: '*',
					base: 'build/',
					livereload: 35730
				}
			}
		},
		ngconstant: {
			options: {
				space: '	',
				name: 'config.app',
				dest: 'build/js/compiled/config.app.js'
			},
			build: {
				constants: grunt.file.readJSON('config.json')
			}
		},
		watch: {
			options: {
				livereload: 35730
			},
			css: {
				files: ['web/css/*.scss'],
				tasks: ['sass:build', 'cssmin:build']
			},
			js: {
				files: ['test/**/*.spec.js', 'web/js/*.js', 'web/js/directives/**/*.js', 'web/js/services/**/*.js', 'web/js/filters/**/*.js'],
				tasks: ['browserify:client']
			},
			html: {
				files: ['web/*.html'],
				tasks: ['copy:html']
			}
		}
	});
	
	grunt.registerTask('default', ['build', 'connect:server', 'watch']);
	grunt.registerTask('server', ['connect:server']);
	
	grunt.registerTask('build', ['clean:build', 'build:css', 'build:js', 'copy:build',]);
	grunt.registerTask('build:js', ['clean:js', 'ngconstant:build', 'browserify:deps', 'browserify:client',]);
	grunt.registerTask('build:css', ['clean:css', 'sass:build', 'compress:css']);
	grunt.registerTask('build:dist', ['build', 'compress:js',]);
	grunt.registerTask('compress:js', ['uglify:deps', 'uglify:client']);
	grunt.registerTask('compress:css', ['cssmin:build']);
}