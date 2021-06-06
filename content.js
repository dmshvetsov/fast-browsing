const DEBUG = false;

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
}

const keyBindings = {
  BINDING: Object.freeze({
    KeyJ: { name: 'move', args: [0, 50] },
    KeyK: { name: 'move', args: [0, -50] }
  }),

  NO_BINDING: Object.freeze({ name: 'idle', args: [] }),

  find(code) {
    return keyBindings.BINDING[code] || keyBindings.NO_BINDING
  }
};

const isUserInteractsWithForm = (event) => typeof event.target.type !== 'undefined'
const isUserInteractWithContentEditable = (event) => event.target.contentEditable === 'true'

const keyDownHandler = (event) => {
  debug.verbose(`key down with code [${event.code}] received`)
  if (isUserInteractsWithForm(event) || isUserInteractWithContentEditable(event)) {
    return
  }

  const command = keyBindings.find(event.code)
  const page = new FastPage({ windowObject: window, documentObject: document })
  if (page[command.name]) {
    page[command.name](...command.args)
    debug.verbose(`key down with code [${event.code}] that corresponds to command [${command.name}] with arguments [${command.args}] handled`)
    return
  }
  debug.verbose(`page no [${event.code}] that corresponds to command [${command.name}] has no support on page object`)
}

document.onkeydown = keyDownHandler
