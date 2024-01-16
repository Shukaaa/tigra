const grunt = require('grunt');
const config = require('./docsi.config.js');
const pageOrder = config['pageOrder'];
const minifyJs = config['build']['minifyJs'];
const minifyCss = config['build']['minifyCss'];
const buildDir = config['build']['buildDir'];
const fileLocations = config['fileLocations'];
const folderLocations = config['folderLocations'];

grunt.loadNpmTasks('grunt-markdown');
grunt.loadNpmTasks('grunt-contrib-concat');
grunt.loadNpmTasks('grunt-contrib-watch');
grunt.loadNpmTasks('grunt-contrib-copy');
grunt.loadNpmTasks('grunt-contrib-clean');
grunt.loadNpmTasks('grunt-contrib-uglify');
grunt.loadNpmTasks('grunt-contrib-cssmin');
grunt.loadNpmTasks('grunt-prettify');

grunt.initConfig({
    concat: {
        options: {
            separator: '\n\n'
        },
        md: {
            src: pageOrder.map(page => `${folderLocations.pages}/${page}.md`),
            dest: 'temp/index.md'
        },
        css: {
            src: [folderLocations.css + '/*.css', folderLocations.css + '/**/*.css', folderLocations.css + '/**/**/*.css'],
            dest: 'temp/style.css'
        },
        js: {
            src: [folderLocations.js + '/*.js', folderLocations.js +  '/**/*.js', folderLocations.js +  '/**/**/*.js'],
            dest: 'temp/script.js'
        }
    },
    clean: {
        dist: {
            src: [buildDir]
        },
        md: {
            src: [buildDir + '/index.md']
        },
        temp: {
            src: ['temp']
        }
    },
    copy: {
        assets: {
            files: [
                {
                    expand: true,
                    cwd: folderLocations.assets + '/',
                    src: ['**'],
                    dest: 'temp/assets/'
                }
            ]
        },
        build: {
            files: [
                {
                    expand: true,
                    cwd: 'temp/',
                    src: ['**'],
                    dest: buildDir + '/'
                }
            ]
        }
    },
    markdown: {
        all: {
            files: [
                {
                    expand: true,
                    src: 'temp/index.md',
                    dest: '',
                    ext: '.html'
                }
            ],
            options: {
                template: fileLocations.template,
                preCompile: (src) => {
                    const preCompile = config.markdown.preCompile;

                    if (preCompile) {
                        return preCompile(src);
                    }

                    return src;
                },
                postCompile: (src) => {
                    const postCompile = config.markdown.postCompile;

                    if (postCompile) {
                        return postCompile(src);
                    }

                    return src;
                }
            }
        }
    },
    watch: {
        configs: {
            files: ['docsi.config.js', fileLocations.template],
            tasks: ['concat', 'markdown']
        },
        md: {
            files: [folderLocations.pages + '/*.md', folderLocations.pages + '/**/*.md', folderLocations.pages + '/**/**/*.md'],
            tasks: ['concat', 'markdown']
        },
        css: {
            files: [folderLocations.css + '/*.css', folderLocations.css + '/**/*.css', folderLocations.css + '/**/**/*.css'],
            tasks: ['concat']
        },
        js: {
            files: [folderLocations.js + '/*.js', folderLocations.js +  '/**/*.js', folderLocations.js +  '/**/**/*.js'],
            tasks: ['concat']
        },
        assets: {
            files: [folderLocations.assets + '/*', folderLocations.assets +  '/**/*', folderLocations.assets +  '/**/**/*'],
            tasks: ['copy']
        }
    },
    uglify: {
        script: {
            files: {
                [buildDir + '/script.js']: [buildDir + '/script.js']
            }
        }
    },
    cssmin: {
        style: {
            files: {
                [buildDir + '/style.css']: [buildDir + '/style.css']
            }
        }
    },
    prettify: {
        one: {
            src: buildDir + '/index.html',
            dest: buildDir + '/index.html'
        }
    }
});

grunt.registerTask('default', () => {
    grunt.log.writeln('Use "grunt dev" to start the development server.');
    grunt.log.writeln('Use "grunt build" to build the project.');
});

process.on('SIGINT', () => {
    grunt.log.writeln('Shutting down development server...');
    grunt.task.run('clean:temp');
})

grunt.registerTask('dev', () => {
    grunt.tasks(['clean:temp', 'concat', 'markdown', 'copy:assets', 'watch'], {}, () => {
        grunt.log.writeln('Development server started.');
    });
});

grunt.registerTask('build', () => {
    grunt.tasks(['clean:temp', 'concat', 'markdown', 'clean:dist', 'copy', 'clean:md', 'prettify', 'clean:temp']);

    if (minifyJs) {
        grunt.task.run('uglify');
    }

    if (minifyCss) {
        grunt.task.run('cssmin');
    }
});