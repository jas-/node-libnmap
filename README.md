# libnmap

API to access nmap from node.js. The install compiles [nmap](https://github.com/nmap/nmap)
as a node.js module, so an installed `nmap` binary is not necessary.

[![npm](https://img.shields.io/npm/v/libnmap.svg)](https://npmjs.com/package/libnmap) [![CI](https://github.com/jas-/node-libnmap/actions/workflows/ci.yml/badge.svg)](https://github.com/jas-/node-libnmap/actions/workflows/ci.yml) ![Downloads](https://img.shields.io/npm/dm/libnmap.svg) [![Known Vulnerabilities](https://snyk.io/test/github/jas-/node-libnmap/badge.svg?targetFile=package.json)](https://snyk.io/test/github/jas-/node-libnmap?targetFile=package.json)

## install ##

To install `npm install libnmap`

The install gets the nmap and OpenSSL sources and compiles them. This occurs one
time and can take some minutes. It needs Linux or macOS, node.js 18 or later,
`make`, a C/C++ compiler, `perl` and `python3`.

## methods ##

* `scan`      Scans the ports of each host in the range
* `discover`  Finds the neighbors on the IPv4 network of each network interface

## options ##

* `range`     {Array}     Hostnames, IPv4/IPv6 addresses, CIDR or address ranges
* `ports`     {String}    Ports to scan (default `1-1024`)
* `timeout`   {Number}    Number of seconds to wait for each host (default `120`)
* `flags`     {Array}     More nmap flags (default `-T4`)
* `udp`       {Boolean}   Scan UDP ports (requires root)
* `json`      {Boolean}   JSON object as output (default), false produces XML

## examples ##

More examples are in the `examples/` folder.

### scan ###

```javascript
const nmap = require('libnmap');
const opts = {
  range: [
    'scanme.nmap.org',
    '10.0.2.0/25',
    '192.168.10.80-120',
    'fe80::42:acff:fe11:fd4e/64'
  ],
  ports: '22,80,443'
};

nmap.scan(opts, function(err, report) {
  if (err) throw err;

  console.log(JSON.stringify(report, null, 2));
});
```

### discover ###

```javascript
const nmap = require('libnmap');

nmap.discover(function(err, report) {
  if (err) throw err;

  console.log(JSON.stringify(report, null, 2));
});
```

## tests ##

To test `npm test`

## license ##

This software is licensed under the [Nmap Public Source License](https://nmap.org/npsl/), the same license as nmap. See [LICENSE](https://github.com/jas-/node-libnmap/blob/master/LICENSE).

Copyright Jason Gerfen, 2013.
