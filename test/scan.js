var libnmap = require('../')

console.log('')
console.log('Testing single, CIDR & range notation scans')
console.log('')
libnmap.nmap('scan', {
  flags: '-T4 -oG -',
  range: ['10.0.2.0/24'],
  ports: '1-1024',
  callback: function(err, report){
    if (err) throw err

    console.log(report)
  }
})
