var libnmap = require('../')

console.log('Performing auto-discovery of nearby hosts')
console.log('')

libnmap.nmap('discover', {
  callback: function(err, report){
    if (err) throw err

    console.log(report)

    console.log('')
    console.log('Details of nearby hosts')
    console.log('')
    secondaryScan(report)
  }
})

function secondaryScan(report){
  report.forEach(function(details){

    libnmap.nmap('scan', {
      flags: '-T4 -A -oG -',
      range: details.neighbors,
      callback: function(err, report){
        if (err) throw err

        console.log(report)
      }
    })
  })
}

