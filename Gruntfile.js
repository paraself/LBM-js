module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    concat: {
      options: {
        separator: ';'
      },
      lbm: {
        src: ['src/js/lbm/**/*.js'],
        dest: 'dist/js/lbm.js'
      },
      control: {
        src: ['src/js/*.js'],
        dest: 'dist/js/control.js'
      }
    },
    uglify: {
      lbm: {
        files: {
          'dist/js/lbm.min.js': ['<%= concat.lbm.dest %>']
        }
      },
      control: {
        files: {
          'dist/js/control.min.js': ['<%= concat.control.dest %>']
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
