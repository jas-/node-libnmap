/*!
 * libnmap
 * Copyright(c) 2013 Jason Gerfen <jason.gerfen@gmail.com>
 * License: NPSL-0.95
 */

'use strict'

// Identifies the operating system of each host and the software behind
// each open port. OS detection requires root privileges, and is most
// accurate when the host has one open and one closed port.

const nmap = require('../');
const opts = {
  timeout: 300,
  flags: [
    '-O', // OS detection from the TCP/IP stack of the host
    '--osscan-guess', // Give the nearest matches if no match is exact
    '-sV', // Software name and version of each open port
    '--version-intensity 7' // 0 (fast) to 9 (try each probe); default is 7
  ],
  range: ['scanme.nmap.org']
};


nmap.scan(opts, (err, report) => {
  if (err) throw err;

  console.log(JSON.stringify(report, null, 2));
});
