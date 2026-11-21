/*!
 * libnmap
 * Copyright(c) 2013 Jason Gerfen <jason.gerfen@gmail.com>
 * License: NPSL-0.95
 */

'use strict'

// Writes the report of one scan to a file.

const fs = require('fs');
const nmap = require('../');
const opts = {
  range: ['scanme.nmap.org'],
  ports: '21,22,80,443'
};


nmap.scan(opts, (err, report) => {
  if (err) throw err;

  fs.writeFileSync('report.json', JSON.stringify(report, null, 2));
});
