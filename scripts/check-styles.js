// Compares the computed styles of every element on every screen of the app between the dev
// server and the build: purging the CSS (see plugins/purge-css.js) may drop a class Quasar
// puts together at runtime, which breaks the layout quietly. Builds the app, serves the build
// and starts the dev server, drives Google Chrome over the DevTools protocol with no
// dependencies, on a phone and on a desktop, in the light and in the dark theme, and exits
// with 1 on any difference. Run with `npm run check-styles`, see the options below. Made
// after the script recording the demo.

import { spawn, spawnSync } from 'node:child_process'
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import process from 'node:process'
import { setTimeout as sleep } from 'node:timers/promises'
import { fileURLToPath, URL } from 'node:url'
import { parseArgs } from 'node:util'

import { build, createServer, preview } from 'vite'

const ROOT = fileURLToPath(new URL('..', import.meta.url))

const { values: options } = parseArgs({
  options: {
    chrome: { type: 'string', default: process.env.CHROME || 'google-chrome' },
    // Saves a screenshot of each screen of the dev server into this directory, to look at a
    // difference by eye
    screenshots: { type: 'string' }
  }
})

// The pages of the courses, with the random their question is picked with, see GO: a different
// country for each
const COURSES = [
  ['#/country-capital', 'Country - Capital', 0.1],
  ['#/capital-country', 'Capital - Country', 0.35],
  ['#/flag-country', 'Flag - Country', 0.6],
  ['#/country-flag', 'Country - Flag', 0.85]
]

const PROFILES = {
  phone: {
    // An iPhone 14, three device pixels to a CSS pixel
    metrics: { width: 390, height: 844, deviceScaleFactor: 3, mobile: true },
    touch: true,
    hover: false,
    userAgent:
      'Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1',
    platform: 'iPhone'
  },
  desktop: {
    metrics: { width: 1280, height: 800, deviceScaleFactor: 1, mobile: false },
    touch: false,
    hover: true
  }
}

// The functions below run in the pages: they are serialized, so they use nothing from here

// Runs before the scripts of every page, a reloaded one too: English, the theme to check, no
// progress saved, and a note of the reload
const START = (dark) => `
  try {
    localStorage.clear()
    localStorage.setItem('locale', 'en')
    localStorage.setItem('dark', ${dark})
    sessionStorage.setItem('reloaded', 'yes')
  } catch {}
`

// Forgets the note of the reload, to notice the next one
const FRESH = () => sessionStorage.removeItem('reloaded')

const RELOADED = () => sessionStorage.getItem('reloaded') === 'yes'

// Null once the app shows the screen with its fonts and images loaded and nothing moving or
// about to: the classes of a transition come a frame or two before the transition itself
const READY = (title) => {
  const app = document.querySelector('#app')
  if (!app || !app.classList.contains('ready')) return 'the app is not up yet'
  const text = app.querySelector('.q-card__section:first-child > span.text-h6')?.textContent.trim()
  if (text !== title) return `the title is ${text}`
  if ([...document.images].some((image) => !image.complete)) return 'images are loading'
  if (app.querySelector('[class*="-enter-"], [class*="-leave-"]')) return 'a transition is running'
  const running = document.getAnimations().length
  return running ? `${running} animations are running` : null
}

// Opens a page of the app. A question on it is picked with the random given, the same number
// every time, so both builds ask about the same country whatever else uses random numbers,
// like the client of the dev server
const GO = (hash, random) => {
  Math.random = () => random
  location.hash = hash
}

const BLUR = () => document.activeElement?.blur()

// The point in the middle of the first element matching the selector
const CENTER = (selector) => {
  const rect = document.querySelector(selector)?.getBoundingClientRect()
  return rect ? [Math.round(rect.x + rect.width / 2), Math.round(rect.y + rect.height / 2)] : null
}

const REVEALED = () =>
  [...document.querySelectorAll('[role="button"]')]
    .map((button) => button.textContent.trim())
    .join('|') === "I didn't know|I knew"

