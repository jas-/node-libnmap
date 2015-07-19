# node-libnmap [![Build Status](https://travis-ci.org/jas-/node-libnmap.png?branch=master)](https://travis-ci.org/jas-/node-libnmap)

Access nmap using node.js

## install ##
To install `npm install node-libnmap`

## tests ##
To test `npm test`

## options ##
* `threshold` - Defaults to processor core * 2, use `0` to disable
* `nmap` - Path to nmap binary
* `range` - Subnet range(s)
* `ports` - Port range(s)
* `callback` - A user defined callback function to retrieve & parse report

## methods ##
* `init` - Returns version, license, help & nmap legal resources
* `discover` - Performs auto-discovery of online hosts
* `scan` - Performs scan given available range & optional port (not yet implemented)

## examples ##
Here are a few usage examples & their output

### default ###
```javascript
console.log(require('libnmap').nmap())
```

### output ###
```javascript
> require('./').nmap()
{ name: 'node-libnmap',
  version: 'v0.1.13',
  usage: 'https://github.com/jas-/node-libnmap',
  license: 'https://github.com/jas-/node-libnmap/blob/master/LICENSE',
  issues: 'https://github.com/jas-/node-libnmap/issues',
  nmap: { legal: 'http://nmap.org/book/man-legal.html' } }
```

### discover ###
The discover method is the quickest method but is limited to finding local
peers within the same CIDR per interface.

