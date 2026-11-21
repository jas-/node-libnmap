/*!
 * libnmap
 * Copyright(c) 2013 Jason Gerfen <jason.gerfen@gmail.com>
 * License: NPSL-0.95
 */

'use strict'

// Tests of the internal functions. These tests do no scan.

const { describe, it } = require('node:test');
const assert = require('node:assert/strict');

const xml = require('../lib/classes/xml.js');
const tools = require('../lib/classes/tools.js');
const network = require('../lib/classes/networking.js');
const reporting = require('../lib/classes/reporting.js');


describe('xml parser', () => {

  it('puts attributes in item and child elements in arrays', () => {
    const report = xml.parse(
      '<?xml version="1.0"?>\n<!DOCTYPE nmaprun>\n<!-- comment -->\n' +
      '<nmaprun scanner="nmap">\n<host><address addr="127.0.0.1"/>' +
      '<address addr="::1"/>\n<hostnames>\n</hostnames></host>\n</nmaprun>\n');

    assert.deepEqual(report, {
      nmaprun: {
        item: { scanner: 'nmap' },
        host: [{
          address: [
            { item: { addr: '127.0.0.1' } },
            { item: { addr: '::1' } }
          ],
          hostnames: ['\n']
        }]
      }
    });
  });

  it('decodes entities and keeps text', () => {
    const report = xml.parse(
      '<r a="1 &gt; 0 &#x41;&#66;&amp;"><e/><t>a &lt;b&gt;</t>' +
      '<m k="v">text</m><c><![CDATA[<raw&>]]></c></r>');

    assert.deepEqual(report, {
      r: {
        item: { a: '1 > 0 AB&' },
        e: [''],
        t: ['a <b>'],
        m: [{ item: { k: 'v' }, _: 'text' }],
        c: ['<raw&>']
      }
    });
  });

  it('throws on a report that is not complete', () => {
    assert.throws(() => xml.parse('<nmaprun><host>'), /not complete/);
  });
});


describe('network ranges', () => {

  it('divides the hosts by address family', () => {
    const hosts = network.families(
      ['10.0.0.0/30', 'scanme.nmap.org', '::1', '10.0.0.5-9', 'fe80::1/64']);

    assert.deepEqual(hosts, {
      ipv4: ['10.0.0.0/30', 'scanme.nmap.org', '10.0.0.5-9'],
      ipv6: ['::1', 'fe80::1/64']
    });
  });
});


describe('report names', () => {
  it('keeps the object prototype when a name is __proto__', () => {
    const doc = xml.parse('<r><__proto__ x="1"/><a __proto__="y" b="2"/></r>');

    assert.equal(Object.getPrototypeOf(doc.r), Object.prototype);
    assert.equal(Object.getPrototypeOf(doc.r.a[0].item), Object.prototype);
    assert.equal(doc.r.a[0].item.b, '2');
    assert.equal({}.x, undefined);
  });

  it('does not decode a reference to a surrogate', () => {
    const doc = xml.parse('<r a="&#xD800; &#xDFFF; &#x1F600; &#x110000;"/>');

    assert.equal(doc.r.item.a, '&#xD800; &#xDFFF; \u{1F600} &#x110000;');
    assert.ok(doc.r.item.a.isWellFormed === undefined ||
      doc.r.item.a.isWellFormed());
  });
});


describe('reports', () => {
  const one = '<?xml version="1.0"?>\n<nmaprun scanner="nmap" args="a">\n' +
    '<verbose level="0"/>\n<host><address addr="10.0.0.1"/></host>\n' +
    '<runstats><hosts up="1"/></runstats>\n</nmaprun>\n';
  const two = '<?xml version="1.0"?>\n<nmaprun scanner="nmap" args="b">\n' +
    '<verbose level="0"/>\n<host><address addr="::1"/></host>\n' +
    '<runstats><hosts up="1"/></runstats>\n</nmaprun>\n';

  it('gives the report of one run with no change', (t, done) => {
    reporting.reports({ json: false }, [one], (err, report) => {
      assert.ifError(err);
      assert.equal(report, one);
      done();
    });
  });

  it('adds the elements of the second run to the first report', (t, done) => {
    reporting.reports({ json: true }, [one, two], (err, report) => {
      assert.ifError(err);
      assert.equal(report.item.args, 'a');
      assert.deepEqual(report.host.map(host => host.address[0].item.addr),
        ['10.0.0.1', '::1']);
      assert.equal(report.runstats.length, 2);
      assert.equal(report.verbose.length, 1);

      // The XML report has the same content as the JSON report
      reporting.reports({ json: false }, [one, two], (err, merged) => {
        assert.ifError(err);
        assert.deepEqual(xml.parse(merged).nmaprun, report);
        done();
      });
    });
  });
});


describe('tools', () => {

  it('merges options and adds array values', () => {
    const defaults = { ports: '1-1024', flags: ['-T4'], range: [] };
    const opts = tools.merge(defaults, { ports: '22', flags: ['-n'] });

    assert.deepEqual(opts, { ports: '22', flags: ['-T4', '-n'], range: [] });
    assert.deepEqual(defaults.flags, ['-T4']);
  });

  it('builds the nmap arguments for each address family', (t, done) => {
    const defaults = { ports: '1-1024', flags: ['-T4'], range: [], timeout: 120 };
    const opts = {
      range: ['10.0.0.0/24', 'scanme.nmap.org', '::1'],
      ports: '22,80',
      udp: true,
      flags: ['--max-retries 3', '--script', '(default or vuln) and safe']
    };

    tools.init(defaults, opts, (err, result) => {
      assert.ifError(err);
      assert.deepEqual(result.scans, [
        ['-sU', '--host-timeout=120s', '-T4', '--max-retries', '3', '--script',
          '(default or vuln) and safe', '-oX', '-', '-p22,80', '--',
          '10.0.0.0/24', 'scanme.nmap.org'],
        ['-sU', '--host-timeout=120s', '-T4', '--max-retries', '3', '--script',
          '(default or vuln) and safe', '-oX', '-', '-6', '-p22,80', '--', '::1']
      ]);
      done();
    });
  });

  it('gives an error for a host that is not valid', (t, done) => {
    tools.init({ flags: [], range: [] }, { range: ['10.0.0.1', '!'] }, err => {
      assert.match(err, /did not pass validation/);
      done();
    });
  });

  it('gives an error for a host that is an nmap option', () => {
    const hosts = ['-oN/tmp/x', '--datadir=/tmp/x/10.0.0.0/24',
      '-iL /etc/passwd 10.0.0.0/24', '::1 --script x', 'fe80::1%eth0 -oN x'];

    hosts.forEach(host => {
      tools.init({ flags: [], range: [] }, { range: [host] }, err => {
        assert.match(err, /did not pass validation/);
      });
    });
  });

  it('gives an error for a flag with a NUL character', () => {
    tools.init({ flags: [], range: [] },
      { range: ['10.0.0.1'], flags: ['-T4\0--script=x'] },
      err => assert.match(err, /Flags must be/));
  });

  it('gives an error for ports that are not valid', () => {
    ['80 --script=x', 'http', '1-1024;x', '-'].forEach(ports => {
      tools.init({ flags: [], range: [] }, { range: ['10.0.0.1'], ports },
        err => assert.match(err, /Port\(s\) must match/));
    });

    ['80', '1-1024', '22,80,443', 'T:80,U:53', '1-', '-100'].forEach(ports => {
      tools.init({ flags: [], range: [] }, { range: ['10.0.0.1'], ports },
        err => assert.equal(err, null));
    });
  });
});
