/*!
 * libnmap
 * Copyright(c) 2013 Jason Gerfen <jason.gerfen@gmail.com>
 * License: NPSL-0.95
 */

'use strict'

// The timeout is the number of seconds that nmap gives to each host
// (the nmap --host-timeout option). The default is 120 seconds.

const nmap = require('../');
const opts = {
  timeout: 900, // 900s = 15m and increases the reliability of scan results
  range: ['scanme.nmap.org']
};


nmap.scan(opts, (err, report) => {
  if (err) throw err;

  console.log(JSON.stringify(report, null, 2));
});
