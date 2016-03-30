module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    concat: {
      options: {
        separator: ';'
      },
      lbm: {
        // lbm.js needs to be the last one
        src: ['src/js/lbm/**/*.js', '!src/js/lbm/lbm.js', 'src/js/lbm/lbm.js'],
        dest: 'dist/js/lbm.js'
      },
      app: {
        src: ['src/js/*.js'],
        dest: 'dist/js/app.js'
      }
    },
    uglify: {
      lbm: {
        files: {
          'dist/js/lbm.min.js': ['<%= concat.lbm.dest %>']
        }
      },
      app: {
        files: {
          'dist/js/app.min.js': ['<%= concat.app.dest %>']
        }
      }
    },
    clean: {
      js: ["dist/js/*.js", "!dist/js/*.min.js"]
    },
    jshint: {
      files: ['Gruntfile.js', 'src/js/**/*.js']
    },
    includeSource: {
      options: {
        basePath: 'dist/'
      },
      dist: {
        files: {
          'dist/index.html': 'src/index.tpl.html'
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-include-source');

  grunt.registerTask('default', ['jshint', 'concat', 'uglify', 'clean', 'includeSource']);
};
