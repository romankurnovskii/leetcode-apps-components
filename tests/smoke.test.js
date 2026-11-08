'use strict';

const {describe, it} = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.join(__dirname, '..');

describe('build output', () => {
  it('emits CJS, ESM, and declaration bundles', () => {
    for (const file of ['dist/index.js', 'dist/index.esm.js', 'dist/index.d.ts']) {
      assert.ok(fs.existsSync(path.join(root, file)), `missing ${file}`);
    }
  });

  it('exports the public components from the CJS bundle', () => {
    const lib = require(path.join(root, 'dist/index.js'));
    for (const name of [
      'InputCase',
      'ActionButton',
      'StartButton',
      'PreviousButton',
      'NextButton',
      'RemoteComponentViewer',
    ]) {
      assert.equal(typeof lib[name], 'function', `expected function export ${name}`);
    }
  });

  it('keeps react external (peer dependency)', () => {
    const cjs = fs.readFileSync(path.join(root, 'dist/index.js'), 'utf8');
    assert.match(cjs, /require\(['"]react['"]\)/);
    assert.match(cjs, /require\(['"]react\/jsx-runtime['"]\)/);
  });
});
