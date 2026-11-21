/*!
 * libnmap
 * Copyright(c) 2013 Jason Gerfen <jason.gerfen@gmail.com>
 * License: NPSL-0.95
 */

'use strict'

// Runs scripts of the Nmap Scripting Engine (NSE) against each host.
// nmap includes more than 600 scripts, in categories such as:
//
//   default    scripts that are fast, reliable and useful for most scans
//   safe       scripts that do not attack or put load on the host
//   discovery  scripts that find more data about the network
//   vuln       scripts that examine the host for known vulnerabilities
//   auth       scripts that examine authentication (anonymous access...)
//   intrusive  scripts that can stop a service or look like an attack
//   brute, dos, exploit   attacks; use only with written permission
//
// The --script value accepts script names, categories and expressions.
// This example selects the vulnerability and authentication scripts that
// are also in the safe category, with the default scripts.
//
// Only scan hosts that you own or have permission to scan.

const nmap = require('../');
const opts = {
  timeout: 600,
  ports: '21-25,53,80,110,143,443,445,3306,3389,5432,8080',
  flags: [
    '-sV', // Many scripts start only for a service that nmap identified

    // The value is its own entry, so the spaces stay in one argument
    '--script', 'default or ((vuln or auth) and safe)'
  ],
  range: ['scanme.nmap.org']
};


nmap.scan(opts, (err, report) => {
  if (err) throw err;

  console.log(JSON.stringify(report, null, 2));
});
