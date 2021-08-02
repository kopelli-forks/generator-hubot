'use strict'

const npmName = require('npm-name')
const Generator = require('yeoman-generator')
const chalk = require('chalk')
const _ = require('lodash')
_.extend(Generator.prototype, require('yeoman-generator/lib/actions/install'))

function hubotStartSay () {
  return '                     _____________________________  ' + '\n' +
          '                    /                             \\ ' + '\n' +
          ' ' + chalk.cyan('  //\\') + '              |      Extracting input for    |' + '\n' +
          ' ' + chalk.cyan(' ////\\  ') + '  ' + chalk.yellow('_____') + '    |   self-replication process   |' + '\n' +
          ' ' + chalk.cyan('//////\\  ') + chalk.yellow('/') + chalk.cyan('_____') + chalk.yellow('\\') + '   \\                             / ' + '\n' +
          ' ' + chalk.cyan('=======') + chalk.yellow(' |') + chalk.cyan('[^_/\\_]') + chalk.yellow('|') + '   /----------------------------  ' + '\n' +
          '  ' + chalk.yellow('|   | _|___') + '@@' + chalk.yellow('__|__') + '                                ' + '\n' +
          '  ' + chalk.yellow('+===+/  ///     ') + chalk.cyan('\\_\\') + '                               ' + '\n' +
          '   ' + chalk.cyan('| |_') + chalk.yellow('\\ /// HUBOT/') + chalk.cyan('\\\\') + '                             ' + '\n' +
          '   ' + chalk.cyan('|___/') + chalk.yellow('\\//      /') + chalk.cyan('  \\\\') + '                            ' + '\n' +
          '         ' + chalk.yellow('\\      /   +---+') + '                            ' + '\n' +
          '          ' + chalk.yellow('\\____/    |   |') + '                            ' + '\n' +
          '           ' + chalk.cyan('| //|') + '    ' + chalk.yellow('+===+') + '                            ' + '\n' +
          '            ' + chalk.cyan('\\//') + '      |xx|                            ' +
          '\n'
}

function hubotEndSay () {
  return '                     _____________________________  ' + '\n' +
          ' _____              /                             \\ ' + '\n' +
          ' \\    \\             |   Self-replication process   |' + '\n' +
          ' |    |    ' + chalk.yellow('_____') + '    |          complete...         |' + '\n' +
          ' |__' + chalk.cyan('\\\\') + '|   ' + chalk.yellow('/') + chalk.cyan('_____') + chalk.yellow('\\') + '   \\     Good luck with that.    / ' + '\n' +
          '   ' + chalk.cyan('|//') + chalk.yellow('+  |') + chalk.cyan('[^_/\\_]') + chalk.yellow('|') + '   /----------------------------  ' + '\n' +
          '  ' + chalk.yellow('|   | _|___') + '@@' + chalk.yellow('__|__') + '                                ' + '\n' +
          '  ' + chalk.yellow('+===+/  ///     ') + chalk.cyan('\\_\\') + '                               ' + '\n' +
          '   ' + chalk.cyan('| |_') + chalk.yellow('\\ /// HUBOT/') + chalk.cyan('\\\\') + '                             ' + '\n' +
          '   ' + chalk.cyan('|___/') + chalk.yellow('\\//      /') + chalk.cyan('  \\\\') + '                            ' + '\n' +
          '         ' + chalk.yellow('\\      /   +---+') + '                            ' + '\n' +
          '          ' + chalk.yellow('\\____/    |   |') + '                            ' + '\n' +
          '           ' + chalk.cyan('| //|') + '    ' + chalk.yellow('+===+') + '                            ' + '\n' +
          '            ' + chalk.cyan('\\//') + '      |xx|                            ' +
          '\n'
}

