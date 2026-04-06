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

// ─── Helpers ────────────────────────────────────────────────────────────────

function buildWhere(filters) {
  const clauses = [];
  const values = [];
  let i = 1;
  if (filters.country && filters.country !== 'All') {
    clauses.push(`country = $${i++}`);
    values.push(filters.country);
  }
  if (filters.province && filters.province !== 'All') {
    clauses.push(`province = $${i++}`);
    values.push(filters.province);
  }
  if (filters.category) {
    clauses.push(`"CategoryCode" = $${i++}`);
    values.push(filters.category);
  }
  return {
    where: clauses.length ? 'WHERE ' + clauses.join(' AND ') : '',
    values,
  };
}

// ─── Routes ─────────────────────────────────────────────────────────────────

// GET /api/filters — distinct countries and provinces
app.get('/api/filters', async (req, res) => {
  try {
    const countries = await pool.query(
      'SELECT DISTINCT country FROM WES_Laboratory_DataEqualWeight ORDER BY country'
    );
    const provinces = await pool.query(
      'SELECT DISTINCT province FROM WES_Laboratory_DataEqualWeight WHERE province IS NOT NULL ORDER BY province'
    );
    res.json({
      countries: ['All', ...countries.rows.map((r) => r.country)],
      provinces: ['All', ...provinces.rows.map((r) => r.province)],
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// GET /api/categories — distinct categories
app.get('/api/categories', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT DISTINCT "CategoryCode", "CategoryLabel"
       FROM WES_Laboratory_DataEqualWeight
       ORDER BY "CategoryCode"`
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// GET /api/questions — sub-category questions for a category
app.get('/api/questions', async (req, res) => {
  try {
    const { category } = req.query;
    const result = await pool.query(
      `SELECT DISTINCT "QuestionCode", "Question"
       FROM WES_Laboratory_DataEqualWeight
       WHERE "CategoryCode" = $1
       ORDER BY "QuestionCode"`,
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
    let baseWhere = question ? `WHERE "QuestionCode" = $1` : 'WHERE 1=1';
    const baseValues = question ? [question] : [];
    let idx = baseValues.length + 1;

    if (country && country !== 'All') {
      baseWhere += ` AND country = $${idx++}`;
      baseValues.push(country);
    }
    if (province && province !== 'All') {
      baseWhere += ` AND province = $${idx++}`;
      baseValues.push(province);
    }

    const result = await pool.query(
      `SELECT country, "Value" as value, COUNT(*) as count
       FROM WES_Laboratory_DataEqualWeight
       ${baseWhere}
       GROUP BY country, "Value"
       ORDER BY country, "Value"`,
      baseValues
    );

    // Transform to recharts stacked bar format: [{country, value1: n, value2: n}]
    const byCountry = {};
    for (const row of result.rows) {
      if (!byCountry[row.country]) byCountry[row.country] = { country: row.country };
      byCountry[row.country][row.value] = Number(row.count);
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
    let baseWhere = question ? `WHERE "QuestionCode" = $1` : 'WHERE 1=1';
    const baseValues = question ? [question] : [];
    let idx = baseValues.length + 1;

    if (country && country !== 'All') {
      baseWhere += ` AND country = $${idx++}`;
      baseValues.push(country);
    }
    if (province && province !== 'All') {
      baseWhere += ` AND province = $${idx++}`;
      baseValues.push(province);
    }

    const result = await pool.query(
      `SELECT country, "Value" as value
       FROM WES_Laboratory_DataEqualWeight
       ${baseWhere}
       ORDER BY country`,
      baseValues
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// GET /api/summary — full summary matrix by category
app.get('/api/summary', async (req, res) => {
  try {
    const { country, province } = req.query;
    let baseWhere = 'WHERE 1=1';
    const baseValues = [];
    let idx = 1;

    if (country && country !== 'All') {
      baseWhere += ` AND country = $${idx++}`;
      baseValues.push(country);
    }
    if (province && province !== 'All') {
      baseWhere += ` AND province = $${idx++}`;
      baseValues.push(province);
    }

    // Get all questions with their answers per country
    const result = await pool.query(
      `SELECT "CategoryCode", "CategoryLabel", "QuestionCode", "Question",
              country, "Value" as value
       FROM WES_Laboratory_DataEqualWeight
       ${baseWhere}
       ORDER BY "CategoryCode", "QuestionCode", country`,
      baseValues
    );

    // Group: category -> questions -> country values
    const categories = {};
    for (const row of result.rows) {
      if (!categories[row.CategoryCode]) {
        categories[row.CategoryCode] = {
          code: row.CategoryCode,
          label: row.CategoryLabel,
          questions: {},
        };
      }
      const cat = categories[row.CategoryCode];
      if (!cat.questions[row.QuestionCode]) {
        cat.questions[row.QuestionCode] = {
          code: row.QuestionCode,
          label: row.Question,
          responses: {},
        };
      }
      cat.questions[row.QuestionCode].responses[row.country] = row.value;
    }

    // Collect unique countries
    const countriesSet = new Set(result.rows.map((r) => r.country));

    res.json({
      countries: [...countriesSet].sort(),
      categories: Object.values(categories).map((c) => ({
        ...c,
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
