import { execSync } from 'child_process'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const currentIsoDate = new Date().toISOString().slice(0, 10)

async function getRemoteJSON(url) {
  try {
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    return await response.json()
  } catch (error) {
    console.error('Error fetching JSON:', error)
  }
}

function getNpmPackageVersion(packageName) {
  try {
    const result = execSync(`npm list ${packageName} --json`, {
      encoding: 'utf8'
    })
    const data = JSON.parse(result)
    return data.dependencies[packageName].version
  } catch {
    return null
  }
}

const GEONAMES_ENDPOINT = 'http://api.geonames.org/countryInfoJSON'
const GEONAMES_USERNAME = process.env.GEONAMES_USERNAME || 'demo'
const GEONAMES_REQUEST = `${GEONAMES_ENDPOINT}?username=${GEONAMES_USERNAME}`

const countriesEN = await getRemoteJSON(`${GEONAMES_REQUEST}&lang=en`)
const countriesRU = await getRemoteJSON(`${GEONAMES_REQUEST}&lang=ru`)

const countryCodesSet = new Set()
const countriesENMap = new Map()
const countriesRUMap = new Map()

countriesEN.geonames.forEach((item) => {
  countriesENMap.set(item.countryCode, item)
  countryCodesSet.add(item.countryCode)
})

countriesRU.geonames.forEach((item) => {
  countriesRUMap.set(item.countryCode, item)
  countryCodesSet.add(item.countryCode)
})
const countryCodes = Array.from(countryCodesSet)

const result = []

const countryENPatches = new Map([['kz', { capital: 'Astana' }]])

const countryRUPatches = new Map([
  ['cc', { capital: 'Уэст-Айленд' }],
  ['mm', { capital: 'Нейпьидо' }],
  ['pm', { capital: 'Сен-Пьер' }],
  ['tv', { capital: 'Фунафути' }],
  ['br', { capital: 'Бразилиа' }],
  ['kz', { capital: 'Астана' }],
  ['cd', { countryName: 'ДР Конго' }]
])

const englishRegExp = /[a-zA-Z]/g
const flagComponentsDirectory = path.join(__dirname, 'src/components/flags')

fs.rmSync(flagComponentsDirectory, { recursive: true, force: true })
fs.mkdirSync(flagComponentsDirectory, { recursive: true })

const existingCountryCodes = []

for (const countryCode of countryCodes) {
  let countryEN = countriesENMap.get(countryCode)
  let countryRU = countriesRUMap.get(countryCode)

  if (!countryEN || !countryRU || !countryEN.capital || !countryRU.capital) continue

  const code = countryCode.toLowerCase()

  const flagSourcePath = path.join(__dirname, `node_modules/flag-icons/flags/4x3/${code}.svg`)
  if (!fs.existsSync(flagSourcePath)) continue

  const flagSvg = fs.readFileSync(flagSourcePath)
  existingCountryCodes.push(code.toUpperCase())

  const flagComponentPath = path.join(flagComponentsDirectory, `${code.toUpperCase()}.vue`)
  fs.writeFileSync(flagComponentPath, `<template>${flagSvg}</template>`)

  if (countryENPatches.has(code)) countryEN = { ...countryEN, ...countryENPatches.get(code) }
  if (countryRUPatches.has(code)) countryRU = { ...countryRU, ...countryRUPatches.get(code) }

  if (englishRegExp.test(countryRU.capital)) {
    console.log(
      `WARNING: Broken capital (RU): ${countryRU.capital} -- ${countryRU.countryName} -- ${code}`
    )
  }

  result.push({
    code,
    name: { en: countryEN.countryName, ru: countryRU.countryName },
    capital: { en: countryEN.capital, ru: countryRU.capital },
    population: Number(countryEN.population)
  })
}

function fixCodeSync(path) {
  execSync(`npx eslint ${path} --fix`)
  execSync(`npx prettier --write ${path}`)
}

fixCodeSync(flagComponentsDirectory)

const flagImageComponentPath = path.join(__dirname, 'src/components/FlagImage.vue')
fs.writeFileSync(
  flagImageComponentPath,
  `
<template>
  <component :is="componentName"/>
</template>
<script>
import { defineComponent } from 'vue'

${existingCountryCodes.map((code) => `import Flag${code} from '@/components/flags/${code}.vue'`).join('\n')}

export default defineComponent({
  components: {
    ${existingCountryCodes.map((code) => `Flag${code}`).join(',\n')}
  },
  props: {
    code: { type: String, default: undefined }
  },
  computed: {
    componentName() {
      return this.code ? \`Flag\${this.code.toUpperCase()}\` : undefined
    }
  }
})
</script>
`
)

fixCodeSync(flagImageComponentPath)

// Sort by population

result.sort((left, right) => {
  return left.population - right.population
})

// Assign levels

const groupSize = Math.ceil(result.length / 10)
result.forEach((country, index) => {
  country.level = 1 + Math.floor(index / groupSize)
})

// Write dataset

const datasetPath = path.join(__dirname, 'src/dataset.js')
fs.writeFileSync(
  datasetPath,
  `
// Derived from GeoNames data (https://www.geonames.org/)
// License: Creative Commons Attribution 4.0 (CC BY 4.0)
// Contains curated corrections for data accuracy
// Last updated: ${currentIsoDate}

export default ${JSON.stringify(result, null, 2)}
`
)

fixCodeSync(datasetPath)

// Update CREDITS.md file

const creditsPath = path.join(__dirname, 'CREDITS.md')
let creditsContent = fs.readFileSync(creditsPath, 'utf8')

creditsContent = creditsContent.replace(
  /<!-- DATASET_UPDATE_DATE -->.*<!-- \/DATASET_UPDATE_DATE -->/,
  `<!-- DATASET_UPDATE_DATE -->${currentIsoDate}<!-- /DATASET_UPDATE_DATE -->`
)

const flagIconsVersion = getNpmPackageVersion('flag-icons')

creditsContent = creditsContent.replace(
  /<!-- FLAG_ICONS_VERSION -->.*<!-- \/FLAG_ICONS_VERSION -->/,
  `<!-- FLAG_ICONS_VERSION -->${flagIconsVersion}<!-- /FLAG_ICONS_VERSION -->`
)

fs.writeFileSync(creditsPath, creditsContent, 'utf8')
