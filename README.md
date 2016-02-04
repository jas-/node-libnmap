# node-libnmap [![Build Status](https://travis-ci.org/jas-/node-libnmap.png?branch=v0.2.4)](https://travis-ci.org/jas-/node-libnmap)

Access nmap using node.js

## install ##
To install `npm install -g node-libnmap`

## methods ##
* `scan`      Performs scan given available range & optional port

## options ##
* `nmap`      {String}    Path to NMAP binary
* `verbose`   {Boolean}   Turn on verbosity during scan(s)
* `ports`     {String}    Range of ports to scan
* `range`     {Array}     An array of hostnames/ipv4/ipv6, CIDR or ranges
* `timeout`   {Number}    Number of minutes to wait for host/port response
* `blocksize` {Number}    Number of hosts per network scanning block
* `threshold` {Number}    Max number of  spawned process
* `flags`     {Array}     Array of flags for .spawn()
* `udp`       {Boolean}   UDP scan mode enabled
* `json`      {Boolean}   JSON object as output, false produces XML

## tests ##
To test `npm test`

## examples ##
Here are a few usage examples & their output

### scan ###
A manually specified scan example using a single host (both IPv4 & IPv6 notation),
a CIDR range a host range as well as a port range specification.

```javascript
var nmap = require('node-libnmap')
  , opts = {
      timeout: 100,
      range: ['scanme.nmap.org', '10.0.2.0/25', '192.168.10.80-120'],
      ports: '21,22,80,443'
    };

nmap.scan(opts, function(err, report) {
  if (err) throw new Error(err);

  for (var item in report) {
    console.log(JSON.stringify(report[item]));
  }
});
```
