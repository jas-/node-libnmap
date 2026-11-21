/*!
 * libnmap
 * Copyright(c) 2013 Jason Gerfen <jason.gerfen@gmail.com>
 * License: NPSL-0.95
 */

'use strict'

// Network test: scans scanme.nmap.org. Run it with: npm run test:network

const { describe, it } = require('node:test');
const assert = require('node:assert/strict');

const nmap = require('../');
const opts = {
  range: [
    '127.0.0.1',
    'scanme.nmap.org',
    '::1'
  ],
  ports: '22,135'
};


describe('scan method', () => {

  describe('reporting', () => {
    it('json', (t, done) => {
      nmap.scan(opts, (err, report) => {
        assert.ifError(err);
        assert.equal(typeof report, 'object');
        assert.equal(report.host.length, 3);
        done();
      });
    });

    it('xml', (t, done) => {
      nmap.scan(Object.assign({}, opts, { json: false }), (err, report) => {
        assert.ifError(err);
        assert.equal(typeof report, 'string');
        assert.match(report, /^<\?xml/);
        done();
      });
    });
  });
});
