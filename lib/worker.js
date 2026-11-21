/*!
 * libnmap
 * Copyright(c) 2013 Jason Gerfen <jason.gerfen@gmail.com>
 * License: NPSL-0.95
 */

'use strict'

// Runs one nmap scan in this process. tools.js starts one worker for each
// network block, because nmap can run one time only in a process.
// The arguments are nmap arguments. The report goes to stdout.

const binding = require('../build/Release/nmap.node');

process.exitCode = binding.run(process.argv.slice(2));
