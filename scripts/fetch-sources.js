'use strict';
// Gets the nmap and OpenSSL sources before the build: existing files, git submodule, or pinned download.

const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const crypto = require('node:crypto');
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

// SHA-256 of the file tree: each file's path and SHA-256, sorted by path. Ignores .git.
// Hashes the files, not the archive: GitHub does not keep archive bytes the same.
function treeHash(dir) {
  const lines = [];
  const walk = (rel) => {
    for (const entry of fs.readdirSync(path.join(dir, rel), { withFileTypes: true })) {
      const name = rel ? `${rel}/${entry.name}` : entry.name;
      if (entry.name === '.git') continue;
      if (entry.isDirectory()) walk(name);
      else if (entry.isFile()) {
        const sum = crypto.createHash('sha256').update(fs.readFileSync(path.join(dir, name))).digest('hex');
        lines.push(`${name} ${sum}`);
      }
    }
  };
  walk('');
  return crypto.createHash('sha256').update(lines.sort().join('\n')).digest('hex');
}

async function download({ name, pin, dest }) {
  const url = `${pin.repository}/archive/${pin.commit}.tar.gz`;
  console.log(`libnmap: downloading ${name} ${pin.version} (${pin.commit.slice(0, 12)})`);
  const res = await fetch(url);
  if (!res.ok) throw new Error(`download of ${url} failed: HTTP ${res.status}`);

  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'libnmap-'));
  try {
    const archive = path.join(tmp, `${name}.tar.gz`);
    const tree = path.join(tmp, name);
    fs.writeFileSync(archive, Buffer.from(await res.arrayBuffer()));
    fs.mkdirSync(tree);
    execFileSync('tar', ['-xzf', archive, '-C', tree, '--strip-components=1'], { stdio: 'inherit' });

    const actual = treeHash(tree);
    if (actual !== pin.sha256) {
      throw new Error(`the ${name} sources from ${url} do not match package.json ` +
                      `(sha256 ${actual}, expected ${pin.sha256})`);
    }
    fs.mkdirSync(dest, { recursive: true });
    fs.cpSync(tree, dest, { recursive: true });
  } finally {
    fs.rmSync(tmp, { recursive: true, force: true });
  }
}

// SHA-256 of the files at a commit of a submodule, as the GitHub archive of that commit holds them.
// git archive uses the export-ignore attributes, as GitHub does. The build output in the
// working tree has no effect on the hash.
function commitHash(dest, commit) {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'libnmap-'));
  try {
    const archive = path.join(tmp, 'tree.tar');
    const tree = path.join(tmp, 'tree');
    git(['-C', dest, 'archive', '--format=tar', '-o', archive, commit]);
    fs.mkdirSync(tree);
    execFileSync('tar', ['-xf', archive, '-C', tree], { stdio: 'inherit' });
    return treeHash(tree);
  } finally {
    fs.rmSync(tmp, { recursive: true, force: true });
  }
}

// Before a publish: each submodule must be the pinned commit, and its files must give the pinned hash.
function check({ name, pin, dest }) {
  const actual = git(['-C', dest, 'rev-parse', 'HEAD']);
  if (actual !== pin.commit) {
    console.error(`libnmap: src/${name} is at ${actual}, but package.json pins ${pin.commit}.`);
    console.error(`Set "${name}.commit" in package.json to the submodule commit.`);
    process.exit(1);
  }
  const sum = commitHash(dest, pin.commit);
  if (sum !== pin.sha256) {
    console.error(`libnmap: src/${name} has sha256 ${sum}, but package.json pins ${pin.sha256}.`);
    console.error(`Set "${name}.sha256" in package.json to that value.`);
    process.exit(1);
  }
}

async function main() {
  if (process.argv.includes('--hash')) {
    const arg = process.argv[process.argv.indexOf('--hash') + 1];
    const source = sources.find((s) => s.name === arg);
    if (source) console.log(commitHash(source.dest, source.pin.commit));
    else if (arg) console.log(treeHash(path.resolve(arg)));
    else sources.forEach((s) => console.log(`${s.name} ${commitHash(s.dest, s.pin.commit)}`));
    return;
  }
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
