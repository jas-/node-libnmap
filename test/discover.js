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
  , ifaces = require('os').networkInterfaces();

describe('nmap', function() {
  describe('discovery method', function() {
    it('validate report', function(done) {
      nmap.discover(function(err, report) {
        for (var adapter in ifaces) {
          if (!ifaces[adapter][0].internal) {
            if (!ifaces[adapter][0].hasOwnProperty('subnet')) {
              should.exist(err);
              should.not.exist(report);
            } else {
              should.not.exist(err);
              should.exist(report);
            }
          }
        }
        done();
      });
    });
  });
});