// The styles of every element: html, body and all there is under #app, each with the styles
// of ::before and ::after, hashed over all the properties. Given the number of an element
// instead of nothing, all its properties, to tell which of them differ.
//
// The values are normalized first, as the minified build only spells some of them
// differently: custom properties keep the text as written, like .3s for 0.3s or #000 for
// #000000, 0% of a background position becomes 0px, and the properties are sorted by name.
const STYLES = (index) => {
  const norm = (name, value) => {
    if (name.startsWith('--')) {
      return value
        .trim()
        .toLowerCase()
        .replace(
          /#([0-9a-f]{3})(?![0-9a-f])/g,
          (_, hex) => '#' + [...hex].map((c) => c + c).join('')
        )
        .replace(/(^|[\s,(])\.(\d)/g, (_, before, digit) => before + '0.' + digit)
        .replace(/\s+/g, ' ')
    }
    if (name.startsWith('background-position')) {
      return value.replace(/(^|\s)0%(?=\s|$)/g, (_, before) => before + '0px')
    }
    return value
  }
  const hash = (text) => {
    let h1 = 0xdeadbeef
    let h2 = 0x41c6ce57
    for (let i = 0; i < text.length; i++) {
      h1 = Math.imul(h1 ^ text.charCodeAt(i), 2654435761)
      h2 = Math.imul(h2 ^ text.charCodeAt(i), 1597334677)
    }
    h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909)
    return (h1 >>> 0).toString(36) + ':' + (h2 >>> 0).toString(36) + ':' + text.length
  }
  const elements = [document.documentElement, document.body]
  const walk = (element) => {
    for (const child of element.children) {
      elements.push(child)
      walk(child)
    }
  }
  walk(document.querySelector('#app'))
  const read = (element, pseudo) => {
    const computed = getComputedStyle(element, pseudo)
    const entries = []
    for (const name of computed) {
      // Added by the minifier, empty
      if (name.startsWith('--lightningcss-')) continue
      entries.push(`${name}:${norm(name, computed.getPropertyValue(name))}`)
    }
    return entries.sort()
  }
  if (index !== undefined) {
    const element = elements[index]
    return {
      element: read(element),
      before: read(element, '::before'),
      after: read(element, '::after')
    }
  }
  const keys = []
  const hashes = []
  const rects = []
  for (const [at, element] of elements.entries()) {
    let same = 0
    for (const sibling of element.parentElement?.children ?? []) {
      if (sibling === element) break
      if (sibling.tagName === element.tagName) same++
    }
    // html and body by name, the rest by their place among the tags of their kind
    const where = at < 2 ? element.tagName : `${same} ${element.tagName}`
    keys.push(`${where} ${element.getAttribute('class') ?? ''}`)
    hashes.push(
      ['', '::before', '::after'].map((pseudo) => hash(read(element, pseudo).join(';'))).join('|')
    )
    const rect = element.getBoundingClientRect()
    rects.push([rect.x, rect.y, rect.width, rect.height].map(Math.round).join(','))
  }
  const active = document.activeElement
  return {
    count: elements.length,
    keys,
    hashes,
    rects,
    text: document.querySelector('#app').innerText,
    focus: active === document.body ? null : `${active.tagName} ${active.className}`,
    reloaded: sessionStorage.getItem('reloaded') === 'yes'
  }
}

class Connection {
  #ws
  #nextId = 1
  #pending = new Map()

  static async open(url) {
    const connection = new Connection()
    connection.#ws = new WebSocket(url)
    connection.#ws.addEventListener('message', (event) => connection.#receive(event.data))
    // Chrome may close the connection with a reply still owed
    connection.#ws.addEventListener('close', () => connection.#fail(new Error('Chrome is gone')))
    await new Promise((resolve, reject) => {
      connection.#ws.addEventListener('open', resolve, { once: true })
      connection.#ws.addEventListener('error', reject, { once: true })
    })
    return connection
  }

  #receive(raw) {
    const message = JSON.parse(raw)
    const pending = this.#pending.get(message.id)
    if (!pending) return
    this.#pending.delete(message.id)
    if (message.error)
      pending.reject(new Error(`${message.error.message} ${message.error.data || ''}`))
    else pending.resolve(message.result)
  }

  #fail(error) {
    for (const { reject } of this.#pending.values()) reject(error)
    this.#pending.clear()
  }

  send(method, params = {}) {
    const id = this.#nextId++
    this.#ws.send(JSON.stringify({ id, method, params }))
    return new Promise((resolve, reject) => this.#pending.set(id, { resolve, reject }))
  }

  close() {
    this.#ws.close()
  }
}

