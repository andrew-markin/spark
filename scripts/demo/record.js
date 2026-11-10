// Records the looped animations of the app in a phone frame for the README, in the light and
// the dark theme, with no dependencies: builds the app, serves the build along with the demo
// page, drives Google Chrome via the DevTools protocol, a drawn hand taps the buttons, and
// ffmpeg encodes the screencasts to WebP. Needs Chrome and ffmpeg built with libwebp. Run with
// `npm run demo`, see the options below. Made after the one of Mult.

import { Buffer } from 'node:buffer'
import { spawn, spawnSync } from 'node:child_process'
import { createReadStream, existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync } from 'node:fs'
import { createServer } from 'node:http'
import { tmpdir } from 'node:os'
import { dirname, extname, join, resolve } from 'node:path'
import { performance } from 'node:perf_hooks'
import process from 'node:process'
import { setTimeout as sleep } from 'node:timers/promises'
import { fileURLToPath } from 'node:url'
import { parseArgs } from 'node:util'

import en from '../../src/i18n/messages/en.js'
import ru from '../../src/i18n/messages/ru.js'

const ROOT = fileURLToPath(new URL('../..', import.meta.url))

const { values: options } = parseArgs({
  options: {
    // Where the animations go, {theme} is replaced with light or dark
    out: { type: 'string', default: 'assets/demo-{theme}.webp' },
    // Records only this theme
    theme: { type: 'string' },
    chrome: { type: 'string', default: process.env.CHROME || 'google-chrome' },
    // Slows down (> 1) or speeds up (< 1) all the pauses and movements
    pace: { type: 'string', default: '1' },
    // WebP quality from 0 to 100, check the frames for traces of the moving hand when lowering it
    quality: { type: 'string', default: '75' },
    // Lossless WebP, several times larger
    lossless: { type: 'boolean', default: false },
    // Shows the browser window, for debugging of the scenario
    show: { type: 'boolean', default: false },
    // Only serves the build with the demo page at /demo, for working on the page
    serve: { type: 'boolean', default: false },
    // Keeps the lossless screencasts in files named like this, {theme} replaced, or encodes
    // these instead of recording, for trying the WebP options
    screencast: { type: 'string' },
    'from-screencast': { type: 'boolean', default: false },
    fps: { type: 'string', default: '12' },
    // Width of the animation in pixels, as wide as the page in CSS pixels by default
    width: { type: 'string', default: '568' }
  }
})

const WIDTH = 568
// The phone with an even margin below it, no empty room for the README heading lines to run into
const HEIGHT = 752
// Recorded at a constant rate and scale, both are reduced when encoding to WebP
const SCALE = 1.5
const FPS = 30
const PACE = Number(options.pace)

const THEMES = options.theme ? [options.theme] : ['light', 'dark']

// Runs in the app frame before its scripts: the app starts in English, and questions are picked
// by a seeded random, so every recording is the same
const FRAME_SCRIPT = `
  if (window !== window.top) {
    let seed = 542
    Math.random = () => (seed = (seed * 1664525 + 1013904223) % 4294967296) / 4294967296
    Object.defineProperty(Navigator.prototype, 'languages', { get: () => ['en-US'] })
    Object.defineProperty(Navigator.prototype, 'language', { get: () => 'en-US' })
  }
`

function build(dir) {
  console.log('Building the app...')
  const result = spawnSync(
    join(ROOT, 'node_modules/.bin/vite'),
    ['build', '--outDir', dir, '--emptyOutDir'],
    { cwd: ROOT, stdio: ['ignore', 'ignore', 'inherit'] }
  )
  if (result.status !== 0) throw new Error('Unable to build the app')
}

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.json': 'application/json',
  '.webmanifest': 'application/manifest+json',
  '.woff2': 'font/woff2'
}

