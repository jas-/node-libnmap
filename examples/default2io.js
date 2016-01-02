/*!
 * libnmap
 * Copyright(c) 2013-2016 Jason Gerfen <jason.gerfen@gmail.com>
 * License: MIT
 */

var nmap = require('../')
  , fs = require('fs')
  , path = './scans/'
  , opts = {
      range: ['scanme.nmap.org', '172.17.190.0/26'],
      ports: '21,22,80,443'
    };

nmap.scan(opts, function(err, report) {
  if (err) throw new Error(err);

  for (var item in report) {
    for (var host in report[item].host) {

      var data = JSON.stringify(report[item].host[host])
        , filename = item;

      fs.writeFile(path+filename+'.json', data, function(error) {
        if (error) console.log(error);
        console.log('Wrote report for '+filename);
      });
    }
  }
});
