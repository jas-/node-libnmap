/*!
 * libnmap
 * Copyright(c) 2013 Jason Gerfen <jason.gerfen@gmail.com>
 * License: NPSL-0.95
 */

'use strict'

// A slow scan for hosts that are far away, limit the rate of answers, or
// are behind an intrusion detection system. The scan of each port takes
// 10 seconds or more, so keep the list of ports and the range short.

const nmap = require('../');
const opts = {
  timeout: 900, // 900s = 15m for each host
  ports: '22,80,443',
  flags: [
    '-T2', // Polite timing; slower than the default (-T4)
    '--max-retries 10', // Don't give up on slow responding hosts
    '--max-rtt-timeout 2s', // Wait longer for the answer on slow connections
    '--scan-delay 10s', // Account for host 'rate limiting'
    '--max-rate 30', // Send no more than 30 packets each second
  ],
  range: ['scanme.nmap.org'],
};


nmap.scan(opts, function(err, report) {
  if (err) throw err;

  console.log(JSON.stringify(report, null, 2));
});
