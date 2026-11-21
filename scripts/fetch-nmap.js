'use strict';
// Gets the nmap sources before the build: existing files, git submodule, or pinned download.

const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { execFileSync } = require('node:child_process');

const root = path.join(__dirname, '..');
const dest = path.join(root, 'src', 'nmap');
const { nmap: pin } = require(path.join(root, 'package.json'));

function hasSources() {
  return fs.existsSync(path.join(dest, 'nmap.cc')) && fs.existsSync(path.join(dest, 'configure'));
}

function git(args, opts = {}) {
  return execFileSync('git', args, { cwd: root, stdio: ['ignore', 'pipe', 'inherit'], ...opts })
    .toString().trim();
}

function isGitCheckout() {
  if (!fs.existsSync(path.join(root, '.git')) || !fs.existsSync(path.join(root, '.gitmodules'))) {
    return false;
  }
  try {
    return git(['rev-parse', '--show-toplevel']) === fs.realpathSync(root);
  } catch {
    return false;
  }
}

async function download() {
  const url = `${pin.repository}/archive/${pin.commit}.tar.gz`;
  console.log(`libnmap: downloading nmap ${pin.version} (${pin.commit.slice(0, 12)})`);
  const res = await fetch(url);
  if (!res.ok) throw new Error(`download of ${url} failed: HTTP ${res.status}`);

  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'libnmap-'));
  try {
    const archive = path.join(tmp, 'nmap.tar.gz');
    fs.writeFileSync(archive, Buffer.from(await res.arrayBuffer()));
    fs.mkdirSync(dest, { recursive: true });
    execFileSync('tar', ['-xzf', archive, '-C', dest, '--strip-components=1'], { stdio: 'inherit' });
  } finally {
    fs.rmSync(tmp, { recursive: true, force: true });
  }
}

function check() {
  const actual = git(['-C', dest, 'rev-parse', 'HEAD']);
  if (actual !== pin.commit) {
    console.error(`libnmap: src/nmap is at ${actual}, but package.json pins ${pin.commit}.`);
    console.error('Set "nmap.commit" in package.json to the submodule commit.');
    process.exit(1);
  }
}

async function main() {
  if (process.argv.includes('--check')) {
    check();
    return;
  }
  if (hasSources()) return;

  if (isGitCheckout()) {
    console.log('libnmap: running git submodule update --init');
    git(['submodule', 'update', '--init', '--depth', '1'], { stdio: 'inherit' });
  } else {
    await download();
  }

  if (!hasSources()) {
    throw new Error(`no nmap sources in ${dest}`);
  }
}

main().catch((err) => {
  console.error(`libnmap: ${err.message}`);
  process.exit(1);
});
