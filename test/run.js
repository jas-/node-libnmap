require('../').libnmap('discover', {
  debug: true,
  callback: function(report){
    console.log(report)
  }
})
