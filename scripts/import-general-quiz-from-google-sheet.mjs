#!/usr/bin/env node
/**
 * Import `general-quiz` questions directly from a public Google Sheet tab (CSV via gviz).
 *
 * Usage:
 *   node scripts/import-general-quiz-from-google-sheet.mjs
 *
 * Optional env overrides:
 *   SHEET_ID=... SHEET_TAB="22.General"
 */

import fs from 'node:fs';
import path from 'node:path';
import https from 'node:https';

const ROOT = process.cwd();
const DATA_PATH = path.join(ROOT, 'src', 'data', 'decade_records.json');
const GENERAL_SLUG = 'general-quiz';

const SHEET_ID = process.env.SHEET_ID || '1-TBku6Xv1zEyDF6daWOljcHJPtuw9_Uw';
const SHEET_TAB = process.env.SHEET_TAB || '22.General';

function die(msg) {
  console.error(msg);
  process.exit(1);
}

function stripBom(s) {
  return s.charCodeAt(0) === 0xfeff ? s.slice(1) : s;
}

function fetchText(url) {
  return new Promise((resolve, reject) => {
    https
      .get(url, (res) => {
        if (!res.statusCode || res.statusCode < 200 || res.statusCode >= 300) {
          reject(new Error(`HTTP ${res.statusCode}`));
          res.resume();
          return;
        }
        res.setEncoding('utf8');
        let data = '';
        res.on('data', (chunk) => (data += chunk));
        res.on('end', () => resolve(data));
      })
      .on('error', reject);
  });
}