// A browser of its own for every page, as one in the background isn't drawn and its
// transitions would hang
async function launchChrome(profileDir) {
  const chrome = spawn(
    options.chrome,
    [
      '--headless=new',
      `--user-data-dir=${profileDir}`,
      '--remote-debugging-port=0',
      '--window-size=1280,800',
      '--no-first-run',
      '--no-default-browser-check',
      '--disable-extensions',
      '--hide-scrollbars',
      '--mute-audio',
      '--force-color-profile=srgb',
      'about:blank'
    ],
    { stdio: ['ignore', 'ignore', 'pipe'] }
  )
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
  const page = targets.find(({ type }) => type === 'page')
  return { chrome, pageUrl: page.webSocketDebuggerUrl }
}

async function evaluate(page, fn, ...args) {
  const { result, exceptionDetails } = await page.cdp.send('Runtime.evaluate', {
    expression: `(${fn})(${args.map(JSON.stringify).join(', ')})`,
    awaitPromise: true,
    returnByValue: true
  })
  if (exceptionDetails) {
    throw new Error(
      `${page.name}: ${exceptionDetails.exception?.description || exceptionDetails.text}`
    )
  }
  return result.value
}

async function waitFor(page, fn, arg) {
  for (let i = 0; i < 50 && !(await evaluate(page, fn, arg)); i++) await sleep(100)
}

// Waits for the app to show the screen with its fonts and images loaded and nothing moving.
// Found ready twice, 350 ms apart: an image found loaded may start fading a moment later
async function settle(page, title) {
  const deadline = performance.now() + 15000
  let state = 'the app is not up yet'
  let ready = 0
  while (ready < 2 && performance.now() < deadline) {
    state = await evaluate(page, READY, title)
    ready = state ? 0 : ready + 1
    await sleep(state ? 100 : 350)
  }
  if (ready < 2) throw new Error(`${page.name}: ${state}`)
}

async function move(page, x, y) {
  await page.cdp.send('Input.dispatchMouseEvent', { type: 'mouseMoved', x, y })
}

async function click(page, [x, y]) {
  await move(page, x, y)
  for (const type of ['mousePressed', 'mouseReleased']) {
    await page.cdp.send('Input.dispatchMouseEvent', { type, x, y, button: 'left', clickCount: 1 })
  }
}

async function pressTab(page) {
  const key = { key: 'Tab', code: 'Tab', windowsVirtualKeyCode: 9 }
  await page.cdp.send('Input.dispatchKeyEvent', { type: 'keyDown', ...key })
  await page.cdp.send('Input.dispatchKeyEvent', { type: 'keyUp', ...key })
}

// Opens the app on a device of its own, in the theme to check. A script for new documents
// runs only with the domain of the page enabled
async function load(page, url, profile, theme) {
  const { cdp } = page
  await cdp.send('Page.enable')
  await cdp.send('Runtime.enable')
  await cdp.send('Emulation.setDeviceMetricsOverride', profile.metrics)
  await cdp.send('Emulation.setTouchEmulationEnabled', { enabled: profile.touch })
  if (profile.userAgent) {
    const { userAgent, platform } = profile
    await cdp.send('Emulation.setUserAgentOverride', { userAgent, platform })
  }
  await cdp.send('Emulation.setEmulatedMedia', {
    features: [{ name: 'prefers-color-scheme', value: theme }]
  })
  await cdp.send('Emulation.setFocusEmulationEnabled', { enabled: true })
  // Kept for the life of the page, to notice a reload of it
  await cdp.send('Page.addScriptToEvaluateOnNewDocument', { source: START(theme === 'dark') })
  await cdp.send('Page.navigate', { url })
  await settle(page, 'Spark')
  await evaluate(page, FRESH)
}

async function close(page) {
  // Chrome may close the connection without answering
  await Promise.race([page.cdp.send('Browser.close'), sleep(1500)]).catch(() => {})
  page.chrome.kill()
  await new Promise((resolve) => {
    const timer = setTimeout(resolve, 3000)
    page.chrome.once('exit', () => {
      clearTimeout(timer)
      resolve()
    })
  })
  // Chrome writes to its profile until it exits
  if (page.chrome.exitCode === null) page.chrome.kill('SIGKILL')
  page.cdp.close()
}

