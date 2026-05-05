import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const outDir = resolve('.output/public')
const enFile = resolve(outDir, 'index.html')
const esFile = resolve(outDir, 'es/index.html')
const siteUrl = 'https://www.kmacho.net'

function fail(message) {
  console.error(`FAIL: ${message}`)
  process.exit(1)
}

function assert(condition, message) {
  if (!condition) {
    fail(message)
  }
}

function readHtml(filePath, label) {
  assert(existsSync(filePath), `Missing generated ${label} file: ${filePath}`)
  return readFileSync(filePath, 'utf-8')
}

function assertContains(html, expected, message) {
  assert(html.includes(expected), message)
}

const enHtml = readHtml(enFile, 'EN')
const esHtml = readHtml(esFile, 'ES')

assertContains(enHtml, 'Book a discovery call', 'EN hero CTA text not found')
assertContains(esHtml, 'Agendar discovery call', 'ES hero CTA text not found')

assertContains(enHtml, 'hreflang="en"', 'EN hreflang=en not found')
assertContains(enHtml, 'hreflang="es"', 'EN hreflang=es not found')
assertContains(enHtml, 'hreflang="x-default"', 'EN hreflang=x-default not found')
assertContains(esHtml, 'hreflang="en"', 'ES hreflang=en not found')
assertContains(esHtml, 'hreflang="es"', 'ES hreflang=es not found')
assertContains(esHtml, 'hreflang="x-default"', 'ES hreflang=x-default not found')

assertContains(enHtml, 'rel="canonical"', 'EN canonical link not found')
assertContains(esHtml, 'rel="canonical"', 'ES canonical link not found')
assertContains(
  enHtml,
  `href="${siteUrl}/"`,
  'EN canonical URL does not match expected absolute URL'
)
assertContains(
  esHtml,
  `href="${siteUrl}/es"`,
  'ES canonical URL does not match expected absolute URL'
)

console.log('PASS: Generated static output and SEO tags validated')
