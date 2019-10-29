/*!
 * libnmap
 * Copyright(c) 2013-2019 Jason Gerfen <jason.gerfen@gmail.com>
 * License: MIT
 */

'use strict'

const nmap = require('../');
const opts = {
  timeout: 900, // 900s = 15m and increases the reliability of scan results
  flags: [
    '-T0', // Paranoid scan type; very slow but accurate
    '--max-retries 10', // Don't give up on slow responding hosts
    '--ttl 200ms', // Accomodate for slow connections by setting the packets TTL value higher
    '--scan-delay 10s', // Account for host 'rate limiting'
    '--max-rate 30', // Slows down packet spewing to account for IDS protections
  ],
  range: ['scanme.nmap.org', '172.17.0.0/24'],
};

nmap.scan(opts, function(err, report) {
  if (err) throw new Error(err);

  for (let item in report) {
    console.log(JSON.stringify(report[item], null, 2));
  }
});
