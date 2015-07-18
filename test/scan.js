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
      ports: '21,22,80,443,2000-3000,8080,8443'
    };


describe('nmap', function() {

  describe('scan method', function() {
    it('valid report', function(done) {
      this.timeout(timeout);

      nmap.scan(opts, function(err, report) {
        should.not.exist(err);

        report.should.be.a('array');
        report[0].should.be.a('array');
        report[0][0].should.be.a('object');

        should.exist(report[0][0].ip);
        should.exist(report[0][0].ports);
      });
    });
  });
});
