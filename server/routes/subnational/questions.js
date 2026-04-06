const { Router } = require('express');
const pool = require('../../db');
const { cmpQuestions } = require('../../helpers');

const TABLE = '"WES_SubNational_DataEqualWeight"';
const EN    = `"FileLanguage" = 'English'`;
const router = Router();

router.get('/', async (req, res) => {
  try {
    const { category } = req.query;
    const result = await pool.query(
      `SELECT DISTINCT "QuestionKey" AS "QuestionCode", "Question"
       FROM ${TABLE}
       WHERE ${EN} AND "CategoryCode" = $1
       ORDER BY "QuestionKey"`,
      [category]
    );
    res.json(result.rows.sort(cmpQuestions));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
