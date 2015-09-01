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
      this.timeout(timeout);

      nmap.discover(function(err, report) {
        should.not.exist(err);

        report.should.be.a('array');

        should.exist(report[0].adapter);

        report[0].properties.should.be.a('object');

        should.exist(report[0].properties);
        should.exist(report[0].properties.address);
        should.exist(report[0].properties.netmask);
        should.exist(report[0].properties.family);
        should.exist(report[0].properties.mac);
        should.exist(report[0].properties.internal);
        should.exist(report[0].properties.cidr);
        should.exist(report[0].properties.hosts);
        should.exist(report[0].properties.range);

        report[0].properties.range.should.be.a('object');

        should.exist(report[0].properties.range.start);
        should.exist(report[0].properties.range.end);

        report[0].neighbors.should.be.a('array');
      });
    });
  });
});
