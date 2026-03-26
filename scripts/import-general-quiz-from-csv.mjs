#!/usr/bin/env node
/**
 * Import `general-quiz` questions from a Google Sheet CSV export into `src/data/decade_records.json`.
 *
 * Usage:
 *   node scripts/import-general-quiz-from-csv.mjs path/to/general.csv
 *
 * Expected CSV (header row) columns (case-insensitive):
 * - question / question_en
 * - question_ml
 * - option_a, option_b, option_c, option_d  (or options as a single pipe-separated field)
 * - option_a_ml, option_b_ml, option_c_ml, option_d_ml (optional)
 * - answer (A/B/C/D or 1/2/3/4 or 0/1/2/3)
 * - kerala_stat_2026, national_average, historical_benchmark, flex_fact, flex_fact_ml, source
 *
 * Notes:
 * - Keeps other modules untouched.
 * - Rewrites general-quiz.questions with new sequential ids starting at 1.
 */

import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.join(process.cwd());
const DATA_PATH = path.join(ROOT, 'src', 'data', 'decade_records.json');
const GENERAL_SLUG = 'general-quiz';

function die(msg) {
  console.error(msg);
  process.exit(1);
}

function stripBom(s) {
  return s.charCodeAt(0) === 0xfeff ? s.slice(1) : s;
}

function parseCsv(text) {
  // Minimal CSV parser (RFC4180-ish) that supports quoted fields with commas/newlines.
  const rows = [];
  let row = [];
  let cur = '';
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    const next = text[i + 1];

    if (inQuotes) {
      if (ch === '"' && next === '"') {
        cur += '"';
        i++;
      } else if (ch === '"') {
        inQuotes = false;
      } else {
        cur += ch;
      }
      continue;
    }

    if (ch === '"') {
      inQuotes = true;
      continue;
    }

    if (ch === ',') {
      row.push(cur);
      cur = '';
      continue;
    }

    if (ch === '\n') {
      row.push(cur);
      cur = '';
      rows.push(row);
      row = [];
      continue;
    }

    if (ch === '\r') continue;
    cur += ch;
  }

  row.push(cur);
  rows.push(row);
  return rows;
}

function normKey(k) {
  return String(k || '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '_');
}

function get(row, map, key) {
  const idx = map.get(key);
  if (idx == null) return '';
  return (row[idx] ?? '').toString().trim();
}

function parseAnswer(raw) {
  const v = String(raw || '').trim();
  if (!v) return -1;
  const up = v.toUpperCase();
  if (up === 'A') return 0;
  if (up === 'B') return 1;
  if (up === 'C') return 2;
  if (up === 'D') return 3;
  const n = Number(v);
  if (Number.isFinite(n)) {
    if (n === 1) return 0;
    if (n === 2) return 1;
    if (n === 3) return 2;
    if (n === 4) return 3;
    if (n >= 0 && n <= 3) return n;
  }
  return -1;
}

function pickOptions(row, map, suffix = '') {
  const a = get(row, map, `option_a${suffix}`);
  const b = get(row, map, `option_b${suffix}`);
  const c = get(row, map, `option_c${suffix}`);
  const d = get(row, map, `option_d${suffix}`);
  const pipe = get(row, map, `options${suffix}`);
  if (pipe) {
    const parts = pipe.split('|').map((s) => s.trim()).filter(Boolean);
    return parts.length ? parts.slice(0, 4) : [];
  }
  const arr = [a, b, c, d].filter(Boolean);
  return arr.length === 4 ? arr : [];
}

const csvPath = process.argv[2];
if (!csvPath) die('Provide CSV path: node scripts/import-general-quiz-from-csv.mjs path/to/general.csv');
if (!fs.existsSync(csvPath)) die(`CSV not found: ${csvPath}`);
if (!fs.existsSync(DATA_PATH)) die(`Data not found: ${DATA_PATH}`);

const csvText = stripBom(fs.readFileSync(csvPath, 'utf8'));
const rows = parseCsv(csvText).filter((r) => r.some((c) => String(c || '').trim().length));
if (rows.length < 2) die('CSV has no data rows.');

const header = rows[0].map(normKey);
const idxMap = new Map(header.map((k, i) => [k, i]));

const modules = JSON.parse(fs.readFileSync(DATA_PATH, 'utf8'));
const mod = modules.find((m) => m.slug === GENERAL_SLUG);
if (!mod) die(`Module not found in decade_records.json: ${GENERAL_SLUG}`);

const questions = [];
for (let r = 1; r < rows.length; r++) {
  const row = rows[r];
  const qEn = get(row, idxMap, 'question') || get(row, idxMap, 'question_en');
  const qMl = get(row, idxMap, 'question_ml');
  const opts = pickOptions(row, idxMap, '');
  const optsMl = pickOptions(row, idxMap, '_ml');
  const ans = parseAnswer(get(row, idxMap, 'answer'));

  if (!qEn || opts.length !== 4 || ans < 0) continue;

  questions.push({
    id: questions.length + 1,
    question: qEn,
    question_ml: qMl || undefined,
    options: opts,
    options_ml: optsMl.length === 4 ? optsMl : undefined,
    answer: ans,
    kerala_stat_2026: get(row, idxMap, 'kerala_stat_2026') || '-',
    national_average: get(row, idxMap, 'national_average') || '-',
    historical_benchmark: get(row, idxMap, 'historical_benchmark') || '-',
    flex_fact: get(row, idxMap, 'flex_fact') || '-',
    flex_fact_ml: get(row, idxMap, 'flex_fact_ml') || undefined,
    source: get(row, idxMap, 'source') || '-',
  });
}

if (!questions.length) {
  die('No valid questions parsed. Check column names and that options/answer are present.');
}

mod.questions = questions;
fs.writeFileSync(DATA_PATH, JSON.stringify(modules, null, 2) + '\n');

console.log(`Imported ${questions.length} questions into ${GENERAL_SLUG}.`);
