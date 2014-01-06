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

  var methods = methods || {

    scan: function(opts){

    },

    discover: function(opts){

    }
  }

  var setup = setup || {
    init: function(opts){
      
    }
  }

  /* Robot, do work */
  if (methods[method]){
    return methods[method].apply(this, Array.prototype.slice.call(args, 1))
  } else if ((typeof method==='object')||(!method)){
    return methods.init.apply(this, args)
  } else {
    throw 'Method '+method+' does not exist'
  }
  return true
}

exports.libnmap = libnmap
