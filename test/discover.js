/*!
 * node-libnmap
 * Copyright(c) 2013-2015 Jason Gerfen <jason.gerfen@gmail.com>
 * License: MIT
 */

var nmap = require('../')
  , os = require('os')
  , timeout = 1024 * 1024
  , chai = require('chai')
  , should = chai.should()
  , expect = chai.expect;

describe('nmap', function() {
  describe('discovery method', function() {
    it('validate report', function(done) {
      nmap.discover(function(err, report) {
        if (!os.networkInterfaces().eth0[0].hasOwnProperty('subnet')) {
          should.exist(err);
          should.not.exist(report);
        } else {
          should.not.exist(err);
          should.exist(report);
        }
        done();
      });
    });
  });
});
