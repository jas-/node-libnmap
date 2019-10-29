/*!
 * libnmap
 * Copyright(c) 2013-2019 Jason Gerfen <jason.gerfen@gmail.com>
 * License: MIT
 */

'use strict'

const nmap = require('../');
const fs = require('fs');
const path = './scans/';
const opts = {
  range: ['scanme.nmap.org', '172.17.190.0/26'],
  ports: '21,22,80,443'
};


nmap.scan(opts, function(err, report) {
  if (err) throw new Error(err);

  for (let item in report) {
    let data = JSON.stringify(report[item], null, 2),
        filename = item.replace(' ', '-');

    fs.writeFile(path+filename+'.json', data, function(error) {
      if (error) return console.log(error);

      console.log('Wrote report for '+filename);
    });
  }
});
