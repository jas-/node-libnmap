/*!
 * libnmap
 * Copyright(c) 2013-2019 Jason Gerfen <jason.gerfen@gmail.com>
 * License: MIT
 */

'use strict'

const nmap = require('../');
const opts = {
  flags: [
    '-sV', // Open port to determine service (i.e. FTP, SSH etc)
    '-O', // OS finger printing (requires elevated privileges)
    '-sC', // Enables the nmap scripts (all) against each host (requires elevated privileges)
    '--traceroute', // Turns on tracerouting
    '--script traceroute-geolocation' // Turns on GeoIP functionality per hops
  ],
  range: ['scanme.nmap.org', '172.17.0.0/24']
};


nmap.scan(opts, function(err, report) {
  if (err) throw err;

  for (let item in report) {
    console.log(JSON.stringify(report[item], null, 2));
  }
});