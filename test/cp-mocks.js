var fs = require('fs');

var FIXTURE_NMAPRUN_SCAN = fs.readFileSync(__dirname + '/fixtures/nmaprun-scan.xml');
var FIXTURE_NMAPRUN_DISCOVER = fs.readFileSync(__dirname + '/fixtures/namprun-discover.txt');

var exports = module.exports = {
  discover: {
    exec: function (cmd, callback) {
      if(callback) {
        callback(null, [FIXTURE_NMAPRUN_DISCOVER.toString('utf8')]);
      }
    }
  },
  scan: (function () {
    function on (listener, cb) {
      if(listener === 'data') {
        cb(FIXTURE_NMAPRUN_SCAN);
      }
      if(listener === 'end') {
        cb();
      }
    }

    return { exec: function (cmd) { return { stdout: { on: on } } } };
  }())
}