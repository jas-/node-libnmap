# node-libnmap [![Build Status](https://travis-ci.org/jas-/node-libnmap.png?branch=master)](https://travis-ci.org/jas-/node-libnmap)

Access nmap using node.js

## install ##
To install `npm install node-libnmap`

## options ##
* `nmap` {String} - Path to nmap binary
* `scripts` {String} - Path to nmap scripts folder
* `flags` {String} - Default scan flags
* `range` {String} - Subnet range(s)
* `ports` {String} - Port range(s)
* `callback` {Function} - A user defined function to retrieve report

## methods ##
* `init` - Returns version, license, help & nmap legal resources
* `discover` - Performs auto-discovery of online hosts
* `scan` - Performs scan given available range & optional port (not yet implemented)

## examples ##
Here are a few usage examples & their output (more will be added when complete)

### default ###
```javascript
console.log(require('libnmap').nmap())
```

### output ###
```javascript
> require('./').nmap()
{ name: 'node-libnmap',
  version: 'v0.0.9',
  usage: 'https://github.com/jas-/node-libnmap',
  license: 'https://github.com/jas-/node-libnmap/blob/master/LICENSE',
  issues: 'https://github.com/jas-/node-libnmap/issues',
  nmap: { legal: 'http://nmap.org/book/man-legal.html' } }
```

### discover ###
The discover method is the quickest method but is limited to finding local
peers within the same CIDR per interface.

```javascript
require('libnmap').nmap('discover', {
  callback: function(err, report){
    if (err) throw err
    console.log(report)
  }
})
```

### output ###
```javascript
{ adapter: 'eth0',
  properties: 
   { address: '10.0.2.15',
     netmask: '255.255.255.0',
     family: 'IPv4',
     mac: '52:54:00:12:34:56',
     internal: false,
     cidr: '10.0.2.0/24',
     hosts: 256,
     range: { start: '10.0.2.1', end: '10.0.2.254' } },
  neighbors: [ '10.0.2.2', '10.0.2.3', '10.0.2.15' ] }
```

### scan ###
A manually specified scan example using a single host, a CIDR range a host
range as well as a port range specification.

```javascript
require('libnmap').nmap('scan', {
  flags: '-T4 -oG -',
  range: ['localhost', '10.0.2.0/24', '192.168.2.0/25'],
  callback: function(err, report){
    if (err) throw err
    report.forEach(function(item){
      console.log(item[0])
    })
  }
})

```

### output ###

