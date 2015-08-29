/*!
 * node-libnmap
 * Copyright(c) 2013-2015 Jason Gerfen <jason.gerfen@gmail.com>
 * License: MIT
 */

var version = 'v0.2.0'
  , fs = require('fs')
  , os = require('os')
  , async = require('async')
  , hasbin = require('hasbin')
  , ipv6 = require('ipv6').v6
  , xml2js = require('xml2js')
  , ip = require('ip-address')
  , merge = require('deepmerge')
  , proc = require('child_process')
  , netmask = require('netmask').Netmask
  , nmap = function(options, fn) {

  'use strict';

  /**
   * @object defaults
   * @abstract Default set of options
   *
   * @param {Number} threshold - Total spawned process count
   * @param {Number} blocksize - Number of hosts per network scanning block
   * @param {String} nmap - Path to NMAP binary
   * @param {Array} flags - Array of flags for .spawn()
   * @param {Boolean} verbose - Turn on verbosity during scan(s)
   * @param {Array} range - An array of hostnames/ipv4/ipv6, CIDR or ranges
   * @param {String} ports - Range of ports to scan
   */
  var defaults = {
    threshold: os.cpus().length * 2,
    blocksize: os.cpus().length * 2,
    nmap: 'nmap',
    flags: [
      '-oG',
      '-',
      '-T4'
    ],
    verbose: false,
    range: [],
    ports: ''
  };

  /**
   * @method config
   * @scope private
   * @abstract Configuration object
   */
  var config = config || {

    /**
     * @function init
     * @scope private
     * @abstract Merges supplied options & builds functions
     *
     * @param {Object} defaults libnmap default options
     * @param {Object} opts User supplied configuration object
     * @param {Function} cb Callback
     * 
     * @returns {Object}
     */
    init: function(defaults, opts, cb) {
      var funcs = []
        , retErr = false;

      opts = this.merge(defaults, opts);

      validation.init(opts, function(err, result) {
        if (err) retErr = err;
      });

      opts.range = tools.calculate(opts);

      funcs = libs.functions(opts);

      if (retErr) {
        return cb(retErr);
      } else {
        return cb(null, {
          opts: opts,
          funcs: funcs
        });
      }
    },

    /**
     * @function merge
     * @scope private
     * @abstract Perform preliminary option/default object merge
     *
     * @param {Object} defaults Application defaults
     * @param {Object} obj User supplied object
     *
     * @returns {Object}
     */
    merge: function(defaults, obj) {
      defaults = defaults || {};
      return merge(defaults, obj);
    }
  };

  /**
   * @method libs
   * @scope private
   * @abstract Miscellaneous helper libraries
   */
  var libs = libs || {

    /**
     * @function functions
     * @scope private
     * @abstract Create functions for use as callbacks
     *
     * @param {Obect} opts Application defaults
     *
     * @returns {Array}
     */
    functions: function(opts) {
      var funcs = []
        , cmd = false
        , report = [];

      if (opts.range > 0) {
        return fn(new Error("Range of hosts could not be created"));
      }

      opts.range.forEach(function(block){
        funcs.push(function scanblock(callback) {
          cmd = tools.command(opts);

          var execute = proc.exe(cmd);

          execute.stdout.on('data', function(chunk) {
            report.push(chunk);
          });

          execute.stdout.on('end', function() {
            
          });
        });
      });

      return funcs;
    }
  };

  /**
   * @method tools
   * @scope private
   * @abstract Tools object
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
    command: function(opts) {
      var flags = opts.flags.join(' ')
        , v6 = new ipv6.Address(opts.range)
        , option = (v6.isValid()) ? ' -6 ' : ' ';

      return (!opts.ports) ?
        opts.nmap + ' ' + flags + option + opts.range :
        opts.nmap + ' ' + flags + option + ' -p' + opts.ports + ' ' + opts.range;
    },

    /**
     * @function range
     * @abstract Calculates all possible hosts per CIDR
     *
     * @param {Object} opts Application defaults
     * @param {Object} cidr - netmask module object
     *
     * @returns {Array}
     */
    range: function(opts, cidr) {
      var split = cidr.size / opts.blocksize
        , results = [];

      split = (split > 256) ? Math.round(split / 255) : split;

      cidr.forEach(function(ip, long, index) {
        if (index % split === 0) {
          var octets = ip.split('.'),
            start = parseInt(octets[3]),
            end = (parseInt(octets[3]) + split) - 1,
            range = octets[0] + '.' + octets[1] + '.' + octets[2] + '.' + start + '-' + end;
          results.push(range);
        }
      });

      return results;
    },

    /**
     * @function calculate
     * @scope private
     * @abstract Performs calculation on subnet blocks
     *
     * @param {Object} opts Application defaults
     *
     * @returns {Array}
     */
    calculate: function(opts) {
      var blocks = []
        , results = []
        , cidr = false
        , tests = validation.net;

      opts.range.forEach(function(host) {
        switch (true) {

          // If hostname, IPv4 or IPv6 add to array
          case (validation.test(tests.hostname, host) ||
                validation.test(tests.IPv4, host) ||
                validation.test(tests.IPv6, host)):

            results.push(host);

            break;

          // If IPv4 or IPv6 CIDR notation, split into blocks
          case (validation.test(tests.IPv4CIDR, host) ||
                validation.test(tests.IPv6CIDR, host)):

            cidr = new netmask(host);
            blocks = tools.range(opts, cidr);

            blocks.forEach(function(block) {
              results.push(block);
            });

            break;

          // If IPv4 or IPv6 range notation, split into blocks
          case (validation.test(tests.IPv4Range, host)):

            results.push(host);

            break;
          default:
            /* Silently discard specified element as invalid */
            break;
        }
      });

      return results;
    },

    /**
     * @function worker
     * @scope private
     * @abstract Executes object of functions
     *
     * @param {Object} obj User supplied object
     * @param {Array} funcs An array of functions
     * @param {Function} fn Return function
     */
    worker: function(obj, funcs, fn) {
      async.parallelLimit(funcs, obj.threshold, fn);
    }
  };

  /**
   * @method validation
   * @scope private
   * @abstract Validation object
   */
  var validation = validation || {

    pathErr: 'Supplied path for nmap binary is invalid',

    rangeErr: 'Range must be an array of host(s). Examples: ' +
      '192.168.2.10 (single), 10.0.2.0/24 (CIDR), 10.0.10.5-20 (range)',

    portErr: 'Port(s) must match one of the following examples: ' +
      '512 (single) | 0-65535 (range) | 10-30,80,443,3306-10000 (multiple)',

    /**
     * @var net
     * @abstract Object with various REGEX patterns to validate network params
     */
    net: {

      /**
       * @var ports
       * @abstract Regex for matching port ranges
       * @ref http://stackoverflow.com/a/21075138/901697
       */
      ports: /^(?:(?:^|[-,])(?:[1-9][0-9]{0,3}|[1-5][0-9]{4}|6(?:[0-4][0-9]{3}|5(?:[0-4][0-9]{2}|5(?:[0-2][0-9]|3[0-5])))))+$/,

      /**
       * @var hostname
       * @abstract Regex for matching hostnames (RFC-1123)
       */
      hostname: /^(([a-zA-Z]|[a-zA-Z][a-zA-Z0-9\-]*[a-zA-Z0-9])\.)*([A-Za-z]|[A-Za-z][A-Za-z0-9\-]*[A-Za-z0-9])|localhost$/,

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
      IPv4Range: /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\-([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/,

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
    },

    /**
     * @function init
     * @scope private
     * @abstract Construct for network/port validation
     *
     * @param {Object} opts - User supplied options
     * @param {Function} cb - Callback
     */
    init: function(opts, cb) {
      var scope = this;

      scope.exists(opts.nmap, function(err, exists) {
        if (err)
          return cb(new Error(err));
      });

      if (opts.range) {
        if (!/array|object/.test(typeof(opts.range)))
          return cb(new Error(scope.rangeErr));
      }

      opts.range.forEach(function(value) {
        scope.verify(value, function(err, result) {
          if (err)
            return cb(err);
        });
      });

      if (opts.ports) {
        if (!scope.net.ports.test(opts.ports))
          return cb(new Error(scope.portErr));
      }

      return cb(null, true);
    },

    /**
     * @function verify
     * @abstract Verify options provided
     *
     * @param {String} host User supplied configuration object
     * @param {Function} cb - Callback
     * 
     * @returns {Function}
     */
    verify: function(host, cb) {
      if (this.test(this.net.hostname, host) ||
          this.test(this.net.IPv4, host) ||
          this.test(this.net.IPv6, host) ||
          this.test(this.net.IPv4CIDR, host) ||
          this.test(this.net.IPv6CIDR, host) ||
				  this.test(this.net.IPv4Range, host)) {
        return cb(null, true);
      } else {
        return cb(new Error('Supplied host (' + host + ') ' +
                            'did not pass validation. ' + this.rangeErr));
      }
    },

    /**
     * @function test
     * @abstract Test specified regex test on string
     *
     * @param {Object} regex - Regex test case
     * @param {String} str - String to perform test on
     *
     * @returns {Boolean}
     */
    test: function(regex, str) {
      return regex.test(str);
    },

    /**
     * @function exists
     * @abstract Binary file tests
     *
     * @param {String} path - Path for file
     * @param {Function} cb - Callback
     *
     * @returns {Function}
     */
    exists: function(path, cb) {
      var self = this;

      hasbin(path, function(exists) {
        if (!exists) return cb(new Error(self.pathErr));
        return cb(null, true);
      });
    },
  };

  /**
   * @function discover
   * @scope public
   * @abstract Finds online neighbors
   *
   * @param {Object} obj User supplied options
   * @param {Function} cb User supplied callback function
   */
  nmap.prototype.discover = function(obj, cb) {
    cb = cb || obj;

    var opts = {};

    config.init(defaults, obj, function(err, settings) {
      if (err) return cb(err);
      opts = settings;
    });

    cb(null, opts);
  };

  /**
   * @function scan
   * @scope public
   * @abstract Performs scan of specified host/port combination
   *
   * @param {Object} obj User supplied options
   * @param {Function} cb User supplied callback function
   */
  nmap.prototype.scan = function(obj, cb) {
    cb = cb || obj;

    var opts = {};

    config.init(defaults, obj, function(err, settings) {
      if (err) return cb(err);
      opts = settings;
    });

   cb(null, opts);
  };
};

/* robot, do work */
module.exports = new nmap();
