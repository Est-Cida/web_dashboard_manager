const { Router } = require('express');
const pool = require('../../db');

const TABLE = '"WES_SubNational_DataEqualWeight"';
const EN    = `"FileLanguage" = 'English'`;
const router = Router();

router.get('/', async (req, res) => {
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

module.exports = router;
