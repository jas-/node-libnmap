# libnmap [![npm](https://img.shields.io/npm/v/libnmap.svg)](https://npmjs.com/package/libnmap) [![Dependencies](https://img.shields.io/david/jas-/node-libnmap.svg)](https://david-dm.org/jas-/node-libnmap) ![Downloads](https://img.shields.io/npm/dm/libnmap.svg) [![Build Status](https://travis-ci.org/jas-/node-libnmap.png?branch=v0.2.33)](https://travis-ci.org/jas-/node-libnmap)

Access nmap using node.js

## install ##

To install `npm install libnmap`

## methods ##

* `scan`      Performs scan given available range & optional port
* `discover`  Retrieves list of online network neighbors

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

## example ##

A default usage example. For more advanced and possible options please
see [here](https://gist.github.com/jas-/eae6b0c6e82a4e072b97)

### scan ###

The example show shows the types of host ranges supported. In this example the
default IANA range of reserved ports is scanned per host in each range (1024).

```javascript
var nmap = require('libnmap')
  , opts = {
      range: [
        'scanme.nmap.org',
        '10.0.2.0/25',
        '192.168.10.80-120',
        'fe80::42:acff:fe11:fd4e/64'
      ]
    };

nmap.scan(opts, function(err, report) {
  if (err) throw new Error(err);

  for (var item in report) {
    console.log(JSON.stringify(report[item]));
  }
});
```

### discover ###

The discover method requires nodejs < `v0.11.2` and can be used to aquire
information about neighbors per network interface.

```javascript
var nmap = require('libnmap');

nmap.discover(function(err, report) {
  if (err) throw new Error(err);

  for (var item in report) {
    console.log(JSON.stringify(report[item]));
  }
});
```

### sample reports ###

To see some output examples please take a look at the [json (default) & xml reports](https://gist.github.com/jas-/23e2a32110562388bef5).

## contributing ##

Contributions are welcome & appreciated. Refer to the [contributing document](https://github.com/jas-/node-libnmap/blob/master/CONTRIBUTING.md)
to help facilitate pull requests.

## license ##

This software is licensed under the [MIT License](https://github.com/jas-/node-libnmap/blob/master/LICENSE).

Copyright Jason Gerfen, 2013-2016.
