var libnmap = require('../');

libnmap.nmap('discover', function(err, reports) {
  if (err) throw new Error(err);

  reports.forEach(function (report) {
    console.log('%s (%s)', report.properties.address, report.adapter);

    report.neighbors.forEach(function (neighbor) {
      console.log('---> %s', neighbor);
    });
  })
});