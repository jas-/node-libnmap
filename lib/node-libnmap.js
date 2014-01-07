/*!
 * node-libnmap
 * Copyright(c) 2014 Jason Gerfen <jason.gerfen@gmail.com>
 * License: MIT
 */

var cluster = require('cluster')
  , libnmap = function(method, options){

  'use strict'

  /**
   * @object defaults
   * @abstract Default set of options
   *
   * @param {String} path - Location of nmap binary
   * @param {String} scripts - Location of nmap lua scripts
   * @param {String} defaults - Default scan options
   * @param {Object} range - Must contain start & end key with value
   * @param {String} ports - Comma separated list of ports to scan
   */
  var defaults = {
    path: '/usr/bin/nmap',
    scripts: '/usr/bin/nmap/scripts/',
    flags: '-sn',
    range: '',
    ports: ''
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

      var range = tools.range()
        , exec = require('child_process').exec
        , cmd = false

      setup.cluster(opts, function(){
        range.forEach(function(subnet){
          opts.range = subnet
          cmd = tools.command(opts)

          exec(cmd, function (error, stdout){
            if (error) throw error
            console.log('STDOUT '+stdout)
          })
        })
      })
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
    },

    /**
     * @function cluster
     * @abstract Creates clustered env for nmap scan(s)
     *
     * @param {Object} opts - User supplied options
     * @param {Function} cb - Function for children processes
     */
    cluster: function(opts, cb){
      if (cluster.isMaster) {
        require('os').cpus().forEach(function(){
          cluster.fork()
        })
        cluster.on('exit, disconnect', function(worker){
          cluster.fork()
        })
      } else {
        cb()
      }
    },

    /**
     * @function end
     * @abstract Terminates cluster children processes
     *
     * @param {Object} opts - User supplied options
     */
    end: function(opts){
      for(var i in cluster.workers) {
        cluster.workers[i].destroy()
      }
    }
  }

  /**
   * @object tools
   * @abstract General utilities
   */
  var tools = tools || {

    /**
     * @function command
     * @abstract Generate nmap command string
     *
     * @param {Object} opts - User supplied options
     */
    command: function(opts){
      return (!opts.ports) ?
        opts.path+' '+opts.flags+' '+opts.range :
        opts.path+' '+opts.flags+' '+' -p'+opts.ports+' '+opts.range
    },

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
            if (/false/.test(ifaces[i][x].internal) &&
                /ipv4/i.test(ifaces[i][x].family)){
              var tmp = { interface: i, properties: ifaces[i][x] }
              obj.push(tmp)
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
      var Netmask = require('netmask').Netmask
        , ranges = []

      this.adapters().forEach(function(element){
        var block = new Netmask(element.properties.address+'/'+
                                element.properties.netmask)

        ranges.push(block.base+'/'+block.bitmask)
      })

      return ranges
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
