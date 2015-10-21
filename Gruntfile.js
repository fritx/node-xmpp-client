'use strict'

var helper = require('./test/helper')

module.exports = function (grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    standard: {
      app: {
        src: [
          '{,examples/,lib/,test/}**/*.js'
        ]
      }
    },
    mochacli: {
      unit: {
        options: { files: [ './test/unit/**/*.js' ] }
      },
      integration: {
        options: { files: [ './test/integration/**/*.js' ] }
      },
      options: {
        reporter: 'spec',
        ui: 'tdd',
        timeout: 10000
      }
    },
    mocha_phantomjs: {
      all: ['test/browser/**/*.html']
    },
    connect: {
      server: {
        options: {
          port: 8000,
          base: '.'
        },
        target: {
          options: {
            keepalive: false
          }
        }
      }
    },
    browserify: {
      dist: {
        files: {
          'node-xmpp-browser.js': ['./index.js']
        },
        options: {
          alias: 'request:browser-request',
          ignore: ['faye-websocket', './srv', 'dns', 'tls']
        }
      }
    },
    clean: ['node-xmpp-browser.js'],
    watch: {
      scripts: {
        files: ['**/*.js'],
        tasks: ['browserify', 'connect'],
        options: {
          spawn: false
        }
      },
      connect: {
        files: ['**/*.js']
      }
    },
    'mocha_istanbul': {
      coveralls: {
        src: 'test/unit',
        options: {
          coverage: true,
          legend: true,
          /* check: {
              lines: 90,
              statements: 90
          }, */
          root: './lib',
          reportFormats: [ 'lcov', 'html' ]
        }
      }
    },
    'validate-package': {
      files: [ './package.json' ]
    }
  })

  grunt.event.on('coverage', function (lcov, done) {
    require('coveralls').handleInput(lcov, function (error) {
      if (error) {
        console.log(error)
        return done(error)
      }
      done()
    })
  })

  // Load the plugins
  grunt.loadNpmTasks('grunt-standard')
  grunt.loadNpmTasks('grunt-mocha-cli')
  grunt.loadNpmTasks('grunt-browserify')
  grunt.loadNpmTasks('grunt-contrib-connect')
  grunt.loadNpmTasks('grunt-contrib-clean')
  grunt.loadNpmTasks('grunt-contrib-watch')
  grunt.loadNpmTasks('grunt-mocha-istanbul')
  grunt.loadNpmTasks('grunt-mocha-phantomjs')
  grunt.loadNpmTasks('grunt-contrib-connect')
  grunt.loadNpmTasks('grunt-nsp-package')

  // Configure tasks
  grunt.registerTask('default', ['test'])
  grunt.registerTask('coveralls', ['mocha_istanbul:coveralls'])
  grunt.registerTask('test', ['clean', 'mochacli:unit', 'standard', 'browserify', 'coveralls'])
  grunt.registerTask('integration-test', ['mochacli:integration', 'test'])
  grunt.registerTask('browser-test', ['browserify', 'connect', 'prosody-start', 'mocha_phantomjs', 'prosody-stop'])
  grunt.registerTask('full-test', ['test', 'validate-package', 'integration-test', 'browser-test'])
  grunt.registerTask('dev', ['browserify', 'connect', 'watch'])

  grunt.registerTask('prosody-start', 'Start Prosody', function () {
    helper.startServer(this.async())
  })
  grunt.registerTask('prosody-stop', 'Stop Prosody', function () {
    helper.stopServer(this.async())
  })
}