async function serve(dir) {
  const page = readFileSync(fileURLToPath(new URL('page.html', import.meta.url)))
  const server = createServer((req, res) => {
    const path = decodeURIComponent(new URL(req.url, 'http://localhost').pathname)
    if (path === '/demo') {
      res.writeHead(200, { 'Content-Type': MIME_TYPES['.html'] })
      return res.end(page)
    }
    let file = resolve(join(dir, path))
    if (!file.startsWith(dir) || !existsSync(file) || path.endsWith('/')) {
      file = join(dir, 'index.html')
    }
    res.writeHead(200, { 'Content-Type': MIME_TYPES[extname(file)] || 'application/octet-stream' })
    createReadStream(file).pipe(res)
  })
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve))
  return server
}

async function launchChrome(profileDir) {
  const args = [
    `--user-data-dir=${profileDir}`,
    '--remote-debugging-port=0',
    `--window-size=${WIDTH},${HEIGHT}`,
    '--no-first-run',
    '--no-default-browser-check',
    '--disable-extensions',
    '--hide-scrollbars',
    '--mute-audio',
    '--force-color-profile=srgb',
    'about:blank'
  ]
  if (!options.show) args.unshift('--headless=new')
  const chrome = spawn(options.chrome, args, { stdio: ['ignore', 'ignore', 'pipe'] })
  const browserUrl = await new Promise((resolve, reject) => {
    let output = ''
    chrome.on('error', reject)
    chrome.on('exit', () => reject(new Error(`Chrome exited unexpectedly:\n${output}`)))
    chrome.stderr.on('data', (chunk) => {
      output += chunk
      const matched = output.match(/DevTools listening on (ws:\/\/\S+)/)
      if (matched) resolve(matched[1])
    })
  })
  const { host } = new URL(browserUrl)
  const targets = await (await fetch(`http://${host}/json/list`)).json()
  const target = targets.find(({ type }) => type === 'page')
  return { chrome, pageUrl: target.webSocketDebuggerUrl }
}

class Connection {
  #ws
  #nextId = 1
  #pending = new Map()
  #listeners = new Map()

  static async open(url) {
    const connection = new Connection()
    connection.#ws = new WebSocket(url)
    connection.#ws.addEventListener('message', (event) => connection.#receive(event.data))
    await new Promise((resolve, reject) => {
      connection.#ws.addEventListener('open', resolve, { once: true })
      connection.#ws.addEventListener('error', reject, { once: true })
    })
    return connection
  }

  #receive(raw) {
    const message = JSON.parse(raw)
    if (message.id) {
      const { resolve, reject } = this.#pending.get(message.id)
      this.#pending.delete(message.id)
      if (message.error) reject(new Error(`${message.error.message} ${message.error.data || ''}`))
      else resolve(message.result)
    } else {
      this.#listeners.get(message.method)?.(message.params)
    }
  }

  send(method, params = {}) {
    const id = this.#nextId++
    this.#ws.send(JSON.stringify({ id, method, params }))
    return new Promise((resolve, reject) => this.#pending.set(id, { resolve, reject }))
  }

  on(method, listener) {
    this.#listeners.set(method, listener)
  }

  close() {
    this.#ws.close()
  }
}

// Saves the screencast as a lossless video, keeping its transparency
class Recorder {
  #cdp
  #ffmpeg
  #closed
  #start
  #frame
  #written = 0

  constructor(cdp, file) {
    this.#cdp = cdp
    this.#ffmpeg = spawn(
      'ffmpeg',
      [
        ['-y', '-loglevel', 'error'],
        ['-f', 'image2pipe', '-c:v', 'png', '-framerate', FPS, '-i', 'pipe:0'],
        ['-vf', `scale=${WIDTH * SCALE}:${HEIGHT * SCALE}`, '-c:v', 'ffv1', '-pix_fmt', 'bgra'],
        file
      ]
        .flat()
        .map(String),
      { stdio: ['pipe', 'inherit', 'inherit'] }
    )
    this.#closed = new Promise((resolve) => this.#ffmpeg.on('close', resolve))
  }

  time() {
    return (performance.now() - this.#start) / 1000
  }

  async start() {
    this.#cdp.on('Page.screencastFrame', ({ data, sessionId }) => {
      this.#cdp.send('Page.screencastFrameAck', { sessionId }).catch(() => {})
      this.#flush()
      this.#frame = Buffer.from(data, 'base64')
    })
    this.#start = performance.now()
    await this.#cdp.send('Page.startScreencast', {
      format: 'png',
      maxWidth: WIDTH * SCALE,
      maxHeight: HEIGHT * SCALE
    })
  }

  // Chrome sends frames only when the page changes, so the last frame is
  // repeated until the next one to keep the frame rate constant
  #flush() {
    if (!this.#frame) return
    const due = Math.round(this.time() * FPS)
    for (; this.#written < due; this.#written++) this.#ffmpeg.stdin.write(this.#frame)
  }

  async stop() {
    await this.#cdp.send('Page.stopScreencast')
    this.#flush()
    this.#ffmpeg.stdin.end()
    await this.#closed
  }
}

