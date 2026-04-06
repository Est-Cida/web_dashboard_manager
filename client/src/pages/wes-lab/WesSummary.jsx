import { useState, useEffect } from 'react';
import FilterBar from '../../components/FilterBar.jsx';
import { getFilters, getSummary } from '../../lib/api.js';
import { MOCK_FILTERS, MOCK_SUMMARY } from '../../lib/mockData.js';
import styles from './WesSummary.module.css';

// Country color palette matching the screenshots
const COUNTRY_COLORS = {
  DRC:     { bg: '#2D3561', text: '#fff' },
  SENEGAL: { bg: '#C87DA8', text: '#fff' },
  Uganda:  { bg: '#6B3FA0', text: '#fff' },
};

function getCountryStyle(country, index) {
  if (COUNTRY_COLORS[country]) return COUNTRY_COLORS[country];
  const palettes = [
    { bg: '#009FDB', text: '#fff' },
    { bg: '#4CAF50', text: '#fff' },
    { bg: '#FF7043', text: '#fff' },
    { bg: '#00838F', text: '#fff' },
  ];
  return palettes[index % palettes.length];
}

export default function WesSummary() {
  const [filters, setFilters] = useState({ country: 'All', province: 'All' });
  const [filterOptions, setFilterOptions] = useState(MOCK_FILTERS);
  const [summary, setSummary] = useState(MOCK_SUMMARY);
  const [useMock, setUseMock] = useState(true);

  useEffect(() => {
    getFilters()
      .then(f => { setFilterOptions(f); setUseMock(false); })
      .catch(() => setUseMock(true));
  }, []);

  useEffect(() => {
    if (useMock) {
      // Filter mock data by country
      if (filters.country !== 'All') {
        const filtered = {
          countries: MOCK_SUMMARY.countries.filter(c => c === filters.country),
          categories: MOCK_SUMMARY.categories.map(cat => ({
            ...cat,
            questions: cat.questions.map(q => ({
              ...q,
              responses: Object.fromEntries(
                Object.entries(q.responses).filter(([c]) => c === filters.country)
              ),
            })),
          })),
        };
        setSummary(filtered);
      } else {
        setSummary(MOCK_SUMMARY);
      }
      return;
    }
    getSummary(filters)
      .then(setSummary)
      .catch(() => setSummary(MOCK_SUMMARY));
  }, [filters, useMock]);

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

      <div className={styles.scrollArea}>
        <div className={styles.pageHeader}>
          <h2 className={styles.pageTitle}>WES – Laboratory Assessment Summary</h2>
        </div>

        {summary.categories.map((cat) => (
          <section key={cat.code} className={styles.section}>
            {/* Category header */}
            <div className={styles.catHeader}>
              {cat.label}
            </div>

            {/* Country legend */}
            <div className={styles.legend}>
              {summary.countries.map((country, i) => (
                <div key={country} className={styles.legendItem}>
                  <span
                    className={styles.legendDot}
                    style={{ background: getCountryStyle(country, i).bg }}
                  />
                  {country}
                </div>
              ))}
            </div>

            {/* Matrix table */}
            <div className={styles.matrixWrap}>
              <table className={styles.matrix}>
                <tbody>
                  {cat.questions.map((q, qi) => (
                    <tr key={qi} className={styles.matrixRow}>
                      <td className={styles.qLabel}>
                        {q.label}
                      </td>
                      {summary.countries.map((country, ci) => {
                        const val = q.responses[country];
                        const style = getCountryStyle(country, ci);
                        return (
                          <td key={country} className={styles.valueCell}>
                            <div
                              className={styles.valuePill}
                              style={{
                                background: val && val !== 'n/a' && val !== '' ? style.bg : 'transparent',
                                color: val && val !== 'n/a' && val !== '' ? style.text : 'var(--gray-400)',
                                border: val && val !== 'n/a' && val !== '' ? 'none' : '1px solid var(--gray-200)',
                              }}
                            >
                              {val || 'n/a'}
                            </div>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
