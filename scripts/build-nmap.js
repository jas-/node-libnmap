'use strict';
// Compiles the OpenSSL and nmap sources to static libraries, as position-independent code.
// Uses the configure and make of each project. No nmap or openssl program is built.
// Prints the link inputs (libraries) for binding.gyp. All other output goes to stderr.

const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { execFileSync } = require('node:child_process');

const root = path.join(__dirname, '..');
const dir = path.join(root, 'src', 'nmap');
const stamp = path.join(dir, '.libnmap-build');
const linkmk = path.join(__dirname, 'link.mk');
const ssl = path.join(root, 'src', 'openssl');
const sslPrefix = path.join(ssl, '.libnmap');
const sslStamp = path.join(sslPrefix, '.libnmap-build');
const { nmap: pin, openssl: sslPin } = require(path.join(root, 'package.json'));

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
  // The OpenSSL that this script compiles, not the system OpenSSL.
  `--with-openssl=${sslPrefix}`,
  '--with-libssh2=included',
];

// Only the static libraries and the headers.
const SSL_CONFIGURE = ['no-shared', 'no-tests', 'no-apps', 'no-docs', '-fPIC', '-w',
  `--prefix=${sslPrefix}`, '--libdir=lib'];

const sslStampText = JSON.stringify({ commit: sslPin.commit, configure: SSL_CONFIGURE });

const stampText = JSON.stringify({ commit: pin.commit, openssl: sslPin.commit, flags: FLAGS,
  configure: CONFIGURE });

function run(cmd, args, env = process.env, cwd = dir) {
  // stdout is reserved for the link inputs.
  execFileSync(cmd, args, { cwd, env, stdio: ['ignore', 2, 2] });
}

function buildOpenssl(make, jobs) {
  if (fs.existsSync(sslStamp) && fs.readFileSync(sslStamp, 'utf8') === sslStampText) return;
  if (!fs.existsSync(path.join(ssl, 'Configure'))) {
    throw new Error('src/openssl is empty. Run: node scripts/fetch-sources.js');
  }

  console.error('libnmap: configuring OpenSSL');
  run('perl', ['Configure', ...SSL_CONFIGURE], process.env, ssl);
  console.error('libnmap: compiling OpenSSL');
  run(make, ['-j', jobs, 'build_libs'], process.env, ssl);
  run(make, ['install_dev'], process.env, ssl);
  fs.writeFileSync(sslStamp, sslStampText);
}

function isBuilt() {
  return fs.existsSync(stamp) && fs.readFileSync(stamp, 'utf8') === stampText
    && fs.existsSync(path.join(dir, 'libnmap.a'));
}

function build() {
  if (!fs.existsSync(path.join(dir, 'configure'))) {
    throw new Error('src/nmap is empty. Run: node scripts/fetch-sources.js');
  }
  const make = process.env.MAKE || 'make';
  const jobs = String(Math.max(1, os.cpus().length));

  buildOpenssl(make, jobs);

  console.error('libnmap: configuring nmap');
  run('./configure', CONFIGURE, { ...process.env, CFLAGS: FLAGS, CXXFLAGS: FLAGS });
  console.error('libnmap: compiling nmap');
  run(make, ['-j', jobs, '-f', linkmk, 'libnmap.a']);
  fs.writeFileSync(stamp, stampText);
}

// Makes the Makefile's relative paths absolute, because gyp links from another directory.
function absolute(token) {
  // The static OpenSSL of this build, and not a system library with the same name.
  if (token === '-lssl' || token === '-lcrypto') return path.join(sslPrefix, 'lib', `lib${token.slice(2)}.a`);
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
