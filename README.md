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
* callback {Function} - A user defined function to retrieve report

## methods ##
* discover - Performs auto-discovery of online hosts
* scan - Performs scan given available range & optional port

## examples ##
Here are a few usage examples & their output (more will be added when complete)

### discover ###
```javascript
require('../').libnmap('discover', {
  callback: function(err, report){
    if (err) throw err
    console.log(report)
  }
})
```
