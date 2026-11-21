/*!
 * libnmap
 * Copyright(c) 2013 Jason Gerfen <jason.gerfen@gmail.com>
 * License: NPSL-0.95
 */

'use strict'

// Finds the neighbors on the IPv4 network of each network interface.
// As root, nmap uses ARP requests, which also give the MAC address.

const nmap = require('../');


nmap.discover((err, report) => {
  if (err) throw err;

  console.log(JSON.stringify(report, null, 2));
});