// Scenario

let cdp

async function evaluate(expression) {
  const { result, exceptionDetails } = await cdp.send('Runtime.evaluate', {
    expression,
    awaitPromise: true,
    returnByValue: true
  })
  if (exceptionDetails) throw new Error(exceptionDetails.exception?.description || expression)
  return result.value
}

async function waitFor(expression, timeout = 10000) {
  const start = performance.now()
  while (!(await evaluate(expression))) {
    if (performance.now() - start > timeout) throw new Error(`Timed out waiting for ${expression}`)
    await sleep(50)
  }
}

const pause = (ms) => sleep(ms * PACE)

// Elements of the app are found by their text, like button labels, or by a selector
const text = (value) => ({ text: value })
const selector = (value) => ({ selector: value })
const LOGO = selector('.q-btn')
const FLAG = selector('img.flag')

async function mouse(type, { x, y }) {
  await cdp.send('Input.dispatchMouseEvent', {
    type,
    x,
    y,
    button: 'left',
    buttons: type === 'mouseReleased' ? 0 : 1,
    clickCount: 1
  })
}

// Moves the hand to an element of the app and taps it, or holds it for a while
async function tap(target, { hold = 0 } = {}) {
  await waitFor(`demo.shown(${JSON.stringify(target)})`)
  const point = await evaluate(`demo.point(${JSON.stringify(target)})`)
  await evaluate(`demo.move(${point.x}, ${point.y}, ${550 * PACE})`)
  await pause(80)
  await evaluate(`demo.press()`)
  await mouse('mousePressed', point)
  if (hold) {
    await evaluate(`demo.hold(${hold})`)
    await pause(100)
  }
  await mouse('mouseReleased', point)
  // Keeps the mouse off the buttons, so they show no hover
  await cdp.send('Input.dispatchMouseEvent', { type: 'mouseMoved', x: 0, y: 0 })
  await evaluate(`demo.release()`)
  if (hold) await evaluate(`demo.unhold()`)
}

// Pulls the hand aside to the corner, so the answer is seen, or out of the video
async function retreat({ away = false } = {}) {
  const { x, y } = await evaluate(`demo.rest(${away})`)
  await evaluate(`demo.move(${x}, ${y}, ${500 * PACE})`)
}

async function question(messages, known) {
  await waitFor(`demo.shown(${JSON.stringify(FLAG)})`)
  await pause(500)
  await tap(text(messages.ANSWER_REVEAL))
  await retreat()
  await waitFor(`demo.shown(${JSON.stringify(text(messages.ANSWER_KNEW))})`)
  await pause(1000)
  await tap(text(known ? messages.ANSWER_KNEW : messages.ANSWER_DIDNT_KNOW))
  await retreat()
}

// Goes to the settings and picks a language, then back to the main screen
async function language(from, to) {
  await tap(LOGO)
  await pause(500)
  await tap(text(from.SETTINGS))
  await pause(600)
  await tap(text(to._LOCALE_TITLE))
  await retreat()
  await pause(900)
  await tap(LOGO)
  await retreat()
  await pause(1000)
}

