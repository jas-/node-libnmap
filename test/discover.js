/*!
 * libnmap
 * Copyright(c) 2013 Jason Gerfen <jason.gerfen@gmail.com>
 * License: NPSL-0.95
 */

'use strict'

// Network test: scans the IPv4 network of every interface of this machine.
// Run it with: npm run test:network

const { describe, it } = require('node:test');
const assert = require('node:assert/strict');

const nmap = require('../');
<<<<<<< HEAD

const chai = require('chai');
const ifaces = require('os').networkInterfaces();

const should = chai.should();

const timeout = 1024 * 1024 * 3;

describe('nmap', function () {
  context('discovery method', function () {
=======

>>>>>>> 24d4bf4 (v0.5.0: 20261121: Moved project to a dynamic compilation of the nmap tool)

describe('nmap', () => {
  describe('discovery method', () => {

    it('validate report', (t, done) => {
      nmap.discover((err, report) => {
        assert.ifError(err);
        assert.equal(typeof report, 'object');
        done();
      });
    });
  });
});
