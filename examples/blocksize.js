/*!
 * node-libnmap
 * Copyright(c) 2013-2015 Jason Gerfen <jason.gerfen@gmail.com>
 * License: MIT
 */

var nmap = require('node-nmap')
  , opts = {
      blocksize: 32, // maximum is 128 which is adequate for class C networks. Use 16 or 32 for class A & B (default is 16)
      range: ['scanme.nmap.org', '192.168.0.0/17']
    };

nmap.scan(opts, function(err, report) {
  if (err) throw new Error(err);

  for (var item in report) {
    console.log(JSON.stringify(report[item]));
  }
});