import { readFileSync, readdirSync, statSync } from 'node:fs'
import { extname, join, resolve } from 'node:path'

const ROOT = resolve('.')
const TARGET_DIRS = [resolve(ROOT, 'app')]
const TOKENS_FILE = resolve(ROOT, 'app/assets/css/tokens.css')

const COLOR_LITERAL_PATTERN = /#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})\b|rgba?\s*\(|hsla?\s*\(/g
const INLINE_STYLE_PATTERN = /\sstyle\s*=\s*["']/g

const violations = []

function walk(dir) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry)
    const st = statSync(full)
    if (st.isDirectory()) {
      walk(full)
      continue
    }
    const ext = extname(full)
    if (ext !== '.css' && ext !== '.vue') {
      continue
    }
    inspectFile(full)
  }
}

function addViolation(file, line, rule, snippet) {
  violations.push({ file, line, rule, snippet: snippet.trim() })
}

function inspectCssFile(filePath, content) {
  if (resolve(filePath) === TOKENS_FILE) {
    return
  }

  const lines = content.split(/\r?\n/)
  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i]
    COLOR_LITERAL_PATTERN.lastIndex = 0
    if (COLOR_LITERAL_PATTERN.test(line)) {
      addViolation(filePath, i + 1, 'color-literal', line)
    }
  }
}

function inspectVueFile(filePath, content) {
  const lines = content.split(/\r?\n/)
  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i]
    INLINE_STYLE_PATTERN.lastIndex = 0
    if (INLINE_STYLE_PATTERN.test(line)) {
      addViolation(filePath, i + 1, 'inline-style-attribute', line)
    }
  }

  const styleBlockPattern = /<style\b[^>]*>([\s\S]*?)<\/style>/g
  let blockMatch
  while ((blockMatch = styleBlockPattern.exec(content)) !== null) {
    const preBlock = content.slice(0, blockMatch.index)
    const baseLine = preBlock.split(/\r?\n/).length
    addViolation(filePath, baseLine, 'vue-style-block-forbidden', '<style> blocks are forbidden. Use CSS files with tokens.')

    const blockContent = blockMatch[1]
    const blockLines = blockContent.split(/\r?\n/)
    for (let i = 0; i < blockLines.length; i += 1) {
      const line = blockLines[i]
      COLOR_LITERAL_PATTERN.lastIndex = 0
      if (COLOR_LITERAL_PATTERN.test(line)) {
        addViolation(filePath, baseLine + i, 'color-literal-in-vue-style', line)
      }
    }
  }
}

function inspectFile(filePath) {
  const content = readFileSync(filePath, 'utf-8')
  const ext = extname(filePath)
  if (ext === '.css') {
    inspectCssFile(filePath, content)
    return
  }
  if (ext === '.vue') {
    inspectVueFile(filePath, content)
  }
}

for (const dir of TARGET_DIRS) {
  walk(dir)
}

if (violations.length > 0) {
  console.error('FAIL: CSS token enforcement violations found:')
  for (const item of violations) {
    console.error(`- ${item.file}:${item.line} [${item.rule}] ${item.snippet}`)
  }
  process.exit(1)
}

console.log('PASS: CSS token enforcement checks passed')
