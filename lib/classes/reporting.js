/*!
 * libnmap
 * Copyright(c) 2013-2019 Jason Gerfen <jason.gerfen@gmail.com>
 * License: MIT
 */

'use strict'

const xml2js = require('xml2js');


class reporting {


  /**
   * @function reports
   * Handle results
   *
   * @param {Obect} opts Application defaults
   * @param {Function} cb Return function
   *
   * @returns {Function}
   */
  reports(opts, report, cb) {
    if ((!/object/.test(typeof report)) || (report.hasOwnProperty('code')))
      return cb(report);

    const xml = report.join('');

    if (!opts.json)
      return cb(null, xml);

    try {
      const parserOptions = {
        attrkey: "item",
      };

      const xmlParser = new xml2js.Parser(parserOptions);

      xmlParser.parseString(xml, (err, json) => {
        if(err)
          return cb(err);

        return cb(null, json.nmaprun);
      });
    } catch(err) {
      return cb(err);
    }
  }
}

module.exports = new reporting;
