/*!
 * libnmap
 * Copyright(c) 2013 Jason Gerfen <jason.gerfen@gmail.com>
 * License: NPSL-0.95
 */

'use strict'

// Scans a list of ports.
// Examples: '512' (single), '1-65535' (range), '10-30,80,443' (multiple)

const nmap = require('../');
const opts = {
  ports: '21-25,80,443,8000-8100',
  range: ['scanme.nmap.org']
};


nmap.scan(opts, (err, report) => {
  if (err) throw err;

  console.log(JSON.stringify(report, null, 2));
});
