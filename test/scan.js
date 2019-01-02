/*!
 * libnmap
 * Copyright(c) 2013-2019 Jason Gerfen <jason.gerfen@gmail.com>
 * License: MIT
 */

'use strict'

const nmap = require('../');
const timeout = 1024 * 1024 * 3;
const chai = require('chai');
const should = chai.should();
const expect = chai.expect;
const opts = {
  range: [
    '127.0.0.1',
    'scanme.nmap.org',
    '::1'
  ],
  ports: '22,135'
};


describe('scan method', function () {

  context('reporting', function () {
    it('json', function (done) {
      this.timeout(timeout);

      nmap.scan(opts, function (err, report) {
        should.not.exist(err);

        report.should.be.a('object');
        done();
      });
    });

    it('xml', function (done) {
      this.timeout(timeout);
      opts.json = false;

      nmap.scan(opts, function (err, report) {
        should.not.exist(err);

        report.should.be.a('object');
        done();
      });
    });
  });
});
