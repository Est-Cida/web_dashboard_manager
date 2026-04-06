const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'country_assessments_checklists',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '',
});

// WES_Laboratory_DataEqualWeight column reference:
//   "FileLanguage"     — 'English' | 'French' | 'Portuguese'
//   "CategoryCode"     — e.g. '01 - essns'
//   "CategoryLanguage" — e.g. '01 - ES Samples, Sampling and Sites'
//   "QuestionKey"      — e.g. 'essns_sample_method'
//   "Question"         — e.g. '1.01 - What is your sampling method?'
//   "AdminLevelName"   — country name
//   "Province"
//   "Value"

const TABLE = '"WES_Laboratory_DataEqualWeight"';
const EN    = `"FileLanguage" = 'English'`;   // English-only filter

// Format country name: underscores → spaces, each word capitalised
function fmtCountry(name) {
  if (!name) return name;
  return name.replace(/_/g, ' ').replace(/\w+/g, (w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase());
}

// ─── Routes ─────────────────────────────────────────────────────────────────

// GET /api/filters — distinct countries and provinces
app.get('/api/filters', async (req, res) => {
  try {
    const [countries, provinces] = await Promise.all([
      pool.query(`SELECT DISTINCT "AdminLevelName" AS country FROM ${TABLE} ORDER BY "AdminLevelName"`),
      pool.query(`SELECT DISTINCT "Province" AS province FROM ${TABLE} WHERE "Province" IS NOT NULL ORDER BY "Province"`),
    ]);
    res.json({
      countries: ['All', ...countries.rows.map((r) => fmtCountry(r.country))],
      provinces: ['All', ...provinces.rows.map((r) => fmtCountry(r.province))],
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// GET /api/categories — distinct categories, English labels only
app.get('/api/categories', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT DISTINCT "CategoryCode", "CategoryLanguage" AS "CategoryLabel"
       FROM ${TABLE}
       WHERE ${EN}
       ORDER BY "CategoryCode"`
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// GET /api/questions — distinct questions for a category, English labels only
app.get('/api/questions', async (req, res) => {
  try {
    const { category } = req.query;
    const result = await pool.query(
      `SELECT DISTINCT "QuestionKey" AS "QuestionCode", "Question"
       FROM ${TABLE}
       WHERE ${EN} AND "CategoryCode" = $1
       ORDER BY "QuestionKey"`,
      [category]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// GET /api/response — chart data: response by country for a question
app.get('/api/response', async (req, res) => {
  try {
    const { country, province, question } = req.query;
    const values = [];
    let idx = 1;
    const clauses = [`${EN}`];

    if (question)                      { clauses.push(`"QuestionKey" = $${idx++}`);      values.push(question); }
    if (country && country !== 'All')  { clauses.push(`"AdminLevelName" = $${idx++}`);   values.push(country); }
    if (province && province !== 'All'){ clauses.push(`"Province" = $${idx++}`);         values.push(province); }

    const result = await pool.query(
      `SELECT "AdminLevelName" AS country, "Value" AS value, COUNT(*) AS count
       FROM ${TABLE}
       WHERE ${clauses.join(' AND ')}
       GROUP BY "AdminLevelName", "Value"
       ORDER BY "AdminLevelName", "Value"`,
      values
    );

    const byCountry = {};
    for (const row of result.rows) {
      const c = fmtCountry(row.country);
      if (!byCountry[c]) byCountry[c] = { country: c };
      byCountry[c][row.value] = Number(row.count);
    }

    res.json(Object.values(byCountry));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// GET /api/response-table — question response table
app.get('/api/response-table', async (req, res) => {
  try {
    const { country, province, question } = req.query;
    const values = [];
    let idx = 1;
    const clauses = [`${EN}`];

    if (question)                      { clauses.push(`"QuestionKey" = $${idx++}`);      values.push(question); }
    if (country && country !== 'All')  { clauses.push(`"AdminLevelName" = $${idx++}`);   values.push(country); }
    if (province && province !== 'All'){ clauses.push(`"Province" = $${idx++}`);         values.push(province); }

    const result = await pool.query(
      `SELECT "AdminLevelName" AS country, "Value" AS value
       FROM ${TABLE}
       WHERE ${clauses.join(' AND ')}
       ORDER BY "AdminLevelName"`,
      values
    );
    res.json(result.rows.map((r) => ({ ...r, country: fmtCountry(r.country) })));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// GET /api/summary — summary matrix, English rows only (no duplicates)
app.get('/api/summary', async (req, res) => {
  try {
    const { country, province } = req.query;
    const values = [];
    let idx = 1;
    const clauses = [`${EN}`];

    if (country && country !== 'All')  { clauses.push(`"AdminLevelName" = $${idx++}`); values.push(country); }
    if (province && province !== 'All'){ clauses.push(`"Province" = $${idx++}`);        values.push(province); }

    const result = await pool.query(
      `SELECT "CategoryCode", "CategoryLanguage" AS "CategoryLabel",
              "QuestionKey", "Question",
              "AdminLevelName" AS country, "Value" AS value
       FROM ${TABLE}
       WHERE ${clauses.join(' AND ')}
       ORDER BY "CategoryCode", "QuestionKey", "AdminLevelName"`,
      values
    );

    const categories = {};
    for (const row of result.rows) {
      if (!categories[row.CategoryCode]) {
        categories[row.CategoryCode] = { code: row.CategoryCode, label: row.CategoryLabel, questions: {} };
      }
      const cat = categories[row.CategoryCode];
      if (!cat.questions[row.QuestionKey]) {
        cat.questions[row.QuestionKey] = { label: row.Question, responses: {} };
      }
      cat.questions[row.QuestionKey].responses[fmtCountry(row.country)] = row.value;
    }

    const countriesSet = new Set(result.rows.map((r) => fmtCountry(r.country)));

    res.json({
      countries: [...countriesSet].sort(),
      categories: Object.values(categories).map((c) => ({
        code: c.code,
        label: c.label,
        questions: Object.values(c.questions),
      })),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// ─── Start ───────────────────────────────────────────────────────────────────

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`WES API server running on port ${PORT}`));
