/*!
 * node-libnmap
 * Copyright(c) 2014 Jason Gerfen <jason.gerfen@gmail.com>
 * License: MIT
 */

var version = 'v0.0.7'
  , proc = require('child_process')
  , async = require('async')
  , netmask = require('netmask').Netmask
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
    flags: '-sn -n -oG -',
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
      setup.check()

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
      setup.check()

      opts = setup.init(opts)

      setup.verify(opts)

      var cmd = false
        , hosts = tools.convert(opts.range)

      async.map(hosts, function(host, callback){
        opts.range = host
        cmd = tools.command(opts)

        proc.exec(cmd, opts.callback)
      }, function(err, results){
        opts.callback(err, results)
      })
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
      setup.check()

      opts = setup.init(opts)

      var adapters = setup.adapters()
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
          var scan = results.join()

          neighbors = tools.neighbors(scan)

          report[count].neighbors = neighbors
          count++

          callback(err, report)
        })
      }, function(error, results){
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
     * @function check
     * @abstract Verifies node.js version requirement
     *
     * @returns {Boolean}
     */
    check: function(){
      if (!Number(process.version.match(/^v\d+\.(\d+)/)[1]) > 11)
        throw 'This module only works with node.js v0.11.* and above'
    },

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
     * @function verify
     * @abstract Verify options provided
     *
     * @param {Object} opts - User supplied options
     */
    verify: function(opts){
      if (opts.range) {
        if (!/array|object/.test(typeof(opts.range)))
          throw 'Range must be an array of host(s), examples:'+
            '[192.168.2.10 (single), 10.0.2.0/24 (CIDR), 10.0.10.5-20] (range)'
      }

      if (opts.ports) {
        /* http://stackoverflow.com/a/21075138/901697 */
        if (!/^(?:(?:^|[-,])(?:[1-9][0-9]{0,3}|[1-5][0-9]{4}|6(?:[0-4][0-9]{3}|5(?:[0-4][0-9]{2}|5(?:[0-2][0-9]|3[0-5])))))+$/.test(opts.ports))
          throw 'Port(s) must match one of the following examples:'+
            '512 (single) | 0-65535 (range) | 22-25,80,443,3306 (multiple)'
      }

      return true
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
      var adapters = []

      this.interfaces().forEach(function(element){
        var block = new netmask(element.properties.address+'/'+
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
   * @object validation
   * @abstract Validation utilities
   */
  var validate = validate || {

    /**
     * @var net
     * @abstract Object with various REGEX patterns to validate network notations
     */
    net: {

      /**
       * @var hostname
       * @abstract Regex for matching hostnames (RFC-1123)
       */
      hostname: /^(([a-zA-Z]|[a-zA-Z][a-zA-Z0-9\-]*[a-zA-Z0-9])\.)*([A-Za-z]|[A-Za-z][A-Za-z0-9\-]*[A-Za-z0-9])$/,

      /**
       * @var IPv4
       * @abstract Regex for matching IPv4 address types
       */
      IPv4: /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/,

      /**
       * @var IPv4CIDR
       * @abstract Regex for matching IPv4 CIDR notation
       */
      IPv4CIDR: /(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])(\/([1-2]\d|3[0-2]|\d))/,

      /**
       * @var IPv4Range
       * @abstract Regex for matching IPv4 Range notation
       */
      IPv4Range: false,

      /**
       * @var IPv6
       * @abstract Regex for matching IPv6 address types
       */
      IPv6: /^\s*((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))(%.+)?\s*/,

      /**
       * @var IPv6CIDR
       * @abstract Regex for matching IPv6 CIDR notation
       */
      IPv6CIDR: /^\s*((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))(%.+)?\s*(\/(\d|\d\d|1[0-1]\d|12[0-8]))$/,

      /**
       * @var IPv6Range
       * @abstract Regex for matching IPv6 Range notation
       */
      IPv6Range: false
    },

    /**
     * @function perform
     * @abstract Perform user specified regex test on string
     *
     * @param {Object} regex - Regex test case
     * @param {String} str - String to perform test on
     *
     * @returns {Boolean}
     */
    perform: function(regex, str){
      return regex.test(str)
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
     * @function convert
     * @abstract Uses validate pattern matching to use/convert hosts array
     * items into blocks in the case of CIDR or range element
     *
     * @param {Array} hosts - Array of hosts, CIDR, hostname, IP or range
     *
     * @returns {Array} Array of network blocks to scan
     */
    convert: function(hosts){
      var results = []
        , blocks = []
        , tests = validate.net
        , cidr = false

      hosts.forEach(function(host){
        switch(true){
          case (validate.perform(tests.hostname, host) ||
                validate.perform(tests.IPv4, host) ||
                validate.perform(tests.IPv6, host)):

            results.push(host)

            break
          case (validate.perform(tests.IPv4CIDR, host) ||
                validate.perform(tests.IPv6CIDR, host)):

            cidr = new netmask(host)

            blocks = tools.calculate(cidr.size, {
              start: cidr.first,
              end: cidr.last
            })

            blocks.forEach(function(block){
              results.push(block)
            })

            break
          //case (validate.perform(tests.IPv4Range, host) ||
          //      validate.perform(tests.IPv6Range, host)):
          //  results.push(host)
          //  break
          default:
            break
        }
      })
      return results
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
