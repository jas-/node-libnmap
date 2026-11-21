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
