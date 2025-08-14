import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

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

const flagsTargetDirectory = path.join(__dirname, 'public/flags')
fs.rmSync(flagsTargetDirectory, { recursive: true, force: true })
fs.mkdirSync(flagsTargetDirectory, { recursive: true })

for (const countryCode of countryCodes) {
  let countryEN = countriesENMap.get(countryCode)
  let countryRU = countriesRUMap.get(countryCode)

  if (!countryEN || !countryRU || !countryEN.capital || !countryRU.capital) continue

  const code = countryCode.toLowerCase()

  const flagSourcePath = path.join(__dirname, `node_modules/flag-icons/flags/4x3/${code}.svg`)
  if (!fs.existsSync(flagSourcePath)) continue

  const flagTargetPath = path.join(flagsTargetDirectory, `${code}.svg`)
  fs.copyFileSync(flagSourcePath, flagTargetPath)

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

const datasetPath = path.join(__dirname, 'src/dataset.json')
fs.writeFileSync(datasetPath, JSON.stringify(result, null, 2) + '\n')
