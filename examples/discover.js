/*!
 * libnmap
 * Copyright(c) 2013-2019 Jason Gerfen <jason.gerfen@gmail.com>
 * License: MIT
 */

'use strict'

const nmap = require('../');

nmap.discover({verbose: true}, function(err, report) {
  if (err) throw new Error(err);

  for (let item in report) {
    console.log(JSON.stringify(report[item], null, 2));
  }
});