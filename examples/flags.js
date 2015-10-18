/*!
 * node-libnmap
 * Copyright(c) 2013-2015 Jason Gerfen <jason.gerfen@gmail.com>
 * License: MIT
 */

var nmap = require('../')
  , opts = {
      flags: [
        '-sV', // Open port to determine service (i.e. FTP, SSH etc)
        //'-O'
      ],
      range: ['scanme.nmap.org', '192.168.0.0/26']
    };

nmap.scan(opts, function(err, report) {
  if (err) throw err;

  for (var item in report) {
    console.log(JSON.stringify(report[item]));
  }
});