/*!
 * node-libnmap
 * Copyright(c) 2013-2015 Jason Gerfen <jason.gerfen@gmail.com>
 * License: MIT
 */

var nmap = require('../')
  , opts = {
      range: ['scanme.nmap.org'],
      //range: ['localhost', 'scanme.nmap.org', '10.0.2.0/16', '192.168.1.10-100'],
      ports: '21,22,80,443,2000-3000,8080,8443'
    };


nmap.scan(opts, function(err, report) {
  if (err) throw new Error(err);

  console.log(report);
});
