/*!
 * libnmap
 * Copyright(c) 2013 Jason Gerfen <jason.gerfen@gmail.com>
 * License: NPSL-0.95
 */

'use strict'

// Scans UDP ports (the nmap -sU option). A UDP scan requires root
// privileges, and is slow: a closed port can limit the rate of the answers.

const nmap = require('../');
const opts = {
  udp: true,
  ports: '53,67,123,161',
  range: ['scanme.nmap.org']
};


nmap.scan(opts, function(err, report) {
  if (err) throw err;

  console.log(JSON.stringify(report, null, 2));
});
