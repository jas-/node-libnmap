/*!
 * libnmap
 * Copyright(c) 2013-2019 Jason Gerfen <jason.gerfen@gmail.com>
 * License: MIT
 */

'use strict'

const os = require('os');
const tools = require('./classes/tools.js')
const reporting = require('./classes/reporting.js')


/**
 * @function nmap
 * The libnmap robot
 * 
 * @param {Object} options - Optional object of default overrides
 * @param {Function} fn - Callback function providing errors and reports
 */
const nmap = function(options, fn) {


  /**
   * @object defaults
   * Default set of options
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
  const defaults = {
    nmap:       'nmap',
    verbose:    false,
    ports:      '1-1024',
    range: [],
    timeout:    120,
    blocksize:  16,
    threshold:  os.cpus().length * 4,
    flags: [
      '-T4',    // Scan optimization is default
    ],
    udp:        false,
    json:       true
  };


  /**
   * @function discover
   * Finds online neighbors
   *
   * @param {Object} obj User supplied options
   * @param {Function} cb User supplied callback function
   */
  nmap.prototype.discover = (obj, cb) => {
    cb = cb || obj;

    let opts = {};

    tools.init(defaults, obj, (err, settings) => {
      if (err)
        return cb(new Error(err));

      opts = settings.opts;
      opts.funcs = settings.funcs;

      tools.worker(opts, (err, data) => {
        if (err)
          return cb(new Error(err));

        cb(null, data);
      });
    });
  };


  /**
   * @function scan
   * Performs scan of specified host/port combination
   *
   * @param {Object} obj User supplied options
   * @param {Function} cb User supplied callback function
   */
  nmap.prototype.scan = (obj, cb) => {
    cb = cb || obj;

    let opts = {};

    tools.init(defaults, obj, (err, settings) => {
      if (err)
        return cb(new Error(err));

      opts = settings.opts;
      opts.funcs = settings.funcs;

      tools.worker(opts, (err, data) => {
        if (err)
          return cb(new Error(err));

        cb(null, data);
      });
    });
  };
};


/* Catch uncaught exceptions */
process.on('uncaughtException', (err) => {
  console.trace(new Error(err));
});


/* robot, do work */
module.exports = new nmap();
