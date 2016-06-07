/*!
 * libnmap
 * Copyright(c) 2013-2016 Jason Gerfen <jason.gerfen@gmail.com>
 * License: MIT
 */

var version = 'v0.2.33'
  , fs = require('fs')
  , os = require('os')
  , async = require('async')
  , hasbin = require('hasbin')
  , xml2js = require('xml2js')
  , ip = require('ip-address')
  , merge = require('deepmerge')
  , caller = require('caller-id')
  , netmask = require('netmask').Netmask
  , proc = require('child_process').exec
  , v6 = ip.Address6
  , nmap = function(options, fn) {

  /**
   * @object defaults
   * @abstract Default set of options
   *
   * @param {String} nmap - Path to NMAP binary
   * @param {Boolean} verbose - Turn on verbosity during scan(s)
   * @param {String} ports - Range of ports to scan
   * @param {Array} range - An array of hostnames/ipv4/ipv6, CIDR or ranges
   * @param {Number} timeout - Number of seconds to wait for host/port response
   * @param {Number} blocksize - Number of hosts per network scanning block
   * @param {Number} threshold - Max number of  spawned process
   * @param {Array} flags - Array of flags for .spawn()
   * @param {Boolean} udp - Perform a scan using the UDP protocol
   * @param {Boolean} json - JSON object as output, false produces XML
   */
  var defaults = {
    nmap:       'nmap',
    verbose:    false,
    ports:      '1-1024',
    range: [],
    timeout:    120,
    blocksize:  16,
    threshold:  os.cpus().length * 4,
    flags: [
      '-T4',    // Scan optimization
    ],
    udp:        false,
    json:       true
  };

  /**
   * @method config
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
        , called = caller.getData().functionName;

      /* Override 'defaults.flags' array with 'opts.flags' (prevents merge) */
      if (/array/.test(typeof opts.flags))
        defaults.flags = opts.flags;

      opts = tools.merge(defaults, opts);
      opts.called = called;

      /* Ensure we can parse the report */
      if (opts.flags.indexOf('-oX -') === -1)
        opts.flags.push('-oX -');

      validation.init(opts, function(err, result) {
        if (err)
          return cb(err);

        if (/discover/.test(called)) {
          if (!(opts.range = tools.adapters(opts)))
            return cb(new Error(validation.verErr));

          /* Set scan options as static values for 'discover' mode */
          opts.ports = '';
          opts.flags = [
            '-oX -',
            '-sn',
            '-PR'
          ];
        }

        opts.range = network.calculate(opts);
        funcs = tools.funcs(opts);

        return cb(null, {
          opts: opts,
          funcs: funcs
        });
      });
    }
  };

  /**
   * @method reporting
   * @abstract Reporting object
   */
  var reporting = reporting || {

    /**
     * @function reports
     * @abstract Handle results
     *
     * @param {Obect} opts Application defaults
     * @param {Function} cb Return function
     *
     * @returns {Function}
     */
    reports: function(opts, report, cb) {
      if ((!/object/.test(typeof report)) || (report.hasOwnProperty('code')))
        return cb(new Error(report));

      var xml = report.join('');

      if (!opts.json)
        return cb(null, xml);

      try {
        var parserOptions = {
          attrkey: "item",
        }
        , xmlParser = new xml2js.Parser(parserOptions);

        xmlParser.parseString(xml, function parseXML(err, json) {
          if(err)
            return cb(new Error(err));

          cb(null, json.nmaprun);
        });
      } catch(err) {
        return cb(new Error(err));
      }
    }
  };

  /**
   * @method tools
   * @abstract Tools object
   */
  var tools = tools || {

    /**
     * @function merge
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
    },

    /**
     * @function adapters
     * @abstract Obtain network adapter information and return an array of
     *           ranges as an array for CIDR calculations
     *
     * @param {Object} obj User supplied object
     *
     * @returns {Array}
     */
    adapters: function(obj) {
      var ret = []
        , adapter = ''
        , netmask = ''
        , adapters = os.networkInterfaces();

      for (var iface in adapters) {

        for (var dev in adapters[iface]) {
          adapter = adapters[iface][dev];

          if (!adapter.internal) {

            if (!adapter.netmask)
              return false;

            if (adapter.netmask) {

              netmask = adapter.netmask;

              /* Convert netmask to CIDR notation if IPv6 */
              if (validation.test(validation.net.IPv6, netmask)) {
                netmask = new v6(netmask).subnet.substring(1);
              }

              ret.push(adapter.address+'/'+netmask);
            }
          }
        }
      }

      return ret;
    },

    /**
     * @function funcs
     * @abstract Create functions for use as callbacks
     *
     * @param {Obect} opts Application defaults
     *
     * @returns {Array}
     */
    funcs: function(opts) {
      var funcs = {}
        , cmd = false
        , errors = []
        , reports = [];

      if (opts.range > 0)
        return new Error("Range of hosts could not be created");

      Object.keys(opts.range).forEach(function blocks(block) {

        var range = opts.range[block];

        funcs[range] = function block(callback) {
          cmd = tools.command(opts, range);

          if (opts.verbose)
            console.log('Running: '+cmd);

          var report = []
            , execute = proc(cmd, function exe(err, stdout, stderr) {
              if (err)
                return reporting.reports(opts, err, callback);
            });

          execute.stderr.on('data', function errbytes(chunk) {
            /* Silently discard stderr messages to not interupt scans */
          });

          execute.stdout.on('data', function bytes(chunk) {
            report.push(chunk);
          });

          execute.stdout.on('end', function bytesend() {
            if (report.length > 0)
              return reporting.reports(opts, report, callback);
          });
        };
      });

      return funcs;
    },

    /**
     * @function command
     * @abstract Generate nmap command string
     *
     * @param {Object} opts - User supplied options
     * @param {String} block - Network block
     *
     * @returns {String} NMAP scan string
     */
    command: function(opts, block) {
      var flags = opts.flags.join(' ')
        , ip = new v6(block)
        , ipv6 = (ip.isValid()) ? ' -6 ' : ' '
        , proto = (opts.udp) ? ' -sU' : ' '
        , to = '--host-timeout='+opts.timeout+'s ';

      return (opts.ports) ?
        opts.nmap+proto+' '+to+flags+ipv6+'-p'+opts.ports+' '+block :
        opts.nmap+proto+' '+to+flags+ipv6+block;
    },

    /**
     * @function worker
     * @abstract Executes object of functions
     *
     * @param {Object} obj User supplied object
     * @param {Function} fn Return function
     */
    worker: function(obj, fn) {
      async.parallelLimit(obj.funcs, obj.threshold, fn);
    }
  };

  /**
   * @method network
   * @abstract Network object
   */
  var network = network || {

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
          var obj = ip.split('.')
            , start = parseInt(obj[3])
            , end = (parseInt(obj[3]) + split) - 1
            , range = null;

          range = (start === end) ?
            obj[0]+'.'+obj[1]+'.'+obj[2]+'.'+start :
            obj[0]+'.'+obj[1]+'.'+obj[2]+'.'+start+'-'+(end > 255 ? 255 : end);

          results.push(range);
        }
      });

      return results;
    },

    /**
     * @function calculate
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

          case (validation.test(tests.hostname, host) ||
                validation.test(tests.IPv4, host) ||
                validation.test(tests.IPv6, host)):

            results.push(host);

            break;

          case (validation.test(tests.IPv4CIDR, host) ||
                validation.test(tests.IPv6CIDR, host)):

            cidr = new netmask(host);
            blocks = network.range(opts, cidr);

            blocks.forEach(function(block) {
              results.push(block);
            });

            break;

          case (validation.test(tests.IPv4Range, host)):

            results.push(host);

            break;
          default:
            /* Silently discard specified element as invalid */
            break;
        }
      });

      return results;
    }
  };


  /**
   * @method validation
   * @abstract Validation object
   */
  var validation = validation || {

    verErr: 'Discover method requires nodejs v0.11.2 or greater',

    pathErr: 'Supplied path for nmap binary is invalid',

    blockErr: 'Supplied blocksize must not exceed 128',

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
     * @abstract Construct for network/port validation
     *
     * @param {Object} opts - User supplied options
     * @param {Function} cb - Callback
     */
    init: function(opts, cb) {
      var scope = this
        , errors = [];

      if (!scope.exists(opts.nmap))
        errors.push(new Error(scope.pathErr));

      if (opts.blocksize > 128)
        errors.push(new Error(scope.blockErr));

      if (!/discover/.test(opts.called)) {
        if ((!opts.range) || (!/array|object/.test(typeof(opts.range))) ||
            (opts.range.length === 0))
          errors.push(new Error(scope.rangeErr));

        if (opts.range.length >= 1) {
          opts.range.forEach(function(value) {
            scope.verify(value, function(err, result) {
              if (err) return errors.push(err);
            });
          });
        }
      }

      if (opts.ports) {
        if (!scope.net.ports.test(opts.ports))
          errors.push(new Error(scope.portErr));
      }

      return (errors.length > 0) ? cb(errors) : cb(null, true);
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
     *
     * @returns {Boolean}
     */
    exists: function(path) {
      return hasbin.sync(path);
    },
  };

  /**
   * @function discover
   * @abstract Finds online neighbors
   *
   * @param {Object} obj User supplied options
   * @param {Function} cb User supplied callback function
   */
  nmap.prototype.discover = function(obj, cb) {
    cb = cb || obj;

    var opts = {};

    config.init(defaults, obj, function config(err, settings) {
      if (err)
        return cb(err);

      opts = settings.opts;
      opts.funcs = settings.funcs;

      tools.worker(opts, function discover(err, data) {
        if (err)
          return cb(err);

        return cb(null, data);
      });
    });
  };

  /**
   * @function scan
   * @abstract Performs scan of specified host/port combination
   *
   * @param {Object} obj User supplied options
   * @param {Function} cb User supplied callback function
   */
  nmap.prototype.scan = function(obj, cb) {
    cb = cb || obj;

    var opts = {};

    config.init(defaults, obj, function config(err, settings) {
      if (err)
        return cb(err);

      opts = settings.opts;
      opts.funcs = settings.funcs;

      tools.worker(opts, function scan(err, data) {
        if (err)
          return cb(err);

        return cb(null, data);
      });
    });
  };
};

/* robot, do work */
module.exports = new nmap();