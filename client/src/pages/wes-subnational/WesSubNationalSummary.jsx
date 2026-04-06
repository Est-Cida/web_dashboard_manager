import { useState, useEffect } from 'react';
import FilterBar from '../../components/FilterBar.jsx';
import { getSubFilters, getSubSummary } from '../../lib/api.js';
import { getCountryStyle } from '../../constants/colors.js';
import styles from './WesSubNationalSummary.module.css';

export default function WesSubNationalSummary() {
  const [filters, setFilters]             = useState({ country: 'All', province: 'All' });
  const [filterOptions, setFilterOptions] = useState({ countries: ['All'], provinces: ['All'] });
  const [summary, setSummary]             = useState({ countries: [], categories: [] });

  useEffect(() => {
    getSubFilters()
      .then(f => setFilterOptions(f))
      .catch(console.error);
  }, []);

  useEffect(() => {
    getSubSummary(filters)
      .then(setSummary)
      .catch(console.error);
  }, [filters]);

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
          <h2 className={styles.pageTitle}>WES – Sub-National Assessment Summary</h2>
        </div>

        {summary.categories.map((cat) => (
          <section key={cat.code} className={styles.section}>
            <div className={styles.catHeader}>{cat.label}</div>

            <div className={styles.legend}>
              {summary.countries.map((country, i) => (
                <div key={country} className={styles.legendItem}>
                  <span className={styles.legendDot} style={{ background: getCountryStyle(country, i).bg }} />
                  {country}
                </div>
              ))}
            </div>

            <div className={styles.matrixWrap}>
              <table className={styles.matrix}>
                <tbody>
                  {cat.questions.map((q, qi) => (
                    <tr key={qi} className={styles.matrixRow}>
                      <td className={styles.qLabel}>{q.label}</td>
                      {summary.countries.map((country, ci) => {
                        const val   = q.responses[country];
                        const style = getCountryStyle(country, ci);
                        return (
                          <td key={country} className={styles.valueCell}>
                            <div
                              className={styles.valuePill}
                              style={{
                                background: val && val !== 'n/a' && val !== '' ? style.bg : 'transparent',
                                color:      val && val !== 'n/a' && val !== '' ? style.text : 'var(--gray-400)',
                                border:     val && val !== 'n/a' && val !== '' ? 'none' : '1px solid var(--gray-200)',
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
