import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, LabelList } from 'recharts';
import FilterBar from '../../components/FilterBar.jsx';
import { getSubFilters, getSubCategories, getSubQuestions, getSubResponse, getSubResponseTable } from '../../lib/api.js';
import { getValueColor } from '../../constants/colors.js';
import styles from './WesSubNationalResponse.module.css';

export default function WesSubNationalResponse() {
  const [filters, setFilters]             = useState({ country: 'All', province: 'All' });
  const [filterOptions, setFilterOptions] = useState({ countries: ['All'], provinces: ['All'] });
  const [categories, setCategories]       = useState([]);
  const [selectedCat, setSelectedCat]     = useState(null);
  const [questions, setQuestions]         = useState([]);
  const [selectedQ, setSelectedQ]         = useState(null);
  const [chartData, setChartData]         = useState([]);
  const [tableData, setTableData]         = useState([]);
  const [valueKeys, setValueKeys]         = useState([]);

  useEffect(() => {
    Promise.all([getSubFilters(), getSubCategories()])
      .then(([f, c]) => {
        setFilterOptions(f);
        setCategories(c);
        if (c.length) setSelectedCat(c[0].CategoryCode);
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (!selectedCat) return;
    getSubQuestions(selectedCat)
      .then(qs => {
        setQuestions(qs);
        setSelectedQ(qs[0]?.QuestionCode || null);
      })
      .catch(console.error);
  }, [selectedCat]);

  useEffect(() => {
    if (!selectedQ) return;
    const params = { ...filters, question: selectedQ };
    Promise.all([getSubResponse(params), getSubResponseTable(params)])
      .then(([chart, table]) => {
        setChartData(chart);
        const keys = new Set();
        chart.forEach(row => Object.keys(row).filter(k => k !== 'country').forEach(k => keys.add(k)));
        setValueKeys([...keys]);
        setTableData(table);
      })
      .catch(console.error);
  }, [selectedQ, filters]);

  const currentQuestion = questions.find(q => q.QuestionCode === selectedQ);

  return (
    <div className={styles.page}>
      <FilterBar
        filters={[
          { key: 'country',  label: 'Country',  options: filterOptions.countries },
          { key: 'province', label: 'Province', options: filterOptions.provinces },
        ]}
        values={filters}
        onChange={(key, val) => setFilters(prev => ({ ...prev, [key]: val }))}
      />

      <div className={styles.body}>
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
                  <span>{q.Question}</span>
                </label>
              ))}
            </div>
          </div>
        </aside>

        <div className={styles.content}>
          <div className={styles.card}>
            <div className={styles.cardHeader}>Response by Country</div>
            <div className={styles.cardBody}>
              {chartData.length === 0 ? (
                <div className={styles.empty}>No data for selected filters.</div>
              ) : (
                <ResponsiveContainer width="100%" height={320}>
                  <BarChart data={chartData} margin={{ top: 16, right: 32, left: 0, bottom: 8 }}>
                    <XAxis dataKey="country" tick={{ fontFamily: 'Barlow', fontSize: 13, fontWeight: 600 }} axisLine={false} tickLine={false} />
                    <YAxis hide />
                    <Tooltip contentStyle={{ fontFamily: 'Barlow', fontSize: 13, borderRadius: 6, border: '1px solid var(--gray-200)' }} />
                    <Legend wrapperStyle={{ fontFamily: 'Barlow', fontSize: 12, paddingTop: 8 }} formatter={(val) => <span style={{ color: 'var(--gray-700)' }}>{val}</span>} />
                    {valueKeys.map((key, i) => (
                      <Bar key={key} dataKey={key} stackId="a" fill={getValueColor(i)} radius={i === valueKeys.length - 1 ? [4, 4, 0, 0] : [0, 0, 0, 0]}>
                        <LabelList dataKey={key} position="center" style={{ fill: 'white', fontSize: 12, fontWeight: 600, fontFamily: 'Barlow' }} />
                      </Bar>
                    ))}
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

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
                      <th>{currentQuestion?.Question}</th>
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
