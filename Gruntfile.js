module.exports = function(grunt){
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      options: {
        seperator: ';'
      },
      dist: {
        src: ['client/app.js', 
              'client/app/**/*.js'
        ],
        dest: 'client/dist/app.js'
      }
    },
    nodemon: {
      dev: {
        script: 'server/server.js'
      }
    },

    uglify: {
      dist: {
        files: {
          'client/dist/app.min.js': ['client/dist/app.js']
        }
      }
    },

    jshint: {
      files: [
        'server/server.js',
        'client/app/**/*.js',
        // client folder
        'client/*.js'
      ],
      options: {
        force: 'true',
        jshintrc: '.jshintrc',
        ignores: [
        'client/dist/**/*.js'
        ]
      }
    },

    cssmin: {
      target: {
        files:[{
          src: ['client/styles.css'],
          dest: 'client/dist/styles.css',
          ext: '.min.css'
        }]
      }
    },

    mochaTest: {
      test: {
        options: {
          reporter: 'spec'
        },
        src: ['specs/**/*.js']
      }
    },

    watch: {
      scripts: {
        files: [
          'client/**/*.js'
        ],
        tasks: [
        'concat',
        'uglify'
        ]
      },
      css: {
        files: 'client/*.css',
        tasks: ['cssmin']
      }
    },

    shell: {
      prodServer: {
        command: 'git push heroku master'
      }
    },
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-nodemon');

  grunt.registerTask('server-dev', function(target){
    var nodemon = grunt.util.spawn({
         cmd: 'grunt',
         grunt: true,
         args: 'nodemon'
    });
    nodemon.stdout.pipe(process.stdout);
    nodemon.stderr.pipe(process.stderr);

    grunt.task.run([ 'watch' ]);
    });

    grunt.registerTask('test', [
      'mochaTest'
    ]);

    grunt.registerTask('build', [
      'concat',
      'uglify',
      'cssmin',
      'jshint',
      'test'
    ]);

    grunt.registerTask('upload', function(n) {
      if(grunt.option('prod')) {
        grunt.task.run(['shell:prodServer']);
      } else {
        grunt.task.run([ 'server-dev' ]);
      }
    });

    grunt.registerTask('default', [
      'build',
      'upload'
    ]);
};
