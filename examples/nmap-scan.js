var ip = require('ip');
var libnmap = require('../');

// 10.20.30.28 -> 10.20.30.0/25
var ipRange = [ip.address().split('.').slice(0, 3).join('.') + '.0/25'];

libnmap
  .nmap('scan', {
    range: ipRange,
    ports: '80,443'
  }, function(err, reports){
    if (err) throw new Error(err);

    reports.forEach(function (report) {
      report.host.forEach(function (host) {
        var ports = host.ports.map(function (port) { return port.$.portid });
        console.log('%s -> %s; ports: %s', host.address.addr, host.hostnames.name, ports.join(','));
      });
    });
  });