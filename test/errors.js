/*!
 * node-libnmap
 * Copyright(c) 2013-2015 Jason Gerfen <jason.gerfen@gmail.com>
 * License: MIT
 */

var nmap = require('../')
  , chai = require('chai')
  , should = chai.should()
  , expect = chai.expect
  , opts;


describe('nmap', function() {

  describe('error handling', function() {

    it('missing nmap binary', function(done) {
      opts = {
        nmap: 'ping-pong'
      };
      nmap.scan(opts, function(err, report) {
        should.exist(err);
        should.not.exist(report);
        done();
      });
    });

    it('invalid host range (host)', function(done) {
      opts = {
        range: ['10.0.5.256']
      };
      nmap.scan(opts, function(err, report) {
        should.exist(err);
        should.not.exist(report);
        done();
      });
    });

    it('invalid host range (range)', function(done) {
      opts = {
        range: ['10.0.2.5-256']
      };
      nmap.scan(opts, function(err, report) {
        should.exist(err);
        should.not.exist(report);
        done();
      });
    });

    it('invalid host range (CIDR)', function(done) {
      opts = {
        range: ['256.128.0/17']
      };
      nmap.scan(opts, function(err, report) {
        should.exist(err);
        should.not.exist(report);
        done();
      });
    });

    it('invalid port range', function(done) {
      opts = {
        ports: '1,5-40,1024,-90'
      };
      nmap.scan(opts, function(err, report) {
        should.exist(err);
        should.not.exist(report);
        done();
      });
    });

    it('invalid flag options', function(done) {
      opts = {
        flags: [
          '-sV', // Open port to determine service (i.e. FTP, SSH etc)
          '-O'
        ]
      };
      nmap.scan(opts, function(err, report) {
//        should.exist(err);
//        should.not.exist(report);
        done();
      });
    });
  });
});