```javascript
{ ip: '127.0.0.1',
  hostname: 'localhost',
  ports: 
   [ { port: '22',
       state: 'open',
       protocol: 'tcp',
       owner: '',
       service: 'ssh',
       rpc: '',
       version: '' } ] }
{ ip: '10.0.2.15',
  ports: 
   [ { port: '22',
       state: 'open',
       protocol: 'tcp',
       owner: '',
       service: 'ssh',
       rpc: '',
       version: '' } ] }
{ ip: '192.168.2.15',
  ports: 
   [ { port: '22',
       state: 'open',
       protocol: 'tcp',
       owner: '',
       service: 'ssh',
       rpc: '',
       version: '' } ] }
{ ip: '192.168.2.2',
  ports: 
   [ { port: '513',
       state: 'open',
       protocol: 'tcp',
       owner: '',
       service: 'login',
       rpc: '',
       version: '' },
     { port: '514',
       state: 'open',
       protocol: 'tcp',
       owner: '',
       service: 'shell',
       rpc: '',
       version: '' },
     { port: '631',
       state: 'open',
       protocol: 'tcp',
       owner: '',
       service: 'ipp',
       rpc: '',
       version: '' },
     { port: '888',
       state: 'filtered',
       protocol: 'tcp',
       owner: '',
       service: 'accessbuilder',
       rpc: '',
       version: '' },
     { port: '2222',
       state: 'open',
       protocol: 'tcp',
       owner: '',
       service: 'EtherNet|IP-1',
       rpc: '',
       version: '' },
     { port: '3000',
       state: 'open',
       protocol: 'tcp',
       owner: '',
       service: 'ppp',
       rpc: '',
       version: '' },
     { port: '4343',
       state: 'open',
       protocol: 'tcp',
       owner: '',
       service: 'unicall',
       rpc: '',
       version: '' },
     { port: '4899',
       state: 'filtered',
       protocol: 'tcp',
       owner: '',
       service: 'radmin',
       rpc: '',
       version: '' },
     { port: '5901',
       state: 'open',
       protocol: 'tcp',
       owner: '',
       service: 'vnc-1',
       rpc: '',
       version: '' },
     { port: '8000',
       state: 'open',
       protocol: 'tcp',
       owner: '',
       service: 'http-alt',
       rpc: '',
       version: '' },
     { port: '8080',
       state: 'open',
       protocol: 'tcp',
       owner: '',
       service: 'http-proxy',
       rpc: '',
       version: '' },
     { port: '9593',
       state: 'filtered',
       protocol: 'tcp',
       owner: '',
       service: 'cba8',
       rpc: '',
       version: '' },
     { port: '10009',
       state: 'filtered',
       protocol: 'tcp',
       owner: '',
       service: 'swdtp-sv',
       rpc: '',
       version: '' },
     { port: '32781',
       state: 'filtered',
       protocol: 'tcp',
       owner: '',
       service: 'unknown',
       rpc: '',
       version: '' } ] }
{ ip: '192.168.2.3',
  ports: 
   [ { port: '80',
       state: 'open',
       protocol: 'tcp',
       owner: '',
       service: 'http',
       rpc: '',
       version: '' },
     { port: '513',
       state: 'open',
       protocol: 'tcp',
       owner: '',
       service: 'login',
       rpc: '',
       version: '' },
     { port: '514',
       state: 'open',
       protocol: 'tcp',
       owner: '',
       service: 'shell',
       rpc: '',
       version: '' },
     { port: '700',
       state: 'filtered',
       protocol: 'tcp',
       owner: '',
       service: 'epp',
       rpc: '',
       version: '' },
     { port: '1081',
       state: 'filtered',
       protocol: 'tcp',
       owner: '',
       service: 'pvuniwien',
       rpc: '',
       version: '' },
     { port: '1187',
       state: 'filtered',
       protocol: 'tcp',
       owner: '',
       service: 'alias',
       rpc: '',
       version: '' },
     { port: '1533',
       state: 'filtered',
       protocol: 'tcp',
       owner: '',
       service: 'virtual-places',
       rpc: '',
       version: '' },
     { port: '1900',
       state: 'filtered',
       protocol: 'tcp',
       owner: '',
       service: 'upnp',
       rpc: '',
       version: '' },
     { port: '1972',
       state: 'filtered',
       protocol: 'tcp',
       owner: '',
       service: 'intersys-cache',
       rpc: '',
       version: '' },
     { port: '3006',
       state: 'filtered',
       protocol: 'tcp',
       owner: '',
       service: 'deslogind',
       rpc: '',
       version: '' },
     { port: '3809',
       state: 'filtered',
       protocol: 'tcp',
       owner: '',
       service: 'apocd',
       rpc: '',
       version: '' },
     { port: '3814',
       state: 'filtered',
       protocol: 'tcp',
       owner: '',
       service: 'neto-dcs',
       rpc: '',
       version: '' },
     { port: '5214',
       state: 'filtered',
       protocol: 'tcp',
       owner: '',
       service: 'unknown',
       rpc: '',
       version: '' },
     { port: '7025',
       state: 'filtered',
       protocol: 'tcp',
       owner: '',
       service: 'vmsvc-2',
       rpc: '',
       version: '' },
     { port: '9999',
       state: 'filtered',
       protocol: 'tcp',
       owner: '',
       service: 'abyss',
       rpc: '',
       version: '' },
     { port: '18101',
       state: 'filtered',
       protocol: 'tcp',
       owner: '',
       service: 'unknown',
       rpc: '',
       version: '' } ] }
{ ip: '10.0.2.2',
  ports: 
   [ { port: '109',
       state: 'filtered',
       protocol: 'tcp',
       owner: '',
       service: 'pop2',
       rpc: '',
       version: '' },
     { port: '254',
       state: 'filtered',
       protocol: 'tcp',
       owner: '',
       service: 'unknown',
       rpc: '',
       version: '' },
     { port: '513',
       state: 'open',
       protocol: 'tcp',
       owner: '',
       service: 'login',
       rpc: '',
       version: '' },
     { port: '514',
       state: 'open',
       protocol: 'tcp',
       owner: '',
       service: 'shell',
       rpc: '',
       version: '' },
     { port: '631',
       state: 'open',
       protocol: 'tcp',
       owner: '',
       service: 'ipp',
       rpc: '',
       version: '' },
     { port: '700',
       state: 'filtered',
       protocol: 'tcp',
       owner: '',
       service: 'epp',
       rpc: '',
       version: '' },
     { port: '1071',
       state: 'filtered',
       protocol: 'tcp',
       owner: '',
       service: 'bsquare-voip',
       rpc: '',
       version: '' },
     { port: '2222',
       state: 'open',
       protocol: 'tcp',
       owner: '',
       service: 'EtherNet|IP-1',
       rpc: '',
       version: '' },
     { port: '3000',
       state: 'open',
       protocol: 'tcp',
       owner: '',
       service: 'ppp',
       rpc: '',
       version: '' },
     { port: '4343',
       state: 'open',
       protocol: 'tcp',
       owner: '',
       service: 'unicall',
       rpc: '',
       version: '' },
     { port: '5901',
       state: 'open',
       protocol: 'tcp',
       owner: '',
       service: 'vnc-1',
       rpc: '',
       version: '' },
     { port: '6002',
       state: 'filtered',
       protocol: 'tcp',
       owner: '',
       service: 'X11:2',
       rpc: '',
       version: '' },
     { port: '6059',
       state: 'filtered',
       protocol: 'tcp',
       owner: '',
       service: 'X11:59',
       rpc: '',
       version: '' },
     { port: '8000',
       state: 'open',
       protocol: 'tcp',
       owner: '',
       service: 'http-alt',
       rpc: '',
       version: '' },
     { port: '8080',
       state: 'open',
       protocol: 'tcp',
       owner: '',
       service: 'http-proxy',
       rpc: '',
       version: '' },
     { port: '62078',
       state: 'filtered',
       protocol: 'tcp',
       owner: '',
       service: 'iphone-sync',
       rpc: '',
       version: '' } ] }
{ ip: '10.0.2.3',
  ports: 
   [ { port: '80',
       state: 'open',
       protocol: 'tcp',
       owner: '',
       service: 'http',
       rpc: '',
       version: '' },
     { port: '513',
       state: 'open',
       protocol: 'tcp',
       owner: '',
       service: 'login',
       rpc: '',
       version: '' },
     { port: '514',
       state: 'open',
       protocol: 'tcp',
       owner: '',
       service: 'shell',
       rpc: '',
       version: '' },
     { port: '5952',
       state: 'filtered',
       protocol: 'tcp',
       owner: '',
       service: 'unknown',
       rpc: '',
       version: '' } ] }
```

