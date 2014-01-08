require('../').libnmap('discover', {
  callback: function(err, report){
    console.log(err)
    console.log(report)
  }
})
