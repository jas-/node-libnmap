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
