/*!
 * node-libnmap
 * Copyright(c) 2013-2015 Jason Gerfen <jason.gerfen@gmail.com>
 * License: MIT
 */

var nmap = require('../')
  , opts = {
      //range: ['scanme.nmap.org', 'localhost', '172.17.190.0/16'],
      range: ['scanme.nmap.org', 'localhost'],
      //range: ['localhost', 'scanme.nmap.org', '10.0.2.0/16', '192.168.1.10-100'],
      //ports: '21,22,80,443,2000-3000,8080,8443'
      ports: '22,80,443'
    };

function printer(obj) {
  if (/object|array/.test(obj)) {
    for (var key in obj) {
      console.log(key);
      if (/object|array/.test(obj[key])) {
        printer(obj[key]);
      } else {
        console.log('   '+obj[key]);
      }
    }
  }
}

nmap.scan(opts, function(err, report) {
  if (err) throw new Error(err);

  console.log(Object.keys(report).length);
  console.log(report['scanme.nmap.org']);
  console.log(report['localhost']);
});