## error handling ##
The following errors are thrown when invalid configuration options are passed
to the module and/or when the necessary node.js version is below version v0.11.*

### method ###
If you attempt to specify an unkown or unimplemented method, the following error
is thrown. Allowed methods are `scan` & `discover`.

```javascript
Method "[missing method]" does not exist, please see node-libnmap API
```

### version requirement ###
If your node.js installation is below version v0.11 the following error is
thrown

```javascript
Requires node.js v0.11.* and above
```

### nmap binary ###
If your system does not have the nmap binary installed the following error is
thrown

```javascript
nmap binary not found, install nmap
```

### scanning ranges ###
When specifying an invalid range to the `scan` method the following error is
thrown. Valid range types are a single hostname/ipv4 (ipv6 is not yet
implemented), a CIDR range notation or a range.

```javascript
Range must be an array of host(s), examples: ['192.168.2.10', '10.0.2.0/24', '10.0.10.5-20']
```

### port range ###
A range of ports may also be specified with the `scan` method, for an invalid
port specification the following error is thrown.

```javascript
Port(s) must match one of the following examples: 512 (single) | 0-65535 (range) | 22-25,80,443,3306 (multiple)
```

## performance ##
A note on performance of nmap scans; the nmap tool already makes efforts to
utilize parallel processing when multiple processor cores are available.

