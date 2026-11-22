/*!
 * libnmap
 * Copyright(c) 2013 Jason Gerfen <jason.gerfen@gmail.com>
 * License: NPSL-0.95
 */

'use strict'

// Runs one nmap scan in this process. tools.js starts one worker for each
// network block, because nmap can run one time only in a process.
// The arguments are nmap arguments. The report goes to stdout.

let binding;

try {
  binding = require('../build/Release/nmap.node');
} catch (err) {
  // The package manager did not run the install script, or the build failed
  console.error('libnmap: the nmap module is not compiled. ' +
    `Run "npm rebuild libnmap" and allow its install script. (${err.code})`);
  process.exit(1);
}

process.exitCode = binding.run(process.argv.slice(2));
