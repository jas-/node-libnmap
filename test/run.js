require('../').libnmap('discover', {
  callback: function(err, report){
    if (err) throw err
    console.log(report)
  }
})
