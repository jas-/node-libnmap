/*!
 * libnmap
 * Copyright(c) 2021 Evandro Brandão <evandroaribel@gmail.com>
 * License: MIT
 */

'use strict'

const nmap = require('../');
const opts = {
  range: ['scanme.nmap.org', '127.0.0.1'],
  noDefaults: true
};


nmap.scan(opts, function(err, report) {
  if (err) throw new Error(err);

  for (let item in report) {
    console.log(JSON.stringify(report[item], null, 2));
  }
});