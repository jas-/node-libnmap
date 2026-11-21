'use strict';
// Gets the nmap and OpenSSL sources before the build: existing files, git submodule, or pinned download.

const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { execFileSync } = require('node:child_process');

const root = path.join(__dirname, '..');
const pkg = require(path.join(root, 'package.json'));

// Each source has its pin in package.json and a file that shows that the sources are there.
const sources = [
  { name: 'nmap', pin: pkg.nmap, marker: 'configure' },
  { name: 'openssl', pin: pkg.openssl, marker: 'Configure' },
].map((source) => ({ ...source, dest: path.join(root, 'src', source.name) }));

function hasSources(source) {
  return fs.existsSync(path.join(source.dest, source.marker));
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

async function download({ name, pin, dest }) {
  const url = `${pin.repository}/archive/${pin.commit}.tar.gz`;
  console.log(`libnmap: downloading ${name} ${pin.version} (${pin.commit.slice(0, 12)})`);
  const res = await fetch(url);
  if (!res.ok) throw new Error(`download of ${url} failed: HTTP ${res.status}`);

  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'libnmap-'));
  try {
    const archive = path.join(tmp, `${name}.tar.gz`);
    fs.writeFileSync(archive, Buffer.from(await res.arrayBuffer()));
    fs.mkdirSync(dest, { recursive: true });
    execFileSync('tar', ['-xzf', archive, '-C', dest, '--strip-components=1'], { stdio: 'inherit' });
  } finally {
    fs.rmSync(tmp, { recursive: true, force: true });
  }
}

function check({ name, pin, dest }) {
  const actual = git(['-C', dest, 'rev-parse', 'HEAD']);
  if (actual !== pin.commit) {
    console.error(`libnmap: src/${name} is at ${actual}, but package.json pins ${pin.commit}.`);
    console.error(`Set "${name}.commit" in package.json to the submodule commit.`);
    process.exit(1);
  }
}

async function main() {
  if (process.argv.includes('--check')) {
    sources.forEach(check);
    return;
  }

  for (const source of sources) {
    if (hasSources(source)) continue;

    if (isGitCheckout()) {
      console.log(`libnmap: running git submodule update --init src/${source.name}`);
      git(['submodule', 'update', '--init', '--depth', '1', `src/${source.name}`], { stdio: 'inherit' });
    } else {
      await download(source);
    }

    if (!hasSources(source)) {
      throw new Error(`no ${source.name} sources in ${source.dest}`);
    }
  }
}

main().catch((err) => {
  console.error(`libnmap: ${err.message}`);
  process.exit(1);
});
