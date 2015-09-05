/*!
 * node-libnmap
 * Copyright(c) 2013-2015 Jason Gerfen <jason.gerfen@gmail.com>
 * License: MIT
 */

var nmap = require('../')
  , timeout = 1024 * 1024
  , chai = require('chai')
  , should = chai.should()
  , expect = chai.expect
  , opts = {
      range: ['localhost', 'scanme.nmap.org'],
      ports: '22,135'
    };


describe('nmap', function() {

  describe('scan method', function() {
    it('valid report', function(done) {
      this.timeout(timeout);

      nmap.scan(opts, function(err, report) {
console.log(err);
console.log(report);
        should.not.exist(err);

        report.should.be.a('object');
        done();
      });
    });
  });
});
