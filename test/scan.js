/*!
 * libnmap
 * Copyright(c) 2013-2017 Jason Gerfen <jason.gerfen@gmail.com>
 * License: MIT
 */

var nmap = require('../')
  , timeout = 1024 * 1024
  , chai = require('chai')
  , should = chai.should()
  , expect = chai.expect
  , opts = {
      range: [
        '127.0.0.1',
        'scanme.nmap.org',
        '::1'
      ],
      ports: '22,135'
    };

describe('scan method', function() {

  context('reporting', function() {
    it('json', function(done) {
      this.timeout(timeout);

      nmap.scan(opts, function(err, report) {
        should.not.exist(err);

        report.should.be.a('object');
        done();
      });
    });

    it('xml', function(done) {
      this.timeout(timeout);
      opts.json = false;

      nmap.scan(opts, function(err, report) {
        should.not.exist(err);

        report.should.be.a('object');
        done();
      });
    });
  });
});
