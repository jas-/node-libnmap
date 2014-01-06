/*!
 * node-libnmap
 * Copyright(c) 2014 Jason Gerfen <jason.gerfen@gmail.com>
 * License: MIT
 */

var os = require('os')

/**
 * @function libnmap
 *
 * @param {String} method - Callable method for libnmap
 * @param {Object} options - Object with options
 */
var libnmap = function(method, options){

  /**
   * @object defaults
   * @abstract Default set of options
   *
   * @param {String} path - Location of nmap binary
   * @param {String} scripts - Location of nmap lua scripts
   */
  var defaults = {
    path: '/usr/bin/nmap',
    scripts: '/usr/bin/nmap/scripts/'
  }

  /**
   * @object methods
   * @abstract Public API
   */
  var methods = methods || {

    /**
     * @function init
     * @abstract Initializes application env requirements
     *
     * @param {Object} opts - User supplied options
     */
    scan: function(opts){

    },

    /**
     * @function init
     * @abstract Initializes application env requirements
     *
     * @param {Object} opts - User supplied options
     */
    discover: function(opts){

    }
  }

  /**
   * @object setup
   * @abstract Performs initial setup requirements
   */
  var setup = setup || {

    /**
     * @function init
     * @abstract Initializes application env requirements
     *
     * @param {Object} opts - User supplied options
     */
    init: function(opts){
      
    }
  }

  /**
   * @object tools
   * @abstract General utilities
   */
  var tools = tools || {

    /**
     * @function merge
     * @abstract Merge/replace default options with user supplied options
     *
     * @param {Object} opts - User supplied options
     * @param {Object} defaults - Default options
     */
    merge: function(opts, defaults){
      for (var item in defaults) {
        if (defaults.hasOwnProperty(item)) {
          opts[item] = defaults[item];
        }
        opts[item] = defaults[item];
      }
      return opts;
    }
  }

  /* Robot, do work */
  if (methods[method]){
    return methods[method].apply(this, Array.prototype.slice.call(arguments, 1))
  } else if ((typeof method==='object')||(!method)){
    return methods.init.apply(this, argumentss)
  } else {
    throw 'Method '+method+' does not exist'
  }
}

exports.libnmap = libnmap
