import styles from './WesNationalHome.module.css';

export default function WesNationalHome() {
  return (
    <div className={styles.page}>
      <div className={styles.hero}>
        <div className={styles.heroOverlay} />
        <div className={styles.heroContent}>
          <div className={styles.badge}>2025v1</div>
          <h1 className={styles.title}>
            National Wastewater<br />Surveillance Assessment
          </h1>
          <p className={styles.subtitle}>WES Management Support Team</p>
          <div className={styles.divider} />
          <p className={styles.body}>
            The purpose of this exercise is to assess country wastewater situation for outbreak response.
          </p>
          <p className={styles.body}>
            The data presented on this dashboard are collected from WHO Member States in the African Region.
            Data are subject to change and are presented as they are reported by the Member States.
          </p>
        </div>

        <div className={styles.logoWrap}>
          <svg className={styles.whoLogo} viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="60" cy="60" r="55" stroke="white" strokeWidth="3"/>
            <circle cx="60" cy="60" r="38" stroke="white" strokeWidth="2"/>
            <path d="M5 60h110M60 5v110" stroke="white" strokeWidth="1.5" opacity="0.5"/>
            <ellipse cx="60" cy="60" rx="22" ry="55" stroke="white" strokeWidth="1.5" opacity="0.7"/>
            <path d="M60 5 Q78 30 78 60 Q78 90 60 115" stroke="white" strokeWidth="2" fill="none"/>
            <path d="M60 5 Q42 30 42 60 Q42 90 60 115" stroke="white" strokeWidth="2" fill="none"/>
            <path d="M55 15 Q60 20 65 18 Q68 25 60 28 Q52 25 55 18 Q57 20 55 15z" fill="white"/>
            <path d="M58 28 Q60 60 62 60 Q60 92 60 100" stroke="white" strokeWidth="2" fill="none"/>
          </svg>
          <div className={styles.orgName}>World Health Organization</div>
          <div className={styles.orgRegion}>African Region</div>
        </div>
      </div>

      <div className={styles.statsRow}>
        {[
          { value: '3',  label: 'Member States' },
          { value: '7',  label: 'Assessment Categories' },
          { value: '50', label: 'Questions' },
          { value: '2025', label: 'Data Period' },
        ].map(stat => (
          <div className={styles.stat} key={stat.label}>
            <span className={styles.statValue}>{stat.value}</span>
            <span className={styles.statLabel}>{stat.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
