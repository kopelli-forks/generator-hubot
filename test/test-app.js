'use strict'

/* global describe, beforeEach, afterEach, it */

const path = require('path')
const assert = require('yeoman-assert')
const helpers = require('yeoman-test')

describe('hubot:app', function () {
  let tempDir
  let runResult
  beforeEach(async function () {
    runResult = await helpers
      .create(path.join(__dirname, '../generators/app'))
      .doInDir(dir => { tempDir = dir })
      .run()
  })

  afterEach(function () {
    if (runResult) {
      runResult.restore()
    }
  })

  it('successfully completes', function () {
    assert.notEqual(runResult, null)
    runResult.assertFile('package.json')
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
