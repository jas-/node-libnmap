/*!
 * libnmap
 * Copyright(c) 2013-2018 Jason Gerfen <jason.gerfen@gmail.com>
 * License: MIT
 */

'use strict'

const async = require('async');
const merge = require('deepmerge');
const caller = require('caller-id');
const proc = require('child_process').exec;
const emitter = require('events').EventEmitter;

const network = require('./networking.js');
const reporting = require('./reporting.js');
const validation = require('./validation.js');


class tools extends emitter {

  /**
   * @function merge
   * Perform preliminary option/default object merge
   *
   * @param {Object} defaults Application defaults
   * @param {Object} obj User supplied object
   *
   * @returns {Object}
   */
  merge(defaults, obj) {
    return merge(defaults, obj);
  }


  /**
   * @function chunk
   * Defines new property for array's
   * 
   * @param {Array} obj Supplied array
   * @param {Integer} offset Supplied offset
   * 
   * @returns {Array}
   */
  chunk(obj, offset) {
    let idx = 0;
    const alength = obj.length;
    const tarray = [];

    for (idx = 0; idx < alength; idx += offset) {
      tarray.push(obj.slice(idx, idx + offset).join(' '));
    }

    return tarray;
  }


  /**
   * @function flatten
   * Flattens nested arrays into one flat array
   * 
   * @param {Array} arr Array combinator
   * @param {Array} obj User supplied array
   * 
   * @returns {Array}
   */
  flatten(arr, obj) {
    let value;
    const result = [];

    for (let i = 0, length = arr.length; i < length; i++) {

      value = arr[i];

      if (Array.isArray(value)) {
        return this.flatten(value, obj);
      } else {
        result.push(value);
      }
    }
    return result;
  }


  /**
   * @function funcs
   * Create functions for use as callbacks
   *
   * @param {Obect} opts Application defaults
   *
   * @returns {Array}
   */
  funcs(opts) {
    const scope = this;
    const funcs = {};
    let cmd = false;
    const errors = [];
    const reports = [];

    if (opts.range.length <= 0)
      return new Error("Range of hosts could not be created");

    Object.keys(opts.range).forEach(function blocks(block) {

      const range = opts.range[block];
      funcs[range] = function block(callback) {
        cmd = scope.command(opts, range);

        if (opts.verbose)
          console.log(`Running: ${cmd}`);

        const report = [];

        const execute = proc(cmd, function exe(err, stdout, stderr) {
          if (err)
            //return this.emit('error', reporting.reports(opts, err, callback));
            return reporting.reports(opts, err, callback);
        });

        execute.stderr.on('data', function errbytes(chunk) {
          /* Silently discard stderr messages to not interupt scans */
        });

        execute.stdout.on('data', function bytes(chunk) {
          report.push(chunk);
        });

        execute.stdout.on('end', function bytesend() {
          if (report.length > 0)
            //this.emit('report', reporting.reports(opts, report, callback));
            return reporting.reports(opts, report, callback);
        });
      };
    });

    return funcs;
  }


  /**
   * @function command
   * Generate nmap command string
   *
   * @param {Object} opts - User supplied options
   * @param {String} block - Network block
   *
   * @returns {String} NMAP scan string
   */
  command(opts, block) {
    const flags = opts.flags.join(' ');
    const proto = (opts.udp) ? ' -sU' : ' ';
    const to = `--host-timeout=${opts.timeout}s `;
    const ipv6 = (validation.test(validation.patterns.IPv6, block)) ?
      ' -6 ' : ' ';

    return (opts.ports) ?
      `${opts.nmap+proto} ${to}${flags}${ipv6}-p${opts.ports} ${block}` :
      `${opts.nmap+proto} ${to}${flags}${ipv6}${block}`;
  }


  /**
   * @function worker
   * Executes object of functions
   *
   * @param {Object} obj User supplied object
   * @param {Function} fn Return function
   */
  worker(obj, fn) {
    async.parallelLimit(obj.funcs, obj.threshold, fn);
  }


  /**
   * @function init
   * @scope private
   * Merges supplied options & builds functions
   *
   * @param {Object} defaults libnmap default options
   * @param {Object} opts User supplied configuration object
   * @param {Function} cb Callback
   *
   * @returns {Object}
   */
  init(defaults, opts, cb) {
    let funcs = [];
    const ranges = [];

    /* Override 'defaults.flags' array with 'opts.flags' (prevents merge) */
    if (/array/.test(typeof opts.flags))
      defaults.flags = opts.flags;

    opts = this.merge(defaults, opts);

    /* Ensure we can always parse the report */
    if (opts.flags.indexOf('-oX -') === -1)
      opts.flags.push('-oX -');

    if (opts.range.length === 0) {
      if (!(opts.range = network.adapters(opts)))
        return cb(new Error(validation.messages.version));

      /* Set scan options as static values for 'discover' mode */
      opts.ports = '';
      opts.flags = [
        '-n',
        '-oX -',
        '-sn',
        '-PR'
      ];
    }

    validation.init(opts, (err, result) => {
      if (err)
        return cb(err);

      opts.range = network.calculate(opts);
      funcs = this.funcs(opts);

      return cb(null, {
        opts,
        funcs
      });
    });
  }
}


module.exports = new tools;
