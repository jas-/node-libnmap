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
    flags: '-sn -oG -',
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

      var adapters = setup.adapters()
        , stream = require('stream')
        , exec = require('child_process').exec
        , obj = {}
        , cmd = false

      setup.cluster(function(){

        adapters.forEach(function(details){
          opts.range = details.properties.cidr
          cmd = tools.command(opts)

          exec(cmd, function(error, stdout){
            if (error) throw error

            obj = details
            obj.neighbors = tools.neighbors(stdout)

            process.on('exit', function(){
              process.send(obj)
            })

            process.exit()
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
     * @param {Function} cb - Function for children processes
     */
    cluster: function(cb){
      if (cluster.isMaster) {
        require('os').cpus().forEach(function(){
          cluster.fork()
        })

        Object.keys(cluster.workers).forEach(function(id){
          cluster.workers[id].on('message', function(msg){
            console.log(msg)
            return msg
          })
        })
      } else {
        cb()
      }
    },

    /**
     * @function end
     * @abstract Terminates cluster children processes
     */
    end: function(){
      Object.keys(cluster.workers).forEach(function(id){
        cluster.workers[id].destroy()
      })
    },

    /**
     * @function interfaces
     * @abstract Obtains object containing network adapters while filtering
     *           local & loopback interfaces
     *
     * @returns {Array} An array network interface objects
     */
    interfaces: function(){
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
     * @function adapters
     * @abstract Determines range of subnet from IPv4/IPv6 addresses
     *
     * @returns {Object} Object of a start & end range
     */
    adapters: function(){
      var Netmask = require('netmask').Netmask
        , ranges = []
        , obj = {}

      this.interfaces().forEach(function(element){
        var block = new Netmask(element.properties.address+'/'+
                                element.properties.netmask)

        element.properties.cidr = block.base+'/'+block.bitmask

        ranges.push(element)
      })

      return ranges
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
     *
     * @returns {String} NMAP scan string
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
     *
     * @returns {Object} Object of a application options
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
     * @function neighbors
     * @abstract Parse and filter results from nmap scan that are online
     *
     * @param {String} result - NMAP scan results
     *
     * @returns {Array} Array of alive hosts
     */
    neighbors: function(results){
      var obj = results.split('\n')
        , items = []

      obj.forEach(function(item){
        if (/status: up/i.test(item))
          var host = /Host: (.*)\s\(\).*/g.exec(item)

          if (typeof(host) == 'object')
            items.push(host[1])
      })

      return items
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
