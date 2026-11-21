/*!
 * libnmap
 * Copyright(c) 2013 Jason Gerfen <jason.gerfen@gmail.com>
 * License: NPSL-0.95
 */

'use strict'

const path = require('path');
const proc = require('child_process').spawn;

const network = require('./networking.js');
const reporting = require('./reporting.js');
const validation = require('./validation.js');

const worker = path.join(__dirname, '..', 'worker.js');
const nmapdir = path.join(__dirname, '..', '..', 'src', 'nmap');

class tools {
  merge(defaults, obj) {
    const result = {};

    [defaults, obj].forEach(source => {
      Object.keys(source || {}).forEach(key => {
        const value = source[key];

        if (Array.isArray(value))
          result[key] = (Array.isArray(result[key]) ? result[key] : [])
            .concat(value);
        else
          result[key] = value;
      });
    });

    return result;
  }

  command(opts, hosts, ipv6) {
    let args = [];

    if (opts.udp)
      args.push('-sU');

    args.push(`--host-timeout=${opts.timeout}s`);

    opts.flags.forEach(flag => {
      flag = String(flag).trim();

      if (flag[0] === '-')
        args = args.concat(flag.split(/\s+/));
      else if (flag)
        args.push(flag);
    });

    if (ipv6)
      args.push('-6');

    if (opts.ports)
      args.push(`-p${opts.ports}`);

    return args.concat('--', hosts);
  }

  scan(args, cb) {
    const report = [];
    const errors = [];
    let done = false;

    const finish = (err, xml) => {
      if (done)
        return;

      done = true;
      cb(err, xml);
    };

    const execute = proc(process.execPath, [worker].concat(args), {
      env: Object.assign({}, process.env, {
        NMAPDIR: nmapdir,
        ELECTRON_RUN_AS_NODE: '1'
      })
    });

    execute.stderr.on('data', (chunk) => {
      errors.push(chunk);
    });

    execute.stdout.on('data', (chunk) => {
      report.push(chunk);
    });

    execute.on('error', (err) => {
      finish(err);
    });

    execute.on('close', (code, signal) => {
      const messages = Buffer.concat(errors).toString().trim();

      if (signal)
        return finish(new Error(`nmap was stopped by signal ${signal} ` +
          'before the scan was complete'));

      if (code !== 0 || report.length === 0)
        return finish(new Error(messages ||
          `nmap stopped with exit code ${code}`));

      return finish(null, Buffer.concat(report).toString());
    });

    return execute;
  }

  worker(opts, fn) {
    const reports = [];
    let remaining = opts.scans.length;
    let failed = false;

    opts.scans.forEach((args, idx) => {
      this.scan(args, (err, xml) => {
        if (failed)
          return;

        if (err) {
          failed = true;
          return fn(err);
        }

        reports[idx] = xml;

        if (--remaining === 0)
          reporting.reports(opts, reports, fn);
      });
    });
  }

  init(defaults, opts, cb, discover) {
    if (typeof opts !== 'object')
      opts = {};

    opts = this.merge(defaults, opts);

    if (opts.flags.indexOf('-oX -') === -1)
      opts.flags.push('-oX -');

    if (discover) {
      opts.range = network.adapters();

      if (opts.range.length === 0)
        return cb(validation.messages.adapters);

      opts.ports = '';
      opts.flags = [
        '-oX -',
        '-sn',
        '-PR'
      ];
    }

    validation.init(opts, (err) => {
      if (err)
        return cb(err);

      const hosts = network.families(opts.range);

      opts.scans = [];

      if (hosts.ipv4.length > 0)
        opts.scans.push(this.command(opts, hosts.ipv4, false));

      if (hosts.ipv6.length > 0)
        opts.scans.push(this.command(opts, hosts.ipv6, true));

      return cb(null, opts);
    });
  }
}

module.exports = new tools;
