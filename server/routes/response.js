const { Router } = require('express');
const pool = require('../db');
const { TABLE, EN, fmtCountry } = require('../helpers');

const router = Router();

// GET /api/response — stacked bar chart data by country
router.get('/', async (req, res) => {
  try {
    const { country, province, question } = req.query;
    const values  = [];
    let   idx     = 1;
    const clauses = [EN];

    if (question)                       { clauses.push(`"QuestionKey" = $${idx++}`);    values.push(question); }
    if (country  && country  !== 'All') { clauses.push(`"AdminLevelName" = $${idx++}`); values.push(country); }
    if (province && province !== 'All') { clauses.push(`"Province" = $${idx++}`);       values.push(province); }

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

// GET /api/response-table — flat country/value table
router.get('/table', async (req, res) => {
  try {
    const { country, province, question } = req.query;
    const values  = [];
    let   idx     = 1;
    const clauses = [EN];

    if (question)                       { clauses.push(`"QuestionKey" = $${idx++}`);    values.push(question); }
    if (country  && country  !== 'All') { clauses.push(`"AdminLevelName" = $${idx++}`); values.push(country); }
    if (province && province !== 'All') { clauses.push(`"Province" = $${idx++}`);       values.push(province); }

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

module.exports = router;
