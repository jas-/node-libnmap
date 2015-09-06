/*!
 * node-libnmap
 * Copyright(c) 2013-2015 Jason Gerfen <jason.gerfen@gmail.com>
 * License: MIT
 */

var nmap = require('../')
  , timeout = 1024 * 1024
  , chai = require('chai')
  , should = chai.should()
  , expect = chai.expect;

describe('nmap', function() {
  describe('discovery method', function() {
    it('validate report', function(done) {
      nmap.discover(function(err, report) {
        should.exist(err);

        should.not.exist(report);
        done();
      });
    });
  });
});
