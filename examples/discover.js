/*!
 * libnmap
 * Copyright(c) 2013-2016 Jason Gerfen <jason.gerfen@gmail.com>
 * License: MIT
 */

var nmap = require('../');

nmap.discover(function(err, report) {
  if (err) throw new Error(err);

  for (var item in report) {
    console.log(JSON.stringify(report[item]));
  }
});