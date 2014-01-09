# node-libnmap

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
* `discover` - Performs auto-discovery of online hosts
* `scan` - Performs scan given available range & optional port (not yet implemented)

## examples ##
Here are a few usage examples & their output (more will be added when complete)

### discover ###
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
```
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

Nmap host discovery using node-libnmap
```
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

And an example with multiple adapters on multiple 802.11q segments
```
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
       range: [Object] },
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
       range: [Object] },
    neighbors: [ '192.168.2.2', '192.168.2.3', '192.168.2.15' ] } ]

real    0m3.447s
user    0m0.493s
sys     0m0.796s
```

Mileage may vary
