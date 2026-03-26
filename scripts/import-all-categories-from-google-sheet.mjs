#!/usr/bin/env node
/**
 * Import ALL category questions from the Google Sheet "Navakerala Quiz - Question Bank Review".
 *
 * Updates `src/data/decade_records.json`:
 * - module `general-quiz` from tab `22.General`
 * - modules 1..21 from tabs `N. <Module Title>` (exactly matches `src/data/decade_records.json` titles)
 *
 * Usage:
 *   DRY_RUN=1 node scripts/import-all-categories-from-google-sheet.mjs
 *   DRY_RUN=0 node scripts/import-all-categories-from-google-sheet.mjs
 *
 * Default: DRY_RUN=1
 */

import fs from 'node:fs';
import path from 'node:path';
import https from 'node:https';

const ROOT = process.cwd();
const DATA_PATH = path.join(ROOT, 'src', 'data', 'decade_records.json');

const SHEET_ID = process.env.SHEET_ID || '1-TBku6Xv1zEyDF6daWOljcHJPtuw9_Uw';
const GENERAL_TAB = process.env.GENERAL_TAB || '22.General';
const REVIEW_TAB = process.env.REVIEW_TAB || 'Navakerala Quiz - Question Bank Review';

const DRY_RUN = process.env.DRY_RUN !== '0';

const MODULES_ORDERED_BY_SHEET = [
  { slug: 'it-electronics', title: 'IT, Electronics & Communications', tabPrefix: 1 },
  { slug: 'planning-economy', title: 'Planning & Economic Affairs', tabPrefix: 2 },
  { slug: 'revenue-housing', title: 'Revenue & Housing', tabPrefix: 3 },
  { slug: 'water-resources', title: 'Water Resources', tabPrefix: 4 },
  { slug: 'electricity-power', title: 'Electricity & Renewable Energy', tabPrefix: 5 },
  { slug: 'forest-wildlife', title: 'Forests & Wildlife Protection', tabPrefix: 6 },
  { slug: 'sports-registration', title: 'Sports & Registration', tabPrefix: 7 },
  { slug: 'transport', title: 'Transport', tabPrefix: 8 },
  { slug: 'food-civil-supplies', title: 'Food & Civil Supplies', tabPrefix: 9 },
  { slug: 'finance', title: 'Finance Department', tabPrefix: 10 },
  { slug: 'higher-education-social-justice', title: 'Higher Education & Social Justice', tabPrefix: 11 },
  { slug: 'animal-husbandry', title: 'Animal Husbandry & Dairy', tabPrefix: 12 },
  { slug: 'lsgd', title: 'Local Self Government', tabPrefix: 13 },
  { slug: 'public-works-tourism', title: 'Public Works & Tourism', tabPrefix: 14 },
  { slug: 'agriculture', title: 'Agriculture', tabPrefix: 15 },
  { slug: 'sc-st-welfare', title: 'SC/ST & Backward Class Welfare', tabPrefix: 16 },
  { slug: 'law-industries', title: 'Law & Industries', tabPrefix: 17 },
  { slug: 'general-education', title: 'General Education & Labour', tabPrefix: 18 },
  { slug: 'cooperation-ports', title: 'Co-operation, Ports & Devaswoms', tabPrefix: 19 },
  { slug: 'health-family-welfare', title: 'Health, Women & Child Welfare', tabPrefix: 20 },
  { slug: 'fisheries-culture', title: 'Fisheries, Culture & Youth', tabPrefix: 21 },
];

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
  const keys = header.map(normKey);
  const map = new Map();
  keys.forEach((k, i) => map.set(k, i));
  return { keys, map };
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

function makeTabName(prefix, title) {
  return `${prefix}. ${title}`;
}