Even with that in mind this library performs the following calculation prior
to running scans on an IP range. `ip-range / cpu`. It tries to split the
IP range into chunks then creates separate threads performing each scan
sequentially.

For example instead of executing nmap like this `nmap -sn -oG - 10.0.2.0/24`
it instead breaks the subnet range into chunks based on the amount of cpu
cores like this (i.e. 8 cores, where each command is run in its own thread)

```
nmap -sn -oG - 10.0.2.1-31
nmap -sn -oG - 10.0.2.33-63
nmap -sn -oG - 10.0.2.65-95
nmap -sn -oG - 10.0.2.97-127
nmap -sn -oG - 10.0.2.129-159
nmap -sn -oG - 10.0.2.161-191
nmap -sn -oG - 10.0.2.193-223
nmap -sn -oG - 10.0.2.225-255
```

The technical details of [Fyodor's](http://insecure.org/fyodor/) optimizations
can be found @ [insecure.org](http://nmap.org/book/man-performance.html).

## benchmarks ##
The results here are all coming from a virtual environment with limited system
resources but should give an overall picture of performance of the scans. My VM
environment is using 8 cores with 4 threads per core given a total returned from
`require('os').cpus.length` = 32.

Nmap host discovery
```sh
$ time nmap -sn -oG - 10.0.2.0/24
# Nmap 5.51 scan initiated Wed Jan  8 18:54:07 2014 as: nmap -sn -oG - 10.0.2.0/24
Host: 10.0.2.2 ()       Status: Up
Host: 10.0.2.3 ()       Status: Up
Host: 10.0.2.15 ()      Status: Up
# Nmap done at Wed Jan  8 18:54:26 2014 -- 256 IP addresses (3 hosts up) scanned in 19.33 seconds

real    0m19.339s
user    0m0.052s
sys     0m0.080s
```

Nmap host `discover` method using node-libnmap
```javascript
$ time node test/run.js 
{ adapter: 'eth0',
  properties: 
   { address: '10.0.2.15',
     netmask: '255.255.255.0',
     family: 'IPv4',
     mac: '52:54:00:12:34:56',
     internal: false,
     cidr: '10.0.2.0/24',
     hosts: 256,
     range: { start: '10.0.2.1', end: '10.0.2.254' } },
  neighbors: [ '10.0.2.2', '10.0.2.3', '10.0.2.15' ] }

real    0m3.323s
user    0m0.326s
sys     0m0.412s
```

And an example with multiple adapters on multiple 802.11Q segments
```javascript
$ time node test/run.js 
[ { adapter: 'eth0',
    properties: 
     { address: '10.0.2.15',
       netmask: '255.255.255.0',
       family: 'IPv4',
       mac: '52:54:00:12:34:56',
       internal: false,
       cidr: '10.0.2.0/24',
       hosts: 256,
       range: {start: '10.0.2.0', end: '10.0.2.255'} },
    neighbors: [ '10.0.2.2', '10.0.2.3', '10.0.2.15' ] },
  { adapter: 'eth1',
    properties: 
     { address: '192.168.2.15',
       netmask: '255.255.255.128',
       family: 'IPv4',
       mac: '52:54:00:12:34:57',
       internal: false,
       cidr: '192.168.2.0/25',
       hosts: 128,
       range: {start: '192.168.2.1', end: '192.168.2.128'} },
    neighbors: [ '192.168.2.2', '192.168.2.3', '192.168.2.15' ] } ]

real    0m3.447s
user    0m0.493s
sys     0m0.796s
```

Mileage may vary

## contributing ##
I welcome contributions. Testing, patches, features etc. are appreciated. To
submit a pull request the following instructions will help.

### fork ###
First fork the project from [github.com](https://github.com/jas-/node-libnmap).

### upstream ###
1. To ensure changes are as up to date as possible it is recommended to add an
upstream branch to rebase any upstream changes like so:
`git remote add upstream https://github.com/jas-/node-libnmap.git`

2. You will then need to `merge` it to track the `contribute` branch:
`git fetch upstream`

### changes ###
Any contributions you make should be made under a unique branch to avoid
conflicts. While creating your branch it is recommended you track changes to the
`contribute` branch like so: `git checkout -b my-new-feature -t origin/contribute`
