/* ###################################################
 * Title: GruntFile.js
 * Desc: The grunt build configuration file.
 * Author: Paul Rose
 * Date: December 2015
 * ################################################### */

module.exports = function(grunt) {
  require('load-grunt-tasks')(grunt);

  // some constants for various paths and files to be used by
  // the task configurations
  var BUILD_DIR = 'dist/';
  var BUILD_DIR_JS = BUILD_DIR + 'js/';
  var BUILD_DIR_JS_PLUGINS = BUILD_DIR_JS + 'plugins/';
  var BUILD_DIR_CSS = BUILD_DIR + 'css/';
  var BUILD_FILE_JS = BUILD_DIR_JS + 'app.js';

  var SRC_DIR = 'src/';
  var SRC_DIR_JS = SRC_DIR + 'js/';
  var SRC_DIR_LESS = SRC_DIR + 'less/';
  var SRC_DIR_HTML = SRC_DIR;
  var SRC_FILES_IMG = SRC_DIR + 'img/*';
  var SRC_FILES_ASS = SRC_DIR + 'assets/**/**/*';
  var SRC_FILES_JS = SRC_DIR_JS + ['*.js', '**/*.js'];
  var SRC_FILE_LESS = SRC_DIR_LESS + 'style.less';
  var SRC_FILES_LESS = SRC_DIR_LESS + '*.less';
  var SRC_FILES_HTML = SRC_DIR_HTML + '*.html';

  var AP_BROWSERS = [
        'Android 2.3',
        'Android >= 4',
        'Chrome >= 20',
        'Firefox >= 24', // Firefox 24 is the latest ESR
        'Explorer >= 8',
        'iOS >= 6',
        'Opera >= 12',
        'Safari >= 6'
  ];

  // object to represent the type of environment we are running in.
  // eg. production or development
  var EnvType = {
    prod: 'production',
    dev: 'development'
  };

  // configure the tasks
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    // wipe the build directory clean
    clean: {
      build: {
        src: [BUILD_DIR]
      },
      scripts: {
        src: [BUILD_DIR_JS + '*.js', BUILD_DIR_JS_PLUGINS, '!' + BUILD_FILE_JS]
      }
    },

    // copy files into dist directory
    copy: {
      build: {
        cwd: SRC_DIR,
        src: ['**', '!**/less/**', '**/views/**', '**/img/**', '**/assets/**'],   
        // '!**/js/plugins/**'
        dest: BUILD_DIR,
        expand: true
      }
    },

    // Configure the less compilation for both dev and prod
    less: {
      development: {
        files: {
          "dist/css/style.css": SRC_FILE_LESS,
          "src/css/style.css": SRC_FILE_LESS
        }
      },
      production: {
        options: {
          // minify css in prod mode
          cleancss: true,
        },
        files: {
          "dist/css/style.css": SRC_FILE_LESS
        }
      }
    },
    
    // configure autoprefixing for compiled output css
    autoprefixer: {
      options: {
        browsers: AP_BROWSERS
      },
      development: {
        expand: true,
        cwd: SRC_DIR,
        src: ['css/*.css'],
        dest: SRC_DIR
      },
      production: {
        expand: true,
        cwd: BUILD_DIR,
        src: ['css/*.css'],
        dest: BUILD_DIR
      }
    },

    concat: {
      dist: {
        // if some scripts depend upon eachother,
        // make sure to list them here in order
        // rather than just using the '*' wildcard.
        src: [BUILD_DIR_JS + '**/*.js', BUILD_DIR_JS + '*.js'],
        dest: BUILD_FILE_JS
      }
    },

    // this task minifies the js files.
    uglify: {
      build: {
        options: {
          banner: '/*! <%= pkg.name %>' + 
          '<%= grunt.template.today("dd-mm-yyyy") %> */\n',
          mangle: false
        },
        files: {
          "dist/js/app.js": BUILD_FILE_JS
        }
      }
    },

    htmlmin: {                                   // Task
      production: {                                // Target
        options: {                                 // Target options
          removeComments: true,
          collapseWhitespace: true
        },
        files: {                                   // Dictionary of files
          'dist/index.html': 'src/index.html'   // 'destination': 'source'
        }
      },
      development: {                                       // Another target
        files: {
          'dist/index.html': 'src/index.html'          
        }
      }
    },

    cssmin: {
      target: {
        files: [{
          expand: true,
          cwd: 'src/css',
          src: ['*.css', '!*.min.css', '!style.css'], //??min.css needed
          dest: 'dist/css',
          ext: '.min.css'
        }]
      }
    },

    // grunt-express will serve the files from the folders listed in `bases`
    // on specified `port` and `hostname`
    express: {
      all: {
        options: {
          port: 5000,
          hostname: "0.0.0.0",
          bases: [BUILD_DIR],
          livereload: true
        }
      }
    },

    // configure grunt-watch to monitor the projects files
    // and perform each specific file type build task.
    watch: {
      scripts: {
        options: { livereload: true },
        files: [SRC_FILES_JS],
        tasks: ['concat']
      },
      stylesless: {
        options: { livereload: true },
        files: [SRC_FILES_LESS],
        tasks: ['less:development', 'autoprefixer']
      },
      html: {
        options: { livereload: true },
        files: [SRC_FILES_HTML],
        tasks: ['copy']
      },
      img: {
        options: { livereload: true },
        files: [SRC_FILES_IMG],
        tasks: ['copy']
      },
      assets: {
        options: { livereload: true },
        files: [SRC_FILES_ASS],
        tasks: ['copy']
      }
    },

    // grunt-open will open your browser at the project's URL
    open: {
      all: {
        // Gets the port from the connect configuration
        path: 'http://localhost:<%= express.all.options.port%>'
      }
    }
  });



    
  /**
   * Utility function to register the minify task to grunt.
   * @param  {[type]} mode  [the mode, either dev, or production]
   */
  var registerMinifyTask = function(mode) {
    grunt.registerTask('minify:' + mode, 
      'Minifies css and html files', 
      ['htmlmin:' + mode, 'cssmin']
    );
  };
   

  /**
   * Utility function to register the stylesheets task to grunt.
   * @param  {[type]} mode  [the mode, either dev, or production]
   */
  var registerStyleSheetsTask = function(mode) {
    grunt.registerTask('stylesheets:' + mode,
      'Compiles the stylesheets for development mode',
      ['less:' + mode, 'autoprefixer:' + mode]
    );
  };

  /**
   * Utility function to register the scripts task to grunt.
   * @param  {[type]} mode  [the mode, either dev, or production]
   */
  var registerScriptsTask = function(mode) {

    grunt.registerTask('scripts:' + mode,
      'Compiles the javascript files in ' + mode + ' mode',
      ['concat', 'uglify', 'clean:scripts']
    );
  };

  /**
   * Utility function to register the build task to grunt.
   * @param  {[type]} mode  [the mode, either dev, or production]
   */
  var registerBuildTask = function(mode) {
    grunt.registerTask('build:' + mode, 
      'Compiles all of the assets and copies them' +
      ' to the build directory', 
      ['clean:build', 'copy', 'stylesheets:' + mode, 'scripts:' + mode, 'minify:' + mode]
    );
  };

  /**
   * Utility function to register the server task to grunt.
   * @param  {[type]} mode  [the mode, either dev, or production]
   */
  var registerServerTask = function(mode) {
    var tasks = ['express', 'open'];

    // if we are running in development mode, run the watch task
    if (mode === EnvType.dev) {
      tasks.push('watch');
    } else if (mode === EnvType.prod) {
      tasks.push('express-keepalive');
    }

    grunt.registerTask('server:' + mode,
      'Begins the express server and opens it in a browser' +
      'constantly watching for changes', 
      tasks
    );
  }; 

  /**
   * Utility function to register the main task to grunt.
   * @param  {[type]} mode  [the mode, either dev, or production]
   */
  var registerMainTask = function(mode) {
    grunt.registerTask(mode, 
      'Watches the project for changes' +
      'automatically builds them and runs a server', 
      ['build:' + mode, 'server:' + mode]
    );
  };



  // register all the tasks for both development and production


  registerBuildTask(EnvType.dev);
  registerBuildTask(EnvType.prod);
  registerScriptsTask(EnvType.dev);
  registerScriptsTask(EnvType.prod);
  registerStyleSheetsTask(EnvType.dev);
  registerStyleSheetsTask(EnvType.prod);
  registerMinifyTask(EnvType.dev);
  registerMinifyTask(EnvType.prod);
  registerServerTask(EnvType.dev);
  registerServerTask(EnvType.prod);
  registerMainTask(EnvType.dev);
  registerMainTask(EnvType.prod);  

  // register development mode as the main task
  grunt.registerTask('default', 'Default task: development', 'development');
};
