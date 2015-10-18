# node-libnmap has been deprecated; please refer to new name @ [libnmap](https://www.npmjs.com/package/libnmap)

# node-libnmap [![Build Status](https://travis-ci.org/jas-/node-libnmap.png?branch=master)](https://travis-ci.org/jas-/node-libnmap)

Access nmap using node.js

## install ##

To install `npm install node-libnmap`

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
var nmap = require('node-libnmap')
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
var nmap = require('node-libnmap');

nmap.discover(opts, function(err, report) {
  if (err) throw new Error(err);

  for (var item in report) {
    console.log(JSON.stringify(report[item]));
  }
});
```

## license ##

This software is licensed under the MIT License.

Copyright Jason Gerfen, 2013-2015.

Permission is hereby granted, free of charge, to any person obtaining a
copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to permit
persons to whom the Software is furnished to do so, subject to the
following conditions:

The above copyright notice and this permission notice shall be included
in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
USE OR OTHER DEALINGS IN THE SOFTWARE.