const { Router } = require('express');
const pool = require('../../db');
const { fmtCountry, SQL_COUNTRY, SQL_PROVINCE } = require('../../helpers');

const TABLE = '"WES_National_DataEqualWeight"';
const EN    = `"FileLanguage" = 'English'`;
const router = Router();

router.get('/', async (req, res) => {
  try {
    const { country, province, question } = req.query;
    const values  = [];
    let   idx     = 1;
    const clauses = [EN];

    if (question)                       { clauses.push(`"QuestionKey" = $${idx++}`);           values.push(question); }
    if (country  && country  !== 'All') { clauses.push(`${SQL_COUNTRY} = LOWER($${idx++})`);   values.push(country); }
    if (province && province !== 'All') { clauses.push(`${SQL_PROVINCE} = LOWER($${idx++})`);  values.push(province); }

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

router.get('/table', async (req, res) => {
  try {
    const { country, province, question } = req.query;
    const values  = [];
    let   idx     = 1;
    const clauses = [EN];

    if (question)                       { clauses.push(`"QuestionKey" = $${idx++}`);           values.push(question); }
    if (country  && country  !== 'All') { clauses.push(`${SQL_COUNTRY} = LOWER($${idx++})`);   values.push(country); }
    if (province && province !== 'All') { clauses.push(`${SQL_PROVINCE} = LOWER($${idx++})`);  values.push(province); }

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
