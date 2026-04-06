import styles from './FilterBar.module.css';

export default function FilterBar({ filters, values, onChange }) {
  return (
    <div className={styles.bar}>
      {filters.map(({ key, label, options }) => (
        <div className={styles.filter} key={key}>
          <label className={styles.label}>{label}</label>
          <select
            className={styles.select}
            value={values[key] || 'All'}
            onChange={e => onChange(key, e.target.value)}
          >
            {options.map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div>
      ))}
    </div>
  );
}
