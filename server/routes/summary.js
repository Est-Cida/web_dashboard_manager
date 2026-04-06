const { Router } = require('express');
const pool = require('../db');
const { TABLE, EN, fmtCountry, cmpQuestions, SQL_COUNTRY, SQL_PROVINCE } = require('../helpers');

const router = Router();

router.get('/', async (req, res) => {
  try {
    const { country, province } = req.query;
    const values  = [];
    let   idx     = 1;
    const clauses = [EN];

    if (country  && country  !== 'All') { clauses.push(`${SQL_COUNTRY} = LOWER($${idx++})`);  values.push(country); }
    if (province && province !== 'All') { clauses.push(`${SQL_PROVINCE} = LOWER($${idx++})`); values.push(province); }

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
        categories[row.CategoryCode] = {
          code:      row.CategoryCode,
          label:     row.CategoryLabel,
          questions: {},
        };
      }
      const cat = categories[row.CategoryCode];
      if (!cat.questions[row.QuestionKey]) {
        cat.questions[row.QuestionKey] = { label: row.Question, responses: {} };
      }
      cat.questions[row.QuestionKey].responses[fmtCountry(row.country)] = row.value;
    }

    const countriesSet = new Set(result.rows.map((r) => fmtCountry(r.country)));

    res.json({
      countries:  [...countriesSet].sort(),
      categories: Object.values(categories).map((c) => ({
        code:      c.code,
        label:     c.label,
        questions: Object.values(c.questions).sort(cmpQuestions),
      })),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
