/*!
 * libnmap
 * Copyright(c) 2013 Jason Gerfen <jason.gerfen@gmail.com>
 * License: NPSL-0.95
 */

'use strict'

// Scans the loopback address only. No packet leaves the machine, so this
// test is safe on a shared or hosted machine.

const net = require('node:net');
const { describe, it, before, after } = require('node:test');
const assert = require('node:assert/strict');

const nmap = require('../');
const xml = require('../lib/classes/xml.js');
const tools = require('../lib/classes/tools.js');

const flags = [
  '-n',             // No DNS requests
  '-Pn',            // No host discovery probes
  '--unprivileged'  // TCP connect scan only, no raw packets
];


/* Listen on a free port of the loopback address */
function listen(cb) {
  const server = net.createServer(socket => socket.destroy());

  server.listen(0, '127.0.0.1', () => cb(server, server.address().port));
}


describe('scan method (loopback only)', () => {
  let server, open, closed;

  before(() => new Promise(resolve => {
    listen((s, port) => {
      server = s;
      open = port;

      /* A port that was free a moment ago gives a closed port */
      listen((tmp, port) => {
        closed = port;
        tmp.close(resolve);
      });
    });
  }));

  after(() => new Promise(resolve => server.close(resolve)));

  it('finds an open and a closed port', (t, done) => {
    const opts = {
      range: ['127.0.0.1'],
      ports: `${open},${closed}`,
      flags
    };

    nmap.scan(opts, (err, report) => {
      assert.ifError(err);

      const states = {};
      report.host[0].ports[0].port.forEach(port => {
        states[port.item.portid] = port.state[0].item.state;
      });

      assert.equal(states[open], 'open');
      assert.equal(states[closed], 'closed');
      done();
    });
  });

  it('gives one report for a CIDR range', (t, done) => {
    const opts = {
      range: ['127.0.0.0/30'],
      ports: `${open}`,
      flags
    };

    nmap.scan(opts, (err, report) => {
      assert.ifError(err);
      assert.equal(report.item.scanner, 'nmap');
      assert.equal(report.runstats.length, 1);
      assert.equal(report.runstats[0].hosts[0].item.total, '4');
      done();
    });
  });

  it('merges the IPv4 and the IPv6 report', (t, done) => {
    const opts = {
      range: ['127.0.0.1', '::1'],
      ports: `${open}`,
      flags
    };

    nmap.scan(opts, (err, report) => {
      assert.ifError(err);

      const addresses = report.host.map(host => host.address[0].item.addr);

      assert.deepEqual(addresses, ['127.0.0.1', '::1']);
      assert.equal(report.runstats.length, 2);
      assert.equal(report.scaninfo.length, 2);
      assert.equal(report.verbose.length, 1);
      done();
    });
  });

  it('merges the IPv4 and the IPv6 XML report', (t, done) => {
    const opts = {
      range: ['127.0.0.1', '::1'],
      ports: `${open}`,
      json: false,
      flags
    };

    nmap.scan(opts, (err, report) => {
      assert.ifError(err);
      assert.equal(typeof report, 'string');

      // The merged document is valid XML with the hosts of the two runs
      const parsed = xml.parse(report).nmaprun;

      assert.equal(parsed.host.length, 2);
      assert.equal(parsed.runstats.length, 2);
      assert.equal(parsed.verbose.length, 1);
      done();
    });
  });

  it('gives an XML report', (t, done) => {
    const opts = {
      range: ['127.0.0.1'],
      ports: `${open}`,
      json: false,
      flags
    };

    nmap.scan(opts, (err, report) => {
      assert.ifError(err);
      assert.equal(typeof report, 'string');
      assert.match(report, /^<\?xml/);
      assert.match(report, /<\/nmaprun>\s*$/);
      done();
    });
  });

  it('gives an error for an nmap flag that does not exist', (t, done) => {
    const opts = {
      range: ['127.0.0.1'],
      ports: `${open}`,
      flags: ['--no-such-flag']
    };

    nmap.scan(opts, (err, report) => {
      assert.ok(err instanceof Error);
      assert.match(err.message, /no-such-flag/);
      done();
    });
  });

  it('gives an error when the nmap worker is stopped', (t, done) => {
    const args = flags.concat(['--scan-delay', '30s', '-oX', '-',
      `-p${open},${closed}`, '127.0.0.1']);

    const child = tools.scan(args, (err, report) => {
      assert.ok(err instanceof Error);
      assert.match(err.message, /stopped by signal SIGTERM/);
      assert.equal(report, undefined);
      done();
    });

    // Stop the worker while the scan waits between the two ports
    setTimeout(() => child.kill(), 1500);
  });

  it('includes OpenSSL and libssh2', (t, done) => {
    tools.scan(['--version'], (err, output) => {
      assert.ifError(err);
      assert.match(output, /Compiled with:.* openssl-.* nmap-libssh2-/);
      done();
    });
  });

  it('gives an error for an empty range', (t, done) => {
    nmap.scan({ range: [] }, (err, report) => {
      assert.ok(err instanceof Error);
      assert.match(err.message, /Range must be an array/);
      done();
    });
  });
});
