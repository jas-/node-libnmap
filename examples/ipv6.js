/*!
 * libnmap
 * Copyright(c) 2013-2019 Jason Gerfen <jason.gerfen@gmail.com>
 * License: MIT
 */

'use strict'

const nmap = require('../');
const opts = {
  range: ['scanme.nmap.org', '2001:db8::/128']
};


nmap.scan(opts, function(err, report) {
  if (err) throw new Error(err);

  for (let item in report) {
    console.log(JSON.stringify(report[item], null, 2));
  }
});
