/*!
 * libnmap
 * Copyright(c) 2013 Jason Gerfen <jason.gerfen@gmail.com>
 * License: NPSL-0.95
 */

'use strict'

// The default scan: TCP ports 1-1024 of each host in the range.
// The range accepts hostnames, addresses, CIDR and address ranges.

const nmap = require('../');
const opts = {
  range: ['scanme.nmap.org']
};


nmap.scan(opts, (err, report) => {
  if (err) throw new Error(err);

  console.log(JSON.stringify(report, null, 2));
});
