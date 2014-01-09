/*!
 * node-libnmap
 * Copyright(c) 2014 Jason Gerfen <jason.gerfen@gmail.com>
 * License: MIT
 */

var cluster = require('cluster')
  , version = 'v0.0.3'
  , nmap = function(method, options){

  'use strict'

  /**
   * @object defaults
   * @abstract Default set of options
   *
   * @param {String} nmap - Location of nmap binary
   * @param {String} scripts - Location of nmap lua scripts
   * @param {String} defaults - Default scan options
   * @param {Object} range - Must contain start & end key with value
   * @param {String} ports - Comma separated list of ports to scan
   */
  var defaults = {
    nmap: '/usr/bin/nmap',
    scripts: '/usr/bin/nmap/scripts/',
    flags: '-sn -oG -',
    range: '',
    ports: '',
    callback: function(){}
  }

  /**
   * @object methods
   * @abstract Public API
   */
  var methods = methods || {

    /**
     * @function init
     * @abstract Default method (if none called)
     *
     * @param {Object} opts - User supplied options
     *
     * @returns {Object} - Returns help, license & legal info
     */
    init: function(opts){
      return {
        name: 'node-libnmap',
        version: version,
        usage: 'https://github.com/jas-/node-libnmap',
        license: 'https://github.com/jas-/node-libnmap/blob/master/LICENSE',
        issues: 'https://github.com/jas-/node-libnmap/issues',
        nmap: {
          legal: 'http://nmap.org/book/man-legal.html'
        }
      }
    },

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
     *
     * @returns {Function} - Asyncronously returns callback function
     */
    discover: function(opts){
      opts = setup.init(opts)

      var adapters = setup.adapters()
        , proc = require('child_process')
        , async = require('async')
        , blocks = []
        , neighbors = []
        , report = []
        , obj = {}
        , cmd = false
        , count = 0

      async.map(adapters, function(details, callback){
        obj = details
        report.push(obj)

        blocks = tools.calculate(details.properties.hosts,
                                 details.properties.range)

        async.map(blocks, function(block, cb){
          var res = []

          opts.range = details.properties.cidr
          opts.range = block

          cmd = tools.command(opts)

          proc.exec(cmd, cb)
        }, function(err, results){
          if (err) throw err

          var scan = results.join()

          neighbors = tools.neighbors(scan)

          report[count].neighbors = neighbors
          count++

          callback(null, report)
        })
      }, function(error, results){
        if (error) throw error

        opts.callback(error, results[0])
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
              var tmp = { adapter: i, properties: ifaces[i][x] }
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
        , adapters = []

      this.interfaces().forEach(function(element){
        var block = new Netmask(element.properties.address+'/'+
                                element.properties.netmask)

        element.properties.cidr = block.base+'/'+block.bitmask
        element.properties.hosts = block.size
        element.properties.range = {start: block.first, end: block.last}

        adapters.push(element)
      })

      return adapters
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
        opts.nmap+' '+opts.flags+' '+opts.range :
        opts.nmap+' '+opts.flags+' '+' -p'+opts.ports+' '+opts.range
    },

    /**
     * @function calculate
     * @abstract Generates array of ranges based on adapter properties
     *
     * @param {Integer} size - Size of network block
     * @param {Object} range - Start & End IP addresses
     *
     * @returns {Array} Each CIDR   range split into equal parts
     */
    calculate: function(size, range){
      var cpu = require('os').cpus().length
        , split = size / cpu
        , octetsStart = range.start.split('.')
        , start = parseInt(octetsStart[3])
        , octetsEnd = range.end.split('.')
        , end = parseInt(octetsEnd[3])
        , results = []
        , str = false

      octetsStart.pop()
      octetsEnd.pop()

      for (var i = start; i < end; i += split) {
        str = octetsStart[0]+'.'+octetsStart[1]+'.'+octetsStart[2]+'.'+i+'-'+
          ((i + (split - 1) > 256) ? (i + (split - 1)) : (i + (split - 1) -1))
        results.push(str)
      }
      return results
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
        if (opts.hasOwnProperty(item))
          defaults[item] = opts[item]

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
    return methods.init.apply(this, arguments)
  } else {
    throw 'Method "'+method+'" does not exist, please see node-libnmap API'
  }
}

exports.nmap = nmap
