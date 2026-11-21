/*!
 * libnmap
 * Copyright(c) 2013 Jason Gerfen <jason.gerfen@gmail.com>
 * License: NPSL-0.95
 */

'use strict'

const parser = require('./xml.js');

const same = ['verbose', 'debugging'];

class reporting {
  reports(opts, reports, cb) {
    let result;

    try {
      result = (opts.json) ?
        reports.map(xml => parser.parse(xml).nmaprun).reduce(this.json) :
        reports.reduce(this.xml);
    } catch(err) {
      return cb(err);
    }

    return cb(null, result);
  }

  json(report, added) {
    Object.keys(added).forEach(name => {
      if (!Array.isArray(added[name]) || same.indexOf(name) !== -1)
        return;

      report[name] = (report[name] || []).concat(added[name]);
    });

    return report;
  }

  xml(report, added) {
    const end = report.lastIndexOf('</nmaprun>');
    const root = added.indexOf('<nmaprun');
    const first = added.indexOf('>', root) + 1;
    const last = added.lastIndexOf('</nmaprun>');

    if (end === -1 || root === -1 || last === -1)
      throw new Error('XML report is not complete: no nmaprun element');

    let elements = added.slice(first, last).trim();

    same.forEach(name => {
      elements = elements.replace(new RegExp(`<${name}\\b[^>]*/>\\s*`, 'g'), '');
    });

    return `${report.slice(0, end)}${elements}\n${report.slice(end)}`;
  }
}

module.exports = new reporting;
