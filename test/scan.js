var TIMEOUT = timeout = 1024 * 1024 * 2;

var chai = require('chai');
var should = chai.should();
var expect = chai.expect;

var mockery = require('mockery');
var ip = require('ip');

describe('nmap', function() {

  var childProcessMock = require('./cp-mocks.js').scan;

  mockery.enable({
    warnOnReplace: false,
    warnOnUnregistered: false,
    useCleanCache: true
  });

  mockery.registerMock('child_process', childProcessMock);

  var libnmap = require('../');

  describe('scan method', function() {
    it('valid reports', function(done) {
      this.timeout(TIMEOUT)

      var ipRange = ip.address().split('.').slice(0, 3).join('.') + '.0/25';

      var opts = {
        range: ['localhost', ipRange],
        ports: '1-1024'
      }

      libnmap.nmap('scan', opts, function(err, reports) {
        should.not.exist(err)

        reports.should.be.a('array')

        reports[0].$.scanner.should.equal('nmap');
        reports[0].host.should.be.a('array');
        expect(reports[0].host[0].hostnames.name).to.equal('mock.data');
        expect(reports[0].host[0].hostnames.type).to.equal('PTR');
        reports[0].host[0].ports[0].port.should.be.a('array');
        reports[0].host[0].ports[0].port[0].service.name.should.be.a('string');

        done()
      })
    })
  })

  after(function () {
    mockery.deregisterMock('child_process');
  });
})
