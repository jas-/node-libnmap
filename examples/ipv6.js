/*!
 * libnmap
 * Copyright(c) 2013 Jason Gerfen <jason.gerfen@gmail.com>
 * License: NPSL-0.95
 */

'use strict'

// Scans IPv4 and IPv6 hosts. nmap scans one address family for each run,
// so this range starts two runs at the same time. The one report has the
// hosts of the two runs.

const nmap = require('../');
const opts = {
  range: ['scanme.nmap.org', '2001:db8::/128']
};


nmap.scan(opts, function(err, report) {
  if (err) throw err;

  console.log(JSON.stringify(report, null, 2));
});
