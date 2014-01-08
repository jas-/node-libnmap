# node-libnmap #
============

Access the nmap using node

## performance ##
A note on performance of nmap scans; the nmap tool already makes efforts to
utilize parallel processing when multiple processor cores are available.

Even with that in mind this library performs the following calculation prior
to running scans on an IP range. `ip-range / cpu`. It tries to split the
IP range into chunks then creates separate threads performing each scan
sequentially.

## options ##
* nmap {String} - Path to nmap binary
* scripts {String} - Path to nmap scripts folder
* flags {String} - Default scan flags
* range {String} - Subnet range(s)
* ports {String} - Port range(s)

## methods ##
* discover - Performs auto-discovery of online hosts
* scan - Performs scan given available range & optional port

## examples ##
Here are a few usage examples & their output (more will be added when complete)

### discover ###
```javascript
node> var report = require('./').libnmap('discover')
node> console.log(report)
{ interface: 'eth0',
  properties: 
   { address: '10.0.2.15',
     netmask: '255.255.255.0',
     family: 'IPv4',
     mac: '52:54:00:12:34:56',
     internal: false,
     cidr: '10.0.2.0/24',
     hosts: 256,
     range: { start: '10.0.2.1', end: '10.0.2.254' } },
  neighbors: ['10.0.2.2', '10.0.2.15', '10.0.2.25'] }
```