async function loadSheetTabsByModuleEnglishFromReviewSheet() {
  const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(
    REVIEW_TAB,
  )}`;
  const csvText = stripBom(await fetchText(url));
  const parsedRows = parseCsv(csvText).filter((r) => r.some((c) => String(c || '').trim().length));

  const headerRowIndex = parsedRows.findIndex((r) =>
    r.some((c) => String(c).toLowerCase().includes('module') && String(c).toLowerCase().includes('english')),
  );
  if (headerRowIndex < 0) throw new Error(`Could not find review sheet header row: ${REVIEW_TAB}`);

  const header = parsedRows[headerRowIndex];
  const { keys: headerKeys, map: headerMap } = indexHeader(header);

  const kModuleEnglish =
    findFirstKey(headerKeys, [(k) => k === 'module_english', (k) => k.includes('module') && k.includes('english')]) ||
    'module_english';
  const kSheetTab =
    findFirstKey(headerKeys, [(k) => k === 'sheet_tab', (k) => k.includes('sheet') && k.includes('tab')]) || 'sheet_tab';

  const byTitle = new Map();
  for (let i = headerRowIndex + 1; i < parsedRows.length; i++) {
    const r = parsedRows[i];
    const moduleEnglish = val(r, headerMap, kModuleEnglish);
    const sheetTab = val(r, headerMap, kSheetTab);
    if (moduleEnglish && sheetTab) byTitle.set(moduleEnglish, sheetTab);
  }
  return byTitle;
}

async function importSheetIntoModule(modules, slug, sheetTabName) {
  const modulesCopy = modules;
  const mod = modulesCopy.find((m) => m.slug === slug);
  if (!mod) throw new Error(`Module not found: ${slug}`);

  const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(
    sheetTabName,
  )}`;

  const csvText = stripBom(await fetchText(url));
  const parsedRows = parseCsv(csvText).filter((r) => r.some((c) => String(c || '').trim().length));

  // Some tabs include a "summary row" before the real header; detect the first header that contains "Question"
  const headerRowIndex = parsedRows.findIndex((r) => r.some((c) => String(c).toLowerCase().includes('question')));
  if (headerRowIndex < 0) {
    throw new Error(`Could not find header row for ${slug} (${sheetTabName}).`);
  }
  const header = parsedRows[headerRowIndex];
  const { keys: headerKeys, map: headerMap } = indexHeader(header);

  const kQuestionEn =
    findFirstKey(headerKeys, [
      (k) => k.includes('question') && k.includes('english'),
      (k) => k === 'question_english',
    ]) || 'question_english';
  const kQuestionMl =
    findFirstKey(headerKeys, [
      (k) => k.includes('question') && (k.includes('malayalam') || k.includes('ml')),
      (k) => k === 'question_malayalam',
    ]) || 'question_malayalam';

  const kOptAEn =
    findFirstKey(headerKeys, [(k) => k.includes('option_a') && k.includes('english')]) || 'option_a_english';
  const kOptBEn =
    findFirstKey(headerKeys, [(k) => k.includes('option_b') && k.includes('english')]) || 'option_b_english';
  const kOptCEn =
    findFirstKey(headerKeys, [(k) => k.includes('option_c') && k.includes('english')]) || 'option_c_english';
  const kOptDEn =
    findFirstKey(headerKeys, [(k) => k.includes('option_d') && k.includes('english')]) || 'option_d_english';

  const kOptAMl =
    findFirstKey(headerKeys, [(k) => k.includes('option_a') && k.includes('malayalam')]) || 'option_a_malayalam';
  const kOptBMl =
    findFirstKey(headerKeys, [(k) => k.includes('option_b') && k.includes('malayalam')]) || 'option_b_malayalam';
  const kOptCMl =
    findFirstKey(headerKeys, [(k) => k.includes('option_c') && k.includes('malayalam')]) || 'option_c_malayalam';
  const kOptDMl =
    findFirstKey(headerKeys, [(k) => k.includes('option_d') && k.includes('malayalam')]) || 'option_d_malayalam';

  const kAns =
    findFirstKey(headerKeys, [(k) => k.includes('correct_answer')]) || 'correct_answer';

  const kKeralaStat =
    findFirstKey(headerKeys, [(k) => k.includes('kerala') && k.includes('stat')]) || 'kerala_stat_2026';
  const kNational =
    findFirstKey(headerKeys, [(k) => k.includes('national') && (k.includes('avg') || k.includes('benchmark'))]) ||
    'national_avg_or_benchmark';
  const kHistorical =
    findFirstKey(headerKeys, [(k) => k.includes('historical') && k.includes('benchmark')]) || 'historical_benchmark';
  const kFlexEn =
    findFirstKey(headerKeys, [(k) => k.includes('flex_fact') && k.includes('english')]) || 'flex_fact_english';
  const kFlexMl =
    findFirstKey(headerKeys, [(k) => k.includes('flex_fact') && (k.includes('malayalam') || k.includes('ml'))]) ||
    'flex_fact_malayalam';
  const kSource =
    findFirstKey(headerKeys, [(k) => k.includes('source') || k.includes('reference')]) || 'source_or_reference';

  const questions = [];
  let skipped = { noQuestion: 0, badOptions: 0, badAnswer: 0 };

  for (let i = headerRowIndex + 1; i < parsedRows.length; i++) {
    const r = parsedRows[i];

    const qEn = val(r, headerMap, kQuestionEn) || val(r, headerMap, 'question');
    const qMl = val(r, headerMap, kQuestionMl);

    const optsEn = pick4(r, headerMap, [kOptAEn, kOptBEn, kOptCEn, kOptDEn]);
    const optsMl = pick4(r, headerMap, [kOptAMl, kOptBMl, kOptCMl, kOptDMl]);

    const ans = parseAnswer(val(r, headerMap, kAns));

    if (!qEn) {
      skipped.noQuestion += 1;
      continue;
    }
    if (optsEn.length !== 4) {
      skipped.badOptions += 1;
      continue;
    }
    if (ans < 0) {
      skipped.badAnswer += 1;
      continue;
    }

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

  return { slug, sheetTabName, imported: questions.length, skipped };
}

async function main() {
  if (!fs.existsSync(DATA_PATH)) die(`Data not found: ${DATA_PATH}`);

  const modules = JSON.parse(fs.readFileSync(DATA_PATH, 'utf8'));
  const results = [];

  const generalRes = await importSheetIntoModule(modules, 'general-quiz', GENERAL_TAB);
  results.push(generalRes);

  const reviewTabsByTitle = await loadSheetTabsByModuleEnglishFromReviewSheet();
  for (const m of MODULES_ORDERED_BY_SHEET) {
    const sheetTabName = reviewTabsByTitle.get(m.title);
    if (!sheetTabName) throw new Error(`No Sheet Tab mapping found in review sheet for module title: "${m.title}" (slug: ${m.slug})`);
    const res = await importSheetIntoModule(modules, m.slug, sheetTabName);
    results.push(res);
  }

  const jsonSummary = results.map((r) => ({
    slug: r.slug,
    imported: r.imported,
    skipped: r.skipped,
  }));

  console.log(JSON.stringify(jsonSummary, null, 2));

  if (DRY_RUN) {
    console.log(`DRY_RUN=1 => not writing changes to ${DATA_PATH}`);
    return;
  }

  fs.writeFileSync(DATA_PATH, JSON.stringify(modules, null, 2) + '\n');
  console.log(`Wrote updated questions into ${DATA_PATH}`);
}

await main();

