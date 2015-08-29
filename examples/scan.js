/*!
 * node-libnmap
 * Copyright(c) 2013-2015 Jason Gerfen <jason.gerfen@gmail.com>
 * License: MIT
 */

var nmap = require('../')
  , opts = {
      range: ['localhost', 'scanme.nmap.org'],
      ports: '21,22,80,443,2000-3000,8080,8443'
    };


nmap.scan(opts, function(err, report) {
  if (err) throw new Error(err);

  console.log(report);
});
