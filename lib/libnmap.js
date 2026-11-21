/*!
 * libnmap
 * Copyright(c) 2013 Jason Gerfen <jason.gerfen@gmail.com>
 * License: NPSL-0.95
 */

'use strict'

const tools = require('./classes/tools.js');

const defaults = {
  ports: '1-1024',
  range: [],
  timeout: 120,
  flags: ['-T4'],
  udp: false,
  json: true
};

const run = (obj, cb, discover) => {
  cb = cb || obj;

  tools.init(defaults, obj, (err, opts) => {
    if (err)
      return cb(new Error(err));

    tools.worker(opts, (err, report) => {
      if (err)
        return cb((err instanceof Error) ? err : new Error(err));

      cb(null, report);
    });
  }, discover);
};

class nmap {
  discover(obj, cb) {
    run(obj, cb, true);
  }

  scan(obj, cb) {
    run(obj, cb, false);
  }
}

module.exports = new nmap();
