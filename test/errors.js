/*!
 * node-libnmap
 * Copyright(c) 2013-2015 Jason Gerfen <jason.gerfen@gmail.com>
 * License: MIT
 */

var lib = require('../')
  , chai = require('chai')
  , should = chai.should()
  , expect = chai.expect
  , nmap = new lib()
  , opts;


describe('nmap', function() {

  describe('Error handling', function() {

    it('Missing nmap binary', function(done) {
      opts = {
        nmap: '/var/tmp/bin/nmap'
      };
      nmap.scan(opts, function(err, report) {
        should.exist(err);
        should.not.exist(report);
        done();
      });
    });

    it('Invalid host range (host)', function(done) {
      opts = {
        range: ['10.0.5.256']
      };
      nmap.scan(opts, function(err, report) {
        should.exist(err);
        should.not.exist(report);
        done();
      });
    });

    it('Invalid host range (range)', function(done) {
      opts = {
        range: ['10.0.2.5-256']
      };
      nmap.scan(opts, function(err, report) {
        should.exist(err);
        should.not.exist(report);
        done();
      });
    });

    it('Invalid host range (CIDR)', function(done) {
      opts = {
        range: ['256.128.0/17']
      };
      nmap.scan(opts, function(err, report) {
        should.exist(err);
        should.not.exist(report);
        done();
      });
    });

    it('Invalid port range', function(done) {
      opts = {
        ports: '1,5-40,1024,-90'
      };
      nmap.scan(opts, function(err, report) {
        should.exist(err);
        should.not.exist(report);
        done();
      });
    });
  });
});
