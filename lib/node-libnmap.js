/*!
 * node-libnmap
 * Copyright(c) 2014 Jason Gerfen <jason.gerfen@gmail.com>
 * License: MIT
 */
var libnmap = function(method, options){

  'use strict'

  /**
   * @object defaults
   * @abstract Default set of options
   *
   * @param {String} path - Location of nmap binary
   * @param {String} scripts - Location of nmap lua scripts
   */
  var defaults = {
    path: '/usr/bin/nmap',
    scripts: '/usr/bin/nmap/scripts/',
  }

  /**
   * @object methods
   * @abstract Public API
   */
  var methods = methods || {

    /**
     * @function scan
     * @abstract Performs scan of network device(s)
     *
     * @param {Object} opts - User supplied options
     */
    scan: function(opts){
      opts = setup.init(opts)

    },

    /**
     * @function discover
     * @abstract Performs auto-discovery of network devices
     *
     * @param {Object} opts - User supplied options
     */
    discover: function(opts){
      opts = setup.init(opts)
      tools.range()
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
      return tools.merge(opts, defaults)
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
      opts = opts || {}

      for (var item in defaults){
        if (defaults.hasOwnProperty(item))
          opts[item] = defaults[item]

        opts[item] = defaults[item]
      }

      return opts;
    },

    /**
     * @function adapters
     * @abstract Obtains object containing network adapters while filtering
     *           local & loopback interfaces
     *
     * @returns {Array} An array network interface objects
     */
    adapters: function(){
      var ifaces = require('os').networkInterfaces()
        , obj = []

      for (var i in ifaces) {
        if (/array|object/.test(ifaces[i])){
          for (var x in ifaces[i]){
            if (ifaces[i][x].internal == false){
              obj.push(ifaces[i][x])
            }
          }
        }
      }
      return obj
    },

    /**
     * @function getRange
     * @abstract Determines range of subnet from IPv4/IPv6 addresses
     *
     * @returns {Object} Object of a start & end range
     */
    range: function(){
      var begin, stop

      this.adapters().forEach(function(element){
        if (/IPv4/i.test(element.family)) {
          var v4 = require('ipv6').v4
            , IPv4 = new v4.Address(element.address)

          
        }

        if (/IPv6/i.test(element.family)) {
          var v6 = require('ipv6').v6
            , IPv6 = new v6.Address(element.address)

          
        }
      })

      return {
        start: begin,
        end: stop
      }
    }
  }

  /* Robot, do work */
  if (methods[method]){
    return methods[method].apply(this, Array.prototype.slice.call(arguments, 1))
  } else if ((typeof method==='object')||(!method)){
    return methods.init.apply(this, argumentss)
  } else {
    throw 'Method "'+method+'" does not exist, please see node-libnmap API'
  }
}

exports.libnmap = libnmap