```javascript
require('libnmap').nmap('discover', function(err, report){
  if (err) throw err
  console.log(report)
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
A manually specified scan example using a single host (both IPv4 & IPv6 notation),
a CIDR range a host range as well as a port range specification.

```javascript
var opts = {
  range: ['10.0.2.128-255', '10.0.2.0/25', '192.168.0.0/17', '::ffff:192.168.2.15'],
	ports: '21,22,80,443,3306,60000-65535'
}
require('libnmap').nmap('scan', opts, function(err, report){
  if (err) throw err
  report.forEach(function(item){
    console.log(item[0])
  })
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
The discover method requires a node.js version > `v0.11` due to the
`os.networkInterfaces().netmask` property being used to traverse each
physical/virtual adapter and examing the address space for online hosts.

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

### ulimit ###
If you recieve the `spawn EAGAIN` or `spawn EMFILE` error(s) you have reached
the max number of `max user processes`. This error is generally thrown if your
attempting to scan a very large network block.

To alleviate this you may need to increase the max number of processes and/or
which can file handles can be done like so (though not recommended):

```sh
$ ulimit -u 65000
$ ulimit -n 65000
```

*Important* These limits are in place to help protect the operating system
against attacks such as a [fork bombing](http://en.wikipedia.org/wiki/Fork_bomb)
& [chroot jail breaking](http://www.bpfh.net/simes/computing/chroot-break.html).

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

### Nmap host discovery ###
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

### Nmap host `discover` method using node-libnmap ###
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

### Nmap full port scan ###
```sh
$ time nmap -T4 -oG - localhost 10.0.2.0/24 192.168.2.0/25
# Nmap 5.51 scan initiated Sun Jan 26 08:03:18 2014 as: nmap -T4 -oG - localhost 10.0.2.0/24 192.168.2.0/25
Host: 127.0.0.1 (localhost)     Status: Up
Host: 127.0.0.1 (localhost)     Ports: 22/open/tcp//ssh///      Ignored State: closed (999)
Host: 10.0.2.2 ()       Status: Up
Host: 10.0.2.2 ()       Ports: 513/open/tcp//login///, 514/open/tcp//shell///, 631/open/tcp//ipp///, 1192/filtered/tcp//caids-sensor///, 1524/filtered/tcp//ingreslock///, 1533/filtered/tcp//virtual-places///, 1862/filtered/tcp//mysql-cm-agent///, 1864/filtered/tcp//paradym-31///, 2179/filtered/tcp//vmrdp///, 2222/open/tcp//EtherNet|IP-1///, 2381/filtered/tcp//compaq-https///, 3000/open/tcp//ppp///, 3003/filtered/tcp//cgms///, 3369/filtered/tcp//satvid-datalnk///, 4343/open/tcp//unicall///, 5901/open/tcp//vnc-1///, 7019/filtered/tcp//unknown///, 8000/open/tcp//http-alt///, 8080/open/tcp//http-proxy///, 8300/filtered/tcp//tmi///, 9009/filtered/tcp//pichat///, 9594/filtered/tcp//msgsys///, 10009/filtered/tcp//swdtp-sv///, 16000/filtered/tcp//fmsas///       Ignored State: closed (976)
Host: 10.0.2.15 ()      Status: Up
Host: 10.0.2.15 ()      Ports: 22/open/tcp//ssh///      Ignored State: closed (999)
Host: 192.168.2.2 ()    Status: Up
Host: 192.168.2.2 ()    Ports: 513/open/tcp//login///, 514/open/tcp//shell///, 631/open/tcp//ipp///, 1174/filtered/tcp//fnet-remote-ui///, 2222/open/tcp//EtherNet|IP-1///, 3000/open/tcp//ppp///, 4343/open/tcp//unicall///, 5901/open/tcp//vnc-1///, 7402/filtered/tcp//rtps-dd-mt///, 8000/open/tcp//http-alt///, 8002/filtered/tcp//teradataordbms///, 8080/open/tcp//http-proxy///, 9100/filtered/tcp//jetdirect///, 9666/filtered/tcp//unknown///, 9968/filtered/tcp//unknown///, 11110/filtered/tcp//unknown///, 54045/filtered/tcp//unknown///       Ignored State: closed (983)
Host: 192.168.2.3 ()    Status: Up
Host: 192.168.2.3 ()    Ports: 80/open/tcp//http///, 513/open/tcp//login///, 514/open/tcp//shell///, 1051/filtered/tcp//optima-vnet///  Ignored State: closed (996)
Host: 192.168.2.15 ()   Status: Up
Host: 192.168.2.15 ()   Ports: 22/open/tcp//ssh///      Ignored State: closed (999)
# Nmap done at Sun Jan 26 08:06:52 2014 -- 385 IP addresses (6 hosts up) scanned in 214.20 seconds

real    3m34.218s
user    0m0.911s
sys     0m3.315s
```

### Nmap host `scan` method using node-libnmap ###
The test case used:
```javascript
var libnmap = require('node-libnmap')

var opts = {
  range: ['localhost', '10.0.2.0/24', '192.168.2.0/25']
}

libnmap.nmap('scan', opts, function(err, report){
  if (err) throw err
  report.forEach(function(item){
    console.log(item[0])
  })
})
```

The results
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
   [ { port: '255',
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
     { port: '1186',
       state: 'filtered',
       protocol: 'tcp',
       owner: '',
       service: 'mysql-cluster',
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
     { port: '9111',
       state: 'filtered',
       protocol: 'tcp',
       owner: '',
       service: 'DragonIDSConsole',
       rpc: '',
       version: '' },
     { port: '19801',
       state: 'filtered',
       protocol: 'tcp',
       owner: '',
       service: 'unknown',
       rpc: '',
       version: '' } ] }

real    2m32.158s
user    0m13.066s
sys     0m8.890s
```

### Class B network scans ###
To really test the performance of the module I did several scans of a class B
network containing a maximum host count of `32766`. Below are the times for
both scans.

```sh
$ time nmap -T4 -n -oG - 155.97.0.0/17

real    10m32.856s
user    0m11.709s
sys     0m33.364s
```

```sh
$ time node nmap-test.js

real    0m32.034s
user    1m3.209s
sys     0m33.950s
```

Mileage may vary

## contributing ##
I welcome contributions. Testing, patches, features etc. are appreciated. To
submit a pull request the following instructions will help.

### fork ###
First fork the project from [github.com](https://github.com/jas-/node-libnmap).

### branch ###
Any contributions you make should be made under a unique branch to avoid
conflicts. While creating your branch it is recommended you track changes with the latest production
branch like so: `git checkout -b my-new-feature -t origin/master`

### upstream changes ###
1. To ensure changes are as up to date as possible it is recommended to add an
upstream branch to rebase any upstream changes like so:
`git remote add upstream https://github.com/jas-/node-libnmap.git`

2. You will then need to `merge` it to track the `contribute` branch:
`git fetch upstream`

### pull request ###
Once you have modified your branch simply create a pull request that I can review and test prior to acceptance.
