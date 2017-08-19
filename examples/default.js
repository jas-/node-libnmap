/*!
 * libnmap
 * Copyright(c) 2013-2017 Jason Gerfen <jason.gerfen@gmail.com>
 * License: MIT
 */

var nmap = require('../')
  , opts = {
      verbose: true,
      range: ['scanme.nmap.org', '172.17.0.0/9']
    };

nmap.scan(opts, function(err, report) {
  if (err) throw new Error(err);

  for (var item in report) {
    console.log(JSON.stringify(report[item]));
  }
});

