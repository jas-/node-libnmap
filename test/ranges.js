/*!
 * libnmap
 * Copyright(c) 2013-2017 Jason Gerfen <jason.gerfen@gmail.com>
 * License: MIT
 */

var nmap = require('../')
  , timeout = 1024 * 1024
  , chai = require('chai')
  , should = chai.should()
  , expect = chai.expect
  , start = 0
  , range = 32
  , ip = '192.168.0.0'
  , scanip = ''
  , opts = {
      range: [],
      ports: '80'
    };

describe('ranges', function() {

  context('CIDR', function() {
    
    while(start <= range) {
      scanip = ip + '/' + start;
      it(scanip, function(done) {

        opts.range = [ scanip ];
        this.timeout(timeout);

        nmap.scan(opts, function(err, report) {
          should.not.exist(err);

          report.should.be.a('object');
          done();
        });
      });
      start++;
    }
  });
});