// What leads to each screen
const steps = (profile) => [
  { screen: 'home', title: 'Spark' },
  ...(profile.hover
    ? [
        {
          screen: 'home, the pointer over the first course',
          title: 'Spark',
          async action(page) {
            const center = await evaluate(page, CENTER, '#app .q-card.q-hoverable')
            await move(page, ...center)
          }
        }
      ]
    : []),
  // Keyboard focus, reached with Tab from the start of the page
  ...[
    [1, 'the logo'],
    [2, 'the first course']
  ].map(([times, what]) => ({
    screen: `home, keyboard focus on ${what}`,
    title: 'Spark',
    async action(page) {
      await move(page, 0, 0)
      await evaluate(page, BLUR)
      for (let i = 0; i < times; i++) await pressTab(page)
    }
  })),
  ...[
    ['#/settings', 'Settings'],
    ['#/about', 'About']
  ].map(([hash, title]) => ({
    screen: title.toLowerCase(),
    title,
    async action(page) {
      await move(page, 0, 0)
      await evaluate(page, BLUR)
      await evaluate(page, GO, hash, 0.5)
    }
  })),
  ...COURSES.flatMap(([hash, title, random]) => [
    {
      screen: `${title.toLowerCase()}, question`,
      title,
      action: (page) => evaluate(page, GO, hash, random)
    },
    {
      screen: `${title.toLowerCase()}, revealed`,
      title,
      async action(page) {
        const center = await evaluate(page, CENTER, '[role="button"]')
        if (!center) throw new Error(`${page.name}: no button to reveal the answer`)
        await click(page, center)
        // Keeps the pointer off the buttons, so they show no hover
        await move(page, 0, 0)
        await waitFor(page, REVEALED)
      }
    }
  ])
]

// The dev server optimizes the components a screen is made of the first time the screen is
// shown, and reloads the page then: a cold one gets every screen shown to it once, and once
// more if the page is reloaded after that as well
async function warmUp(work, url) {
  const { chrome, pageUrl } = await launchChrome(join(work, 'warm-up'))
  const page = { name: 'warm-up', chrome, cdp: await Connection.open(pageUrl) }
  try {
    await load(page, url, PROFILES.phone, 'light')
    for (let pass = 0; pass < 5; pass++) {
      await evaluate(page, FRESH)
      await evaluate(page, GO, '#/', 0.5)
      for (const { title, action } of steps(PROFILES.phone)) {
        if (action) await action(page)
        await settle(page, title)
      }
      // The reload may come a moment after the screen that brought its components is left
      await evaluate(page, FRESH)
      await sleep(1500)
      if (!(await evaluate(page, RELOADED))) break
    }
  } finally {
    await close(page)
  }
}

// The properties differing between an element of the dev server and the one of the build
const differing = (a, b) => {
  const values = (entries) =>
    new Map(
      entries.map((entry) => [
        entry.slice(0, entry.indexOf(':')),
        entry.slice(entry.indexOf(':') + 1)
      ])
    )
  const x = values(a)
  const y = values(b)
  return [...new Set([...x.keys(), ...y.keys()])]
    .filter((name) => x.get(name) !== y.get(name))
    .map((name) => `${name}: ${x.get(name) ?? 'none'} => ${y.get(name) ?? 'none'}`)
}

