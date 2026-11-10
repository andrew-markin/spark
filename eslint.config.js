import js from '@eslint/js'
import { defineConfig, globalIgnores } from 'eslint/config'
import skipFormatting from 'eslint-config-prettier/flat'
import { importX } from 'eslint-plugin-import-x'
import pluginOxlint from 'eslint-plugin-oxlint'
import pluginSimpleImportSort from 'eslint-plugin-simple-import-sort'
import pluginVue from 'eslint-plugin-vue'
import globals from 'globals'

export default defineConfig([
  {
    name: 'app/files-to-lint',
    files: ['**/*.{vue,js,mjs,jsx}']
  },
  globalIgnores(['**/dist/**', '**/dist-ssr/**', '**/coverage/**']),
  {
    languageOptions: {
      globals: {
        ...globals.browser
      }
    }
  },
  js.configs.recommended,
  ...pluginVue.configs['flat/recommended'],
  ...pluginOxlint.buildFromOxlintConfigFile('.oxlintrc.json'),
  skipFormatting,
  importX.flatConfigs.recommended,
  {
    settings: {
      'import-x/resolver': {
        typescript: true,
        node: true
      }
    },
    plugins: {
      'simple-import-sort': pluginSimpleImportSort
    },
    rules: {
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',
      'import-x/first': 'error',
      'import-x/newline-after-import': 'error',
      'import-x/no-duplicates': 'error',
      'import-x/no-dynamic-require': 'error',
      'import-x/no-nodejs-modules': 'error',
      'vue/html-self-closing': 'off'
    }
  },
  {
    // Run by Node at build time or by hand, not shipped with the app
    name: 'app/node-scripts',
    files: ['*.js', 'plugins/**/*.js', 'scripts/**/*.js'],
    languageOptions: {
      globals: {
        ...globals.node
      }
    },
    rules: {
      'import-x/no-nodejs-modules': 'off'
    }
  }
])