function parseCsv(text) {
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
    .replace(/\s+/g, ' ')
    .replace(/[()]/g, '')
    .replace(/\//g, ' ')
    .replace(/\[.*?\]/g, '')
    .replace(/\.+/g, ' ')
    .replace(/[^a-z0-9 ]+/g, '')
    .trim()
    .replace(/\s+/g, '_');
}

function indexHeader(header) {
  const keys = header.map((h) => normKey(h));
  const map = new Map();
  keys.forEach((k, i) => map.set(k, i));
  return { map, keys };
}

function val(row, map, key) {
  const idx = map.get(key);
  return idx == null ? '' : String(row[idx] ?? '').trim();
}

function findFirstKey(keys, tests) {
  for (const t of tests) {
    const hit = keys.find((k) => t(k));
    if (hit) return hit;
  }
  return null;
}

function parseAnswer(raw) {
  const v = String(raw || '').trim().toUpperCase();
  if (!v) return -1;
  if (v === 'A') return 0;
  if (v === 'B') return 1;
  if (v === 'C') return 2;
  if (v === 'D') return 3;
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

function pick4(row, map, keys) {
  const arr = keys.map((k) => val(row, map, k));
  return arr.every(Boolean) ? arr : [];
}

if (!fs.existsSync(DATA_PATH)) die(`Data not found: ${DATA_PATH}`);

const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(
  SHEET_TAB,
)}`;

const csvText = stripBom(await fetchText(url));
const rows = parseCsv(csvText).filter((r) => r.some((c) => String(c || '').trim().length));
if (rows.length < 2) die('Sheet CSV has no data rows.');

const header = rows[0];
const { map: headerMap, keys: headerKeys } = indexHeader(header);

const modules = JSON.parse(fs.readFileSync(DATA_PATH, 'utf8'));
const mod = modules.find((m) => m.slug === GENERAL_SLUG);
if (!mod) die(`Module not found in decade_records.json: ${GENERAL_SLUG}`);

// Match the sheet’s actual headers
const kQuestionEn =
  findFirstKey(headerKeys, [
    (k) => k === 'question_english',
    (k) => k.includes('question') && k.includes('english'),
  ]) || 'question_english';
const kQuestionMl =
  findFirstKey(headerKeys, [
    (k) => k === 'question_malayalam',
    (k) => k.includes('question') && (k.includes('malayalam') || k.includes('ml')),
  ]) || 'question_malayalam';

const kOptAEn =
  findFirstKey(headerKeys, [(k) => k.includes('option_a') && k.includes('english')]) ||
  'option_a_english';
const kOptBEn =
  findFirstKey(headerKeys, [(k) => k.includes('option_b') && k.includes('english')]) ||
  'option_b_english';
const kOptCEn =
  findFirstKey(headerKeys, [(k) => k.includes('option_c') && k.includes('english')]) ||
  'option_c_english';
const kOptDEn =
  findFirstKey(headerKeys, [(k) => k.includes('option_d') && k.includes('english')]) ||
  'option_d_english';

const kOptAMl =
  findFirstKey(headerKeys, [(k) => k.includes('option_a') && k.includes('malayalam')]) ||
  'option_a_malayalam';
const kOptBMl =
  findFirstKey(headerKeys, [(k) => k.includes('option_b') && k.includes('malayalam')]) ||
  'option_b_malayalam';
const kOptCMl =
  findFirstKey(headerKeys, [(k) => k.includes('option_c') && k.includes('malayalam')]) ||
  'option_c_malayalam';
const kOptDMl =
  findFirstKey(headerKeys, [(k) => k.includes('option_d') && k.includes('malayalam')]) ||
  'option_d_malayalam';

const kAns =
  findFirstKey(headerKeys, [
    (k) => k.startsWith('correct_answer') && k.includes('abcd'),
    (k) => k.startsWith('correct_answer') && (k.includes('a_b_c_d') || k.includes('abcd')),
    (k) => k.includes('correct_answer') && (k.includes('a_b_c_d') || k.includes('abcd')),
  ]) ||
  findFirstKey(headerKeys, [(k) => k.includes('correct') && k.includes('answer')]) ||
  'correct_answer';

const kKeralaStat =
  findFirstKey(headerKeys, [(k) => k.includes('kerala') && k.includes('stat')]) || 'kerala_stat_2026';
const kNational =
  findFirstKey(headerKeys, [(k) => k.includes('national') && (k.includes('avg') || k.includes('benchmark'))]) ||
  'national_avg_or_benchmark';
const kHistorical =
  findFirstKey(headerKeys, [(k) => k.includes('historical') && k.includes('benchmark')]) || 'historical_benchmark';
const kFlexEn =
  findFirstKey(headerKeys, [(k) => k.startsWith('flex_fact') && k.includes('english')]) ||
  findFirstKey(headerKeys, [(k) => k.includes('flex') && k.includes('english')]) ||
  'flex_fact_english';
const kFlexMl =
  findFirstKey(headerKeys, [(k) => k.startsWith('flex_fact') && k.includes('malayalam')]) ||
  findFirstKey(headerKeys, [(k) => k.includes('flex') && k.includes('malayalam')]) ||
  'flex_fact_malayalam';
const kSource =
  findFirstKey(headerKeys, [(k) => k.includes('source') && k.includes('reference')]) ||
  findFirstKey(headerKeys, [(k) => k.includes('source')]) ||
  'source_or_reference';

const questions = [];
for (let i = 1; i < rows.length; i++) {
  const r = rows[i];

  const qEn = val(r, headerMap, kQuestionEn);
  const qMl = val(r, headerMap, kQuestionMl);

  const optsEn = pick4(r, headerMap, [
    kOptAEn,
    kOptBEn,
    kOptCEn,
    kOptDEn,
  ]);
  const optsMl = pick4(r, headerMap, [
    kOptAMl,
    kOptBMl,
    kOptCMl,
    kOptDMl,
  ]);

  const ans = parseAnswer(val(r, headerMap, kAns));

  if (!qEn || optsEn.length !== 4 || ans < 0) continue;

  questions.push({
    id: questions.length + 1,
    question: qEn,
    question_ml: qMl || undefined,
    options: optsEn,
    options_ml: optsMl.length === 4 ? optsMl : undefined,
    answer: ans,
    kerala_stat_2026: val(r, headerMap, kKeralaStat) || '-',
    national_average: val(r, headerMap, kNational) || '-',
    historical_benchmark: val(r, headerMap, kHistorical) || '-',
    flex_fact: val(r, headerMap, kFlexEn) || '-',
    flex_fact_ml: val(r, headerMap, kFlexMl) || undefined,
    source: val(r, headerMap, kSource) || '-',
  });
}

if (!questions.length) {
  die('No valid questions parsed from sheet. Check if headers changed.');
}

mod.questions = questions;
fs.writeFileSync(DATA_PATH, JSON.stringify(modules, null, 2) + '\n');

console.log(`Imported ${questions.length} questions from sheet tab \"${SHEET_TAB}\" into ${GENERAL_SLUG}.`);