// The main screen in English, a few flags, then the same in Russian, and back as it was
async function scenario() {
  await pause(900)
  await tap(text(en.COURSE_FLAG_COUNTRY))
  for (const known of [true, false, true]) await question(en, known)
  await language(en, ru)
  await tap(text(ru.COURSE_FLAG_COUNTRY))
  for (const known of [true, true, false]) await question(ru, known)
  // Resets the progress by a long press on the score, so the animation loops seamlessly
  await pause(600)
  await tap(selector(`[title="${ru.HOLD_TO_RESET}"]`), { hold: 1100 })
  await retreat()
  await pause(700)
  await language(ru, en)
  await retreat({ away: true })
  await pause(800)
}

// Encodes the screencast to a looped animated WebP
function encode(screencast, file) {
  const width = Number(options.width)
  const height = Math.round((width * HEIGHT) / WIDTH)
  const result = spawnSync(
    'ffmpeg',
    [
      ['-y', '-loglevel', 'error', '-i', screencast],
      ['-vf', `fps=${options.fps},scale=${width}:${height}:flags=lanczos,format=yuva420p`],
      ['-c:v', 'libwebp_anim', '-loop', '0', '-compression_level', '6'],
      options.lossless ? ['-lossless', '1'] : ['-quality', options.quality],
      file
    ]
      .flat()
      .map(String),
    { stdio: 'inherit' }
  )
  if (result.status !== 0) throw new Error('Unable to encode the animation')
  console.log(`Done ${file}, ${(readFileSync(file).length / 1024).toFixed(0)} KiB`)
}

async function record(appUrl, work, theme, screencast) {
  let chrome
  try {
    const launched = await launchChrome(join(work, `profile-${theme}`))
    chrome = launched.chrome
    cdp = await Connection.open(launched.pageUrl)

    await cdp.send('Page.enable')
    await cdp.send('Runtime.enable')
    await cdp.send('Emulation.setDeviceMetricsOverride', {
      width: WIDTH,
      height: HEIGHT,
      deviceScaleFactor: SCALE,
      mobile: false
    })
    await cdp.send('Emulation.setDefaultBackgroundColorOverride', {
      color: { r: 0, g: 0, b: 0, a: 0 }
    })
    // The app follows the system theme, as nothing is chosen in its settings
    await cdp.send('Emulation.setEmulatedMedia', {
      features: [{ name: 'prefers-color-scheme', value: theme }]
    })
    await cdp.send('Page.addScriptToEvaluateOnNewDocument', { source: FRAME_SCRIPT })
    await cdp.send('Page.navigate', { url: `${appUrl}/demo` })
    await waitFor('window.demo && demo.ready()')
    // Lets the app finish fading in
    await sleep(800)

    console.log(`Recording the ${theme} theme...`)
    const recorder = new Recorder(cdp, screencast)
    await recorder.start()
    await scenario()
    await recorder.stop()
  } finally {
    cdp?.close()
    chrome?.kill()
  }
}

async function main() {
  const outFor = (theme) => resolve(ROOT, options.out.replaceAll('{theme}', theme))
  const screencastFor = (theme, work) =>
    options.screencast
      ? resolve(options.screencast.replaceAll('{theme}', theme))
      : join(work, `demo-${theme}.mkv`)
  for (const theme of THEMES) mkdirSync(dirname(outFor(theme)), { recursive: true })
  if (options['from-screencast']) {
    for (const theme of THEMES) encode(screencastFor(theme), outFor(theme))
    return
  }

  const work = mkdtempSync(join(tmpdir(), 'spark-demo-'))
  let server
  try {
    build(join(work, 'dist'))
    server = await serve(join(work, 'dist'))
    const appUrl = `http://127.0.0.1:${server.address().port}`
    if (options.serve) {
      console.log(`Serving the demo page at ${appUrl}/demo, stop with Ctrl+C`)
      await new Promise(() => {})
    }
    for (const theme of THEMES) {
      const screencast = screencastFor(theme, work)
      await record(appUrl, work, theme, screencast)
      console.log(`Encoding to ${outFor(theme)}...`)
      encode(screencast, outFor(theme))
    }
  } finally {
    server?.close()
    rmSync(work, { recursive: true, force: true })
  }
}

await main()
