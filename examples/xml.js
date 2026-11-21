/*!
 * libnmap
 * Copyright(c) 2013 Jason Gerfen <jason.gerfen@gmail.com>
 * License: NPSL-0.95
 */

'use strict'

// With json: false the report is the nmap XML document as a string.

const nmap = require('../');
const opts = {
  json: false,
  range: ['scanme.nmap.org']
};


nmap.scan(opts, (err, report) => {
  if (err) throw err;

  console.log(report);
});
