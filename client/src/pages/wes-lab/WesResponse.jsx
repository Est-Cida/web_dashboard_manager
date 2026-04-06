import { useState, useEffect } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, Cell, LabelList
} from 'recharts';
import FilterBar from '../../components/FilterBar.jsx';
import { getFilters, getCategories, getQuestions, getResponse, getResponseTable } from '../../lib/api.js';
import {
  MOCK_FILTERS, MOCK_CATEGORIES, MOCK_QUESTIONS, MOCK_RESPONSE_CHART, MOCK_SUMMARY
} from '../../lib/mockData.js';
import styles from './WesResponse.module.css';

// Color palette for response values
const VALUE_COLORS = [
  '#2D3561', '#C87DA8', '#6B3FA0', '#009FDB', '#F6A623',
  '#4CAF50', '#E53935', '#00838F', '#FF7043', '#8D6E63'
];

function getColor(index) {
  return VALUE_COLORS[index % VALUE_COLORS.length];
}

export default function WesResponse() {
  const [filters, setFilters] = useState({ country: 'All', province: 'All' });
  const [filterOptions, setFilterOptions] = useState(MOCK_FILTERS);
  const [categories, setCategories] = useState(MOCK_CATEGORIES);
  const [selectedCat, setSelectedCat] = useState(MOCK_CATEGORIES[0].CategoryCode);
  const [questions, setQuestions] = useState(MOCK_QUESTIONS[MOCK_CATEGORIES[0].CategoryCode] || []);
  const [selectedQ, setSelectedQ] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [valueKeys, setValueKeys] = useState([]);
  const [useMock, setUseMock] = useState(true);

  // Load filter options & categories on mount
  useEffect(() => {
    Promise.all([getFilters(), getCategories()])
      .then(([f, c]) => {
        setFilterOptions(f);
        setCategories(c);
        if (c.length) setSelectedCat(c[0].CategoryCode);
        setUseMock(false);
      })
      .catch(() => setUseMock(true));
  }, []);

  // Load questions when category changes
  useEffect(() => {
    if (!selectedCat) return;
    if (useMock) {
      const qs = MOCK_QUESTIONS[selectedCat] || [];
      setQuestions(qs);
      setSelectedQ(qs[0]?.QuestionCode || null);
      return;
    }
    getQuestions(selectedCat)
      .then(qs => {
        setQuestions(qs);
        setSelectedQ(qs[0]?.QuestionCode || null);
      })
      .catch(() => {
        const qs = MOCK_QUESTIONS[selectedCat] || [];
        setQuestions(qs);
        setSelectedQ(qs[0]?.QuestionCode || null);
      });
  }, [selectedCat, useMock]);

  // Load chart & table data when question or filters change
  useEffect(() => {
    if (!selectedQ) return;
    const params = { ...filters, question: selectedQ };

    if (useMock) {
      const data = MOCK_RESPONSE_CHART[selectedQ] || buildMockChart(selectedQ);
      setChartData(data);
      const keys = new Set();
      data.forEach(row => Object.keys(row).filter(k => k !== 'country').forEach(k => keys.add(k)));
      setValueKeys([...keys]);

      // table from summary mock
      const allCats = MOCK_SUMMARY.categories;
      let rows = [];
      for (const cat of allCats) {
        const q = cat.questions.find(q => q.code === selectedQ);
        if (q) {
          rows = Object.entries(q.responses).map(([country, value]) => ({ country, value }));
          break;
        }
      }
      setTableData(rows);
      return;
    }

    Promise.all([getResponse(params), getResponseTable(params)])
      .then(([chart, table]) => {
        setChartData(chart);
        const keys = new Set();
        chart.forEach(row => Object.keys(row).filter(k => k !== 'country').forEach(k => keys.add(k)));
        setValueKeys([...keys]);
        setTableData(table);
      })
      .catch(() => {});
  }, [selectedQ, filters, useMock]);

  function buildMockChart(qCode) {
    const allCats = MOCK_SUMMARY.categories;
    const byCountry = {};
    for (const cat of allCats) {
      const q = cat.questions.find(q => q.code === qCode);
      if (q) {
        Object.entries(q.responses).forEach(([country, value]) => {
          if (!byCountry[country]) byCountry[country] = { country };
          byCountry[country][value] = (byCountry[country][value] || 0) + 1;
        });
        break;
      }
    }
    return Object.values(byCountry);
  }

  const currentQuestion = questions.find(q => q.QuestionCode === selectedQ);

  return (
    <div className={styles.page}>
      {/* Top filter bar */}
      <FilterBar
        filters={[
          { key: 'country',  label: 'Country',  options: filterOptions.countries },
          { key: 'province', label: 'Province', options: filterOptions.provinces },
        ]}
        values={filters}
        onChange={(key, val) => setFilters(prev => ({ ...prev, [key]: val }))}
      />

      <div className={styles.body}>
        {/* Left panel */}
        <aside className={styles.sidebar}>
          <div className={styles.sideSection}>
            <div className={styles.sideSectionTitle}>Category Questions</div>
            <div className={styles.radioList}>
              {categories.map(cat => (
                <label key={cat.CategoryCode} className={styles.radioRow}>
                  <input
                    type="radio"
                    name="category"
                    checked={selectedCat === cat.CategoryCode}
                    onChange={() => setSelectedCat(cat.CategoryCode)}
                  />
                  <span>{cat.CategoryLabel || cat.CategoryCode}</span>
                </label>
              ))}
            </div>
          </div>

          <div className={styles.sideSection}>
            <div className={styles.sideSectionTitle}>Sub-Category Questions</div>
            <div className={styles.radioList}>
              {questions.map(q => (
                <label key={q.QuestionCode} className={styles.radioRow}>
                  <input
                    type="radio"
                    name="question"
                    checked={selectedQ === q.QuestionCode}
                    onChange={() => setSelectedQ(q.QuestionCode)}
                  />
                  <span>{q.QuestionCode} – {q.Question}</span>
                </label>
              ))}
            </div>
          </div>
        </aside>

        {/* Right panel */}
        <div className={styles.content}>
          {/* Chart card */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>Response by Country</div>
            <div className={styles.cardBody}>
              {chartData.length === 0 ? (
                <div className={styles.empty}>No data for selected filters.</div>
              ) : (
                <ResponsiveContainer width="100%" height={320}>
                  <BarChart data={chartData} margin={{ top: 16, right: 32, left: 0, bottom: 8 }}>
                    <XAxis
                      dataKey="country"
                      tick={{ fontFamily: 'Barlow', fontSize: 13, fontWeight: 600 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis hide />
                    <Tooltip
                      contentStyle={{ fontFamily: 'Barlow', fontSize: 13, borderRadius: 6, border: '1px solid var(--gray-200)' }}
                    />
                    <Legend
                      wrapperStyle={{ fontFamily: 'Barlow', fontSize: 12, paddingTop: 8 }}
                      formatter={(val) => <span style={{ color: 'var(--gray-700)' }}>{val}</span>}
                    />
                    {valueKeys.map((key, i) => (
                      <Bar key={key} dataKey={key} stackId="a" fill={getColor(i)} radius={i === valueKeys.length - 1 ? [4, 4, 0, 0] : [0, 0, 0, 0]}>
                        <LabelList dataKey={key} position="center" style={{ fill: 'white', fontSize: 12, fontWeight: 600, fontFamily: 'Barlow' }} />
                      </Bar>
                    ))}
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          {/* Table card */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>Question Response</div>
            <div className={styles.cardBody}>
              {tableData.length === 0 ? (
                <div className={styles.empty}>No data for selected filters.</div>
              ) : (
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Country</th>
                      <th>{selectedQ} – {currentQuestion?.Question}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tableData.map((row, i) => (
                      <tr key={i}>
                        <td className={styles.countryCell}>{row.country}</td>
                        <td>{row.value || '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
