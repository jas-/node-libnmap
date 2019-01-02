/*!
 * libnmap
 * Copyright(c) 2013-2019 Jason Gerfen <jason.gerfen@gmail.com>
 * License: MIT
 */

'use strict'

const nmap = require('../');
const opts = {
  // Use 4, 8, 16 or 32 for class A & B (default is 16)
  // The larger the scan range the smaller the blocksize
  // maximum is 128 which is adequate for class C networks.
  blocksize: 8,
  range: ['scanme.nmap.org', '192.168.0.0/17']
};


nmap.scan(opts, function(err, report) {
  if (err) throw new Error(err);

  for (let item in report) {
    console.log(JSON.stringify(report[item], null, 2));
  }
});