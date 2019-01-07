/*!
 * libnmap
 * Copyright(c) 2013-2019 Jason Gerfen <jason.gerfen@gmail.com>
 * License: MIT
 */

'use strict'

const os = require('os');
const ip = require('ip-address');
const netmask = require('netmask').Netmask;

const validation = require('./validation.js');

const v6 = ip.Address6;


class network {


  /**
   * @function calculate
   * Performs calculation on subnet blocks
   *
   * @param {Object} opts Application defaults
   *
   * @returns {Array}
   */
  validated(opts) {
    let results = [];
    const tests = validation.patterns;

    opts.range.forEach(host => {
      if(validation.test(tests.hostname, host) ||
         validation.test(tests.IPv4, host) ||
         validation.test(tests.IPv4CIDR, host) ||
         validation.test(tests.IPv4Range, host) ||
         validation.test(tests.IPv6CIDR, host)) {
        results.push(host);
      }
    });
    return results;
  }


  /**
   * @function adapters
   * Obtain network adapter information and return an array of
   *           ranges as an array for CIDR calculations
   *
   * @param {Object} obj User supplied object
   *
   * @returns {Array}
   */
  adapters(obj) {
    const ret = [];
    let subnet = '';
    const adapters = os.networkInterfaces();

    if (obj.verbose)
      console.log(adapters);

    for (const iface in adapters) {

      for (const dev in adapters[iface]) {
        let adapter = adapters[iface][dev];

        // Skip if internal
        if (adapter.internal)
          continue;

        // If cidr provide use and continue
        if (adapter.cidr) {
          ret.push(`${adapter.cidr}`);
          continue;
        }

        // If only netmask exists calculate the CIDR
        if (adapter.netmask) {

          subnet = adapter.netmask;

          if (validation.test(validation.patterns.IPv6, subnet)) {

            /* Convert netmask to CIDR notation if IPv6 */
            subnet = new v6(netmask).subnet.substring(1);
          }
          else {

            /* Convert netmask to CIDR */
            subnet = new netmask(`${adapter.address}/${subnet}`);
            adapter.address = subnet.base;
            subnet = subnet.bitmask;
          }

          ret.push(`${adapter.address}/${subnet}`);
        }
      }
    }

    if (obj.verbose)
      console.log(ret);

    return ret;
  }
}


module.exports = new network;
