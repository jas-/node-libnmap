/*!
 * libnmap
 * Copyright(c) 2013 Jason Gerfen <jason.gerfen@gmail.com>
 * License: NPSL-0.95
 */

'use strict'

// More nmap flags for a scan. A flag can include its value.

const nmap = require('../');
const opts = {
  flags: [
    '-sV', // Open port to determine service (i.e. FTP, SSH etc)
    '-O', // OS finger printing (requires elevated privileges)
    '-sC', // Enables the default nmap scripts against each host
    '--traceroute', // Turns on tracerouting (requires elevated privileges)
    '--script traceroute-geolocation' // Turns on GeoIP functionality per hops
  ],
  range: ['scanme.nmap.org']
};


nmap.scan(opts, function(err, report) {
  if (err) throw err;

  console.log(JSON.stringify(report, null, 2));
});
