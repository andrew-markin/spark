import { Buffer } from 'node:buffer'
import { crc32, deflateSync } from 'node:zlib'

// iOS ignores the web app manifest for the launch screen and shows a white one,
// unless there is an apple-touch-startup-image exactly matching the screen size.
// Screen sizes in CSS pixels (portrait) and their pixel ratios, add new devices here.
const SCREENS = [
  // iPhone
  [320, 568, 2], // SE (1st gen), 5s
  [375, 667, 2], // SE (2nd, 3rd gen), 6, 7, 8
  [414, 736, 3], // 6 Plus, 7 Plus, 8 Plus
  [375, 812, 3], // X, XS, 11 Pro, 12 mini, 13 mini
  [414, 896, 2], // XR, 11
  [414, 896, 3], // XS Max, 11 Pro Max
  [390, 844, 3], // 12, 12 Pro, 13, 13 Pro, 14, 16e
  [428, 926, 3], // 12 Pro Max, 13 Pro Max, 14 Plus
  [393, 852, 3], // 14 Pro, 15, 15 Pro, 16
  [430, 932, 3], // 14 Pro Max, 15 Plus, 15 Pro Max, 16 Plus
  [402, 874, 3], // 16 Pro, 17, 17 Pro
  [420, 912, 3], // Air
  [440, 956, 3], // 16 Pro Max, 17 Pro Max
  // iPad
  [768, 1024, 2], // mini (5th gen), 9.7"
  [744, 1133, 2], // mini (6th, 7th gen)
  [810, 1080, 2], // 10.2"
  [834, 1112, 2], // Air (3rd gen), Pro 10.5"
  [820, 1180, 2], // Air 11", 10th gen and later
  [834, 1194, 2], // Pro 11"
  [834, 1210, 2], // Pro 11" (M4)
  [1024, 1366, 2], // Air 13", Pro 12.9"
  [1032, 1376, 2] // Pro 13" (M4)
]

function chunk(type, data) {
  const length = Buffer.alloc(4)
  length.writeUInt32BE(data.length)
  const body = Buffer.concat([Buffer.from(type, 'ascii'), data])
  const crc = Buffer.alloc(4)
  crc.writeUInt32BE(crc32(body))
  return Buffer.concat([length, body, crc])
}

// Single color PNG: a one entry palette and 1 bit per pixel, so it takes about a kilobyte
function solidPng(width, height, color) {
  const header = Buffer.alloc(13)
  header.writeUInt32BE(width, 0)
  header.writeUInt32BE(height, 4)
  header[8] = 1 // Bit depth
  header[9] = 3 // Indexed color
  const palette = Buffer.from(color.replace('#', ''), 'hex')
  // Every row is a filter type byte followed by pixel bits, all zeros here
  const pixels = Buffer.alloc(height * (1 + Math.ceil(width / 8)))
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', header),
    chunk('PLTE', palette),
    chunk('IDAT', deflateSync(pixels, { level: 9 })),
    chunk('IEND', Buffer.alloc(0))
  ])
}

export default function iosSplashScreens({ color, dir = 'splash' }) {
  let base = '/'
  const images = SCREENS.flatMap(([width, height, ratio]) =>
    ['portrait', 'landscape'].map((orientation) => {
      const [w, h] = orientation === 'portrait' ? [width, height] : [height, width]
      return {
        fileName: `${dir}/${w * ratio}x${h * ratio}.png`,
        width: w * ratio,
        height: h * ratio,
        media:
          `(device-width: ${width}px) and (device-height: ${height}px) and ` +
          `(-webkit-device-pixel-ratio: ${ratio}) and (orientation: ${orientation})`
      }
    })
  )

  return {
    name: 'ios-splash-screens',
    apply: 'build',
    configResolved(config) {
      base = config.base
    },
    generateBundle() {
      for (const { fileName, width, height } of images) {
        this.emitFile({ type: 'asset', fileName, source: solidPng(width, height, color) })
      }
    },
    transformIndexHtml() {
      return images.map(({ fileName, media }) => ({
        tag: 'link',
        attrs: { rel: 'apple-touch-startup-image', media, href: base + fileName },
        injectTo: 'head'
      }))
    }
  }
}
