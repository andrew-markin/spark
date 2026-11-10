import { PurgeCSS } from 'purgecss'

// Quasar ships the styles of all its components in one stylesheet, while the app uses
// a few of them. Drops the rules whose selectors appear nowhere in the built scripts and
// pages, which are what actually runs, so components added later keep their styles.
//
// Classes put together at runtime, like q-radio__inner--${state} or body--${theme},
// are kept by the parts of their names found in front of the templates in the scripts.
// Parts shorter than four characters, like q-${type}, would keep almost everything
// and are left out, the classes built that way are to be listed in the safelist.
//
// The stylesheets keep their names, hashed before purging, as renaming them would change
// the scripts referring to them (lazy loaded pages do) without changing their own names.
// So the service worker is to check stylesheets by content, see vite.config.js.
const escape = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

export default function purgeCss({ safelist = [] } = {}) {
  return {
    name: 'purge-css',
    apply: 'build',
    enforce: 'post',
    async generateBundle(_, bundle) {
      const files = Object.values(bundle)
      const content = files
        .filter(({ fileName }) => /\.(js|html)$/.test(fileName))
        .map(({ fileName, code, source }) => ({
          raw: String(code ?? source),
          extension: fileName.split('.').pop()
        }))
      const parts = new Set()
      for (const { raw } of content) {
        for (const [, part] of raw.matchAll(/([A-Za-z][\w-]*[-_])\$\{/g)) {
          if (part.length >= 4) parts.add(part)
        }
      }
      const templates = [...parts].map((part) => new RegExp(escape(part)))
      for (const file of files.filter(({ fileName }) => fileName.endsWith('.css'))) {
        const [{ css }] = await new PurgeCSS().purge({
          content,
          css: [{ raw: String(file.source) }],
          safelist: { standard: [...safelist, ...templates] }
        })
        file.source = css
      }
    }
  }
}
