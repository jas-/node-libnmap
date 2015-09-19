/*!
 * node-libnmap
 * Copyright(c) 2013-2015 Jason Gerfen <jason.gerfen@gmail.com>
 * License: MIT
 */

var nmap = require('../')
  , opts = {
      json: false,
      range: ['scanme.nmap.org', '192.168.0.0/26']
    };

nmap.scan(opts, function(err, report) {
  if (err) throw new Error(err);

  for (var item in report) {
    console.log(report[item]);
  }
});