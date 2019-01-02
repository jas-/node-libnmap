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
const ifaces = require('os').networkInterfaces();

describe('nmap', function () {
  context('discovery method', function () {

    this.timeout(timeout);

    it('validate report', function (done) {

      nmap.discover(function (err, report) {

        /* If 'subnet' doesn't exist in os.networkInterfaces() expect errors */
        for (let adapter in ifaces) {
          if (!ifaces[adapter][0].internal) {
            if (!ifaces[adapter][0].hasOwnProperty('subnet')) {
              try {
                done();
              }
              catch (error) {
                done(error);
              }
            }
            else {
              try {
                should.not.exist(err);
                should.exist(report);
              }
              catch (error) {
                done(error);
              }
            }
          }
        }
      });
    });
  });
});