module.exports = class extends Generator {
  constructor (args, opts) {
    super(args, opts, { unique: 'namespace', customInstallTask: true })

    // Instance properties/methods
    this.defaultAdapter = 'shell'
    this.defaultDescription = 'A simple helpful robot for your Company'
    this.determineDefaultName = function () {
      return _.trim(_.kebabCase(_.deburr(this.appname).replace(/[^\w\s-]/g, '-').toLowerCase()), '-')
    }

    this.determineDefaultOwner = function () {
      let userName
      let userEmail

      if (typeof (this.user.git.name) === 'function') {
        userName = this.user.git.name()
      } else {
        userName = this.user.git.name
      }

      if (typeof (this.user.git.email) === 'function') {
        userEmail = this.user.git.email()
      } else {
        userEmail = this.user.git.email
      }

      if (userName && userEmail) {
        return userName + ' <' + userEmail + '>'
      } else {
        return 'User <user@example.com>'
      }
    }

    // FIXME add documentation to these
    this.option('owner', {
      desc: 'Name and email of the owner of new bot (ie Example <user@example.com>)',
      type: String
    })

    this.option('name', {
      desc: 'Name of new bot',
      type: String
    })

    this.option('description', {
      desc: 'Description of the new bot',
      type: String
    })

    this.option('adapter', {
      desc: 'Hubot adapter to use for new bot',
      type: String
    })

    this.option('defaults', {
      desc: "Accept defaults and don't prompt for user input",
      type: Boolean
    })

    if (this.options.defaults) {
      this.options.owner = this.options.owner || this.determineDefaultOwner()
      this.options.name = this.options.name || this.determineDefaultName()
      this.options.adapter = this.options.adapter || this.defaultAdapter
      this.options.description = this.options.description || this.defaultDescription
    }

    if (this.options.owner === true) {
      this.env.error('Missing owner. Make sure to specify it like --owner="<owner>"')
    }

    if (this.options.name === true) {
      this.env.error('Missing name. Make sure to specify it like --name="<name>"')
    }

    if (this.options.description === true) {
      this.env.error('Missing description. Make sure to specify it like --description="<description>"')
    }

    if (this.options.adapter === true) {
      this.env.error('Missing adapter name. Make sure to specify it like --adapter=<adapter>')
    }

    this.options.nodePackageManager = 'npm'
  }

  initializing () {
    this.pkg = require('../../package.json')

    this.externalScripts = [
      'hubot-diagnostics',
      'hubot-redis-brain',
      'hubot-rules'
    ]
  }

  async prompting () {
    const defaultOwner = this.determineDefaultOwner()
    const prompts = []
    if (!this.options.owner) {
      prompts.push({
        name: 'botOwner',
        message: 'Owner',
        default: defaultOwner
      })
    }

    if (!this.options.name) {
      prompts.push({
        name: 'botName',
        message: 'Bot name',
        default: this.determineDefaultName()
      })
    }

    if (!this.options.description) {
      prompts.push({
        name: 'botDescription',
        message: 'Description',
        default: this.defaultDescription
      })
    }

    if (!this.options.adapter) {
      prompts.push({
        name: 'botAdapter',
        message: 'Bot adapter',
        default: this.defaultAdapter,
        validate: async function (botAdapter) {
          const name = `hubot-${botAdapter}`
          const unavailable = await npmName(name)
          if (unavailable) {
            throw new Error(`Cannot find the adapter '${name}' on NPM. Try again?`)
          }
        }
      })
    }

    this.log(hubotStartSay())
    const answers = await this.prompt(prompts)
    this.botOwner = this.options.owner || answers.botOwner
    this.botName = this.options.name || answers.botName
    this.botDescription = this.options.description || answers.botDescription
    this.botAdapter = this.options.adapter || answers.botAdapter
  }

  // configuring() {}
  // default() {}

  writing () {
    const templateTokens = {
      botName: this.botName,
      botOwner: this.botOwner,
      botDescription: this.botDescription,
      botAdapter: this.botAdapter
    }
    const copyTpl = (from, to) => {
      this.fs.copyTpl(
        this.templatePath(from),
        this.destinationPath(to),
        templateTokens
      )
    }

    copyTpl('_package.json', 'package.json')
    copyTpl('gitignore', '.gitignore')
    copyTpl('README.md', 'README.md')
    copyTpl('Procfile', 'Procfile')
    this.fs.write(this.destinationPath('external-scripts.json'), JSON.stringify(this.externalScripts, undefined, 2))
    copyTpl('bin/hubot', 'bin/hubot')
    copyTpl('bin/hubot.cmd', 'bin/hubot.cmd')
    this.fs.copy(this.templatePath('scripts/*'), this.destinationPath('scripts'), { globOptions: { } })

    // NPM Installs are done automatically, so we need to augment package.json first.
    const dependencyAugmentation = {
      dependencies: { }
    }
    const packages = ['hubot'].concat(this.externalScripts)
    packages.push(`hubot-${this.botAdapter}`)
    packages.forEach(pkg => {
      dependencyAugmentation[pkg] = `${pkg}@latest`
    })
    this.fs.extendJSON(this.destinationPath('package.json'), dependencyAugmentation)
  }

  // conflicts
  install () {
    this.scheduleInstallTask('npm', null, { fund: false, audit: false })
  }

  end () {
    this.log(hubotEndSay())
  }
}
