/*!
 * node-libnmap
 * Copyright(c) 2013-2015 Jason Gerfen <jason.gerfen@gmail.com>
 * License: MIT
 */

var nmap = require('node-nmap')
  , opts = {
      flags: [
        '-sX', // XMAS scan (requires root)
        '-sV', // Open port to determine service (i.e. FTP, SSH etc)
        '-sC', // Use any available pen-test scripts for open services found (requires root)
      ],
      range: ['scanme.nmap.org', '192.168.0.0/17']
    };

nmap.scan(opts, function(err, report) {
  if (err) throw new Error(err);

  for (var item in report) {
    console.log(JSON.stringify(report[item]));
  }
});