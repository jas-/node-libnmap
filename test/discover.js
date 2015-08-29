var TIMEOUT = 1024 * 1024;

var chai = require('chai');
var should = chai.should();
var expect = chai.expect;

var mockery = require('mockery');


describe('nmap', function() {

  var childProcessMock = require('./cp-mocks.js').discover;

  mockery.enable({
    warnOnReplace: false,
    warnOnUnregistered: false,
    useCleanCache: true
  });

  mockery.registerMock('child_process', childProcessMock);

  var libnmap = require('../');

  describe('discovery method', function() {
    it('validate report', function(done) {
      this.timeout(TIMEOUT)

      libnmap.nmap('discover', function(err, report){
        should.not.exist(err)

        report.should.be.a('array')

        should.exist(report[0].adapter)

        report[0].properties.should.be.a('object')

        should.exist(report[0].properties)
        should.exist(report[0].properties.address)
        should.exist(report[0].properties.netmask)
        should.exist(report[0].properties.family)
        should.exist(report[0].properties.mac)
        should.exist(report[0].properties.internal)
        should.exist(report[0].properties.cidr)
        should.exist(report[0].properties.hosts)
        should.exist(report[0].properties.range)

        report[0].properties.range.should.be.a('object')

        should.exist(report[0].properties.range.start)
        should.exist(report[0].properties.range.end)

        report[0].neighbors.should.be.a('array')

        done()
      })
    })
  })

  after(function () {
    mockery.deregisterMock('child_process');
  });
})

