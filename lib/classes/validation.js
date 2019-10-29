/*!
 * libnmap
 * Copyright(c) 2013-2019 Jason Gerfen <jason.gerfen@gmail.com>
 * License: MIT
 */

'use strict'

const fs = require('fs');
const hasbin = require('hasbin');


class validation {


  constructor() {

    /**
     * @var messages
     * Error messages
     */
    this.messages = {

      version: 'Discover method requires nodejs v0.11.2 or greater; network ' +
        'range(s) could not be determined',

      path: 'Supplied path for nmap binary is invalid',

      block: 'Supplied blocksize must not exceed 128',

      range: 'Range must be an array of host(s). Examples: ' +
        '192.168.2.10 (single), 10.0.2.0/24 (CIDR), 10.0.10.5-20 (range)',

      port: 'Port(s) must match one of the following examples: ' +
        '512 (single) | 0-65535 (range) | 10-30,80,443,3306-10000 (multiple)',
    };



    /**
     * @var patterns
     * Object with various REGEX patterns to validate network params
     */
    this.patterns = {

      /**
       * @var ports
       * Regex for matching port ranges
       * @ref http://stackoverflow.com/a/21075138/901697
       */
      ports: /\d{1,6}(?:-\d+)?/g,

      /**
       * @var hostname
       * Regex for matching hostnames (RFC-1123)
       */
      hostname: /^(([a-zA-Z]|[a-zA-Z][a-zA-Z0-9\-]*[a-zA-Z0-9])\.)*([A-Za-z]|[A-Za-z][A-Za-z0-9\-]*[A-Za-z0-9])|localhost$/,

      /**
       * @var IPv4
       * Regex for matching IPv4 address types
       */
      IPv4: /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/,

      /**
       * @var IPv4CIDR
       * Regex for matching IPv4 CIDR notation
       */
      IPv4CIDR: /(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])(\/([1-2]\d|3[0-2]|\d))/,

      /**
       * @var IPv4Range
       * Regex for matching IPv4 Range notation
       */
      IPv4Range: /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\-([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/,

      /**
       * @var IPv6
       * Regex for matching IPv6 address types
       */
      IPv6: /^\s*((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))(%.+)?\s*/,

      /**
       * @var IPv6CIDR
       * Regex for matching IPv6 CIDR notation
       */
      IPv6CIDR: /^\s*((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))(%.+)?\s*(\/(\d|\d\d|1[0-1]\d|12[0-8]))$/,
    };
  }


  /**
   * @function init
   * Construct for network/port validation
   *
   * @param {Object} opts - User supplied options
   * @param {Function} cb - Callback
   */
  init(opts, cb) {
    const scope = this;
    let errors = [];
    let result;

    scope.exists(opts.nmap, (result) => {
      if (!result) {

        // Try full path vs. process.env.PATH
        fs.access(opts.nmap, fs.constants.F_OK | fs.constants.X_OK, e => {
          if (e)
            return cb(scope.messages.path);
        });
      }
    });

    if (opts.blocksize > 128)
      return cb(scope.messages.block);

    if ((!opts.range) || (!/array|object/.test(typeof (opts.range))) ||
      (opts.range.length === 0))
      return cb(scope.messages.range);

    if (opts.range.length >= 1) {
      opts.range.forEach(value => {
        scope.verify(value, (err, result) => {
          if (err) return cb(scope.messages.range);
        });
      });
    }

    if (!opts.ports)
      errors.push(new Error(scope.messages.port));

    if (opts.ports) {
      result = opts.ports.match(scope.patterns.ports).join(",");
      if (result == "")
        return cb(scope.messages.port);
    }

    return cb(null, true);
  }


  /**
   * @function verify
   * Verify options provided
   *
   * @param {String} host User supplied configuration object
   * @param {Function} cb - Callback
   *
   * @returns {Function}
   */
  verify(host, cb) {

    if (this.test(this.patterns.hostname, host) ||
      this.test(this.patterns.IPv4, host) ||
      this.test(this.patterns.IPv6, host) ||
      this.test(this.patterns.IPv4CIDR, host) ||
      this.test(this.patterns.IPv6CIDR, host) ||
      this.test(this.patterns.IPv4Range, host)) {
      return cb(null, true);
    }
    else {
      return cb(`Supplied host (${host}) did not pass validation.
        ${this.messages.range}`);
    }
  }


  /**
   * @function test
   * Test specified regex test on string
   *
   * @param {Object} regex - Regex test case
   * @param {String} str - String to perform test on
   *
   * @returns {Boolean}
   */
  test(regex, str) {
    return regex.test(str);
  }


  /**
   * @function exists
   * Binary file tests
   *
   * @param {String} path - Path for file
   *
   * @returns {Boolean}
   */
  exists(path) {
    return hasbin.sync(path);
  }
}


module.exports = new validation;