async function compare(work, urls, name, theme) {
  const profile = PROFILES[name]
  const pages = []
  try {
    for (const [build, url] of Object.entries(urls)) {
      const { chrome, pageUrl } = await launchChrome(join(work, `${name}-${theme}-${build}`))
      const page = {
        name: `${name} ${theme} ${build}`,
        chrome,
        cdp: await Connection.open(pageUrl)
      }
      pages.push(page)
      await load(page, url, profile, theme)
    }
    const report = []
    for (const { screen, title, action } of steps(profile)) {
      // Both pages at once: each is the only one of its browser
      const dumps = await Promise.all(
        pages.map(async (page) => {
          if (action) await action(page)
          await settle(page, title)
          return evaluate(page, STYLES)
        })
      )
      if (options.screenshots) {
        const { data } = await pages[0].cdp.send('Page.captureScreenshot', { format: 'png' })
        const file = `${name}-${theme}-${screen}`.replace(/[^a-z0-9]+/g, '-')
        writeFileSync(join(options.screenshots, `${file}.png`), Buffer.from(data, 'base64'))
      }
      const [dev, preview] = dumps
      const entry = { device: name, theme, screen, elements: dev.count }
      const styleDiffs = []
      const rectDiffs = []
      for (const [index, key] of dev.keys.entries()) {
        if (key !== preview.keys[index])
          (entry.structure ??= []).push([key, preview.keys[index] ?? 'none'])
        if (dev.hashes[index] !== preview.hashes[index]) styleDiffs.push(index)
        if (dev.rects[index] !== preview.rects[index]) rectDiffs.push(index)
      }
      if (dev.text !== preview.text) entry.text = [dev.text, preview.text]
      if (dev.focus !== preview.focus) entry.focus = [dev.focus, preview.focus]
      // A page reloaded in the middle of it all is not what the other one shows
      if (dev.reloaded || preview.reloaded) entry.reloaded = [dev.reloaded, preview.reloaded]
      if (rectDiffs.length) {
        entry.rects = rectDiffs
          .slice(0, 5)
          .map((index) => [dev.keys[index], dev.rects[index], preview.rects[index]])
      }
      if (styleDiffs.length) {
        entry.styles = []
        for (const index of styleDiffs.slice(0, 5)) {
          // Read at once, while both pages still show the screen
          const [a, b] = await Promise.all(pages.map((page) => evaluate(page, STYLES, index)))
          const differences = ['element', 'before', 'after'].flatMap((part) =>
            differing(a[part], b[part])
          )
          entry.styles.push([dev.keys[index], differences])
        }
      }
      report.push({
        entry,
        same:
          !entry.structure &&
          !entry.text &&
          !entry.reloaded &&
          !styleDiffs.length &&
          !rectDiffs.length
      })
    }
    return report
  } finally {
    for (const page of pages) await close(page)
  }
}

async function main() {
  // Fails before anything is built and started if Chrome can't be run
  const { status } = spawnSync(options.chrome, ['--version'], { stdio: 'ignore' })
  if (status !== 0) throw new Error(`Unable to run ${options.chrome}, pass --chrome=<path>`)
  const work = mkdtempSync(join(tmpdir(), 'spark-styles-'))
  if (options.screenshots) mkdirSync(options.screenshots, { recursive: true })
  let devServer
  let previewServer
  try {
    console.log('Building the app...')
    const outDir = join(work, 'dist')
    await build({ root: ROOT, logLevel: 'warn', build: { outDir, emptyOutDir: true } })
    previewServer = await preview({
      root: ROOT,
      logLevel: 'silent',
      build: { outDir },
      preview: { host: '127.0.0.1', port: 0, open: false }
    })
    // With a cache of its own, so the one of `npm run dev` running at the same time is kept
    devServer = await createServer({
      root: ROOT,
      logLevel: 'silent',
      cacheDir: join(work, 'cache'),
      server: { host: '127.0.0.1', port: 0, open: false }
    })
    await devServer.listen()
    const urls = {
      dev: devServer.resolvedUrls.local[0],
      preview: previewServer.resolvedUrls.local[0]
    }
    console.log('Showing every screen to the dev server first...')
    await warmUp(work, urls.dev)

    let compared = 0
    let differences = 0
    for (const name of Object.keys(PROFILES)) {
      for (const theme of ['light', 'dark']) {
        for (const { entry, same } of await compare(work, urls, name, theme)) {
          compared++
          if (same) {
            console.log(
              `${entry.device} ${entry.theme}: ${entry.screen}, ${entry.elements} elements, same`
            )
          } else {
            differences++
            console.log(`DIFFERENT ${JSON.stringify(entry)}`)
          }
        }
      }
    }
    console.log(
      differences
        ? `${differences} of ${compared} screens differ`
        : `${compared} screens, all the same`
    )
    process.exitCode = differences ? 1 : 0
  } finally {
    await devServer?.close()
    previewServer?.httpServer.close()
    try {
      rmSync(work, { recursive: true, force: true, maxRetries: 30, retryDelay: 100 })
    } catch {
      console.error(`Unable to remove ${work}, remove it by hand`)
    }
  }
}

await main()
