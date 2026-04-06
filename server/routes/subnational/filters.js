const { Router } = require('express');
const pool = require('../../db');
const { fmtCountry } = require('../../helpers');

const TABLE = '"WES_SubNational_DataEqualWeight"';
const router = Router();

router.get('/', async (req, res) => {
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

module.exports = router;
