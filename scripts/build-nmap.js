'use strict';
// Compiles the nmap sources to a static library (libnmap.a), as position-independent code.
// Uses nmap's own configure and make. No nmap program is built.
// Prints the link inputs (libraries) for binding.gyp. All other output goes to stderr.

const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { execFileSync } = require('node:child_process');

const root = path.join(__dirname, '..');
const dir = path.join(root, 'src', 'nmap');
const stamp = path.join(dir, '.libnmap-build');
const linkmk = path.join(__dirname, 'link.mk');
const { nmap: pin } = require(path.join(root, 'package.json'));

const FLAGS = '-fPIC -O2 -w';

// Only nmap. The bundled libraries make the build independent of system packages.
const CONFIGURE = [
  '--without-zenmap',
  '--without-ndiff',
  '--without-nping',
  '--without-ncat',
  '--with-libpcap=included',
  '--with-libpcre=included',
  '--with-libz=included',
  '--with-liblua=included',
  '--with-libdnet=included',
  '--with-liblinear=included',
];

const stampText = JSON.stringify({ commit: pin.commit, flags: FLAGS, configure: CONFIGURE });

function run(cmd, args, env = process.env) {
  // stdout is reserved for the link inputs.
  execFileSync(cmd, args, { cwd: dir, env, stdio: ['ignore', 2, 2] });
}

function isBuilt() {
  return fs.existsSync(stamp) && fs.readFileSync(stamp, 'utf8') === stampText
    && fs.existsSync(path.join(dir, 'libnmap.a'));
}

function build() {
  if (!fs.existsSync(path.join(dir, 'configure'))) {
    throw new Error('src/nmap is empty. Run: node scripts/fetch-nmap.js');
  }
  const make = process.env.MAKE || 'make';
  const jobs = String(Math.max(1, os.cpus().length));

  console.error('libnmap: configuring nmap');
  run('./configure', CONFIGURE, { ...process.env, CFLAGS: FLAGS, CXXFLAGS: FLAGS });
  console.error('libnmap: compiling nmap');
  run(make, ['-j', jobs, '-f', linkmk, 'libnmap.a']);
  fs.writeFileSync(stamp, stampText);
}

// Makes the Makefile's relative paths absolute, because gyp links from another directory.
function absolute(token) {
  if (token.startsWith('-L')) return `-L${path.resolve(dir, token.slice(2))}`;
  if (token.startsWith('-')) return token;
  return path.resolve(dir, token);
}

function linkInputs() {
  const make = process.env.MAKE || 'make';
  const out = execFileSync(make, ['-s', '--no-print-directory', '-f', linkmk,
    'libnmap-link'], { cwd: dir, stdio: ['ignore', 'pipe', 2] }).toString();
  return out.split(/\s+/).filter(Boolean).map(absolute);
}

try {
  if (!isBuilt()) build();
  for (const token of linkInputs()) console.log(token);
} catch (err) {
  console.error(`libnmap: ${err.message}`);
  process.exit(1);
}
