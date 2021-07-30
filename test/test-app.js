'use strict'

/* global describe, before, it */

const path = require('path')
const assert = require('yeoman-assert')
const helpers = require('yeoman-test')

describe('hubot:app', function () {
  let tempDir
  before(function (done) {
    helpers.run(path.join(__dirname, '../generators/app'))
      .inTmpDir(dir => { tempDir = dir })
      .withPrompts({
        someOption: true
      })
      .on('end', done)
  })

  it('creates files', function () {
    const files = [
      'bin/hubot',
      'bin/hubot.cmd',
      'Procfile',
      'README.md',
      'external-scripts.json',
      '.gitignore',
      'package.json',
      'scripts/example.js'
    ]
    assert.file(files.map(f => path.join(tempDir, f)))
  })
})
