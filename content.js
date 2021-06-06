const DEBUG = false

const debug = DEBUG ? {
  verbose: (...msg) => DEBUG && console.log('fast-browsing:verbose', ...msg)
} : {
  verbose: () => { }
}

class FastPage {
  constructor({ windowObject }) {
    this._window = windowObject
  }

  move(xPixel, yPixel) {
    this._window.scrollBy(xPixel, yPixel)
  }

  scrollTo(opts) {
    this._window.scrollTo(opts)
  }
}

const keyBindings = {
  BINDING: Object.freeze({
    KeyJ: { name: 'move', args: [0, 50] },
    KeyK: { name: 'move', args: [0, -50] },
    KeyG: { name: 'scrollTo', args: [{ top: 0, behavior: 'smooth' }] },
    KeyGShift: { name: 'scrollTo', args: [() => ({ top: document.body.scrollHeight, behavior: 'smooth' })] }
  }),

  NO_BINDING: Object.freeze({ name: 'idle', args: [] }),

  find(code) {
    return keyBindings.BINDING[code] || keyBindings.NO_BINDING
  }
}

const isFunction = (value) => typeof value === 'function'
const isUserInteractsWithForm = (event) => typeof event.target.type !== 'undefined'
const isUserInteractWithContentEditable = (event) => event.target.contentEditable === 'true'

const findCommandFromEvent = (event) => {
}

const applyCommandToPage = (command) => {
  const page = new FastPage({ windowObject: window, documentObject: document })
  if (page[command.name]) {
    page[command.name](...command.args)
    return true
  }
  return false
}

const unwrapDynamicFunctions = (command) => {
  return ({
    ...command,
    args: command.args.map((commandArg) => isFunction(commandArg) ? commandArg() : commandArg)
  })
}

const keyDownHandler = (event) => {
  debug.verbose(`key down with code [${event.code}] received`)
  if (isUserInteractsWithForm(event) || isUserInteractWithContentEditable(event)) {
    return
  }

  commandKeyParts = [event.code]
  if (event.shiftKey) {
    commandKeyParts.push('Shift')
  }
  const commandKey = commandKeyParts.join('')
  const command = keyBindings.find(commandKey)
  if (applyCommandToPage(unwrapDynamicFunctions(command))) {
    debug.verbose(`key down with code [${commandKey}] that corresponds to command [${command.name}] with arguments [${command.args}] handled`)
  } else {
    debug.verbose(`page no [${commandKey}] that corresponds to command [${command.name}] has no support on page object`)
  }
}

document.onkeydown = keyDownHandler
