import styles from './Landing.module.css';

const DASHBOARDS = [
  {
    id: 'wes-lab',
    title: 'Laboratory Wastewater Surveillance Assessment',
    subtitle: 'WES Management Support Team',
    description: 'Assess country wastewater surveillance situation for outbreak response. Data collected from WHO African Region Member States.',
    tags: ['Laboratory', 'Wastewater', 'Surveillance'],
    version: '2025v1',
    countries: 3,
    sites: 27,
    route: '/wes-lab',
    accent: '#009FDB',
  },
  {
    id: 'coming-soon-1',
    title: 'Epidemiological Surveillance Dashboard',
    subtitle: 'Disease Intelligence Unit',
    description: 'Track and analyse epidemiological trends across African Region Member States.',
    tags: ['Epidemiology', 'Surveillance'],
    version: 'Coming Soon',
    countries: null,
    sites: null,
    route: null,
    accent: '#6B3FA0',
  },
  {
    id: 'coming-soon-2',
    title: 'Vaccine Coverage & Cold Chain',
    subtitle: 'Immunization Programme',
    description: 'Monitor vaccination coverage rates and cold chain integrity across distribution networks.',
    tags: ['Vaccines', 'Cold Chain'],
    version: 'Coming Soon',
    countries: null,
    sites: null,
    route: null,
    accent: '#C87DA8',
  },
];

export default function Landing() {
  return (
    <div className={styles.page}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <div className={styles.logoRow}>
            <svg className={styles.whoLogo} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="24" cy="24" r="22" stroke="white" strokeWidth="2"/>
              <circle cx="24" cy="24" r="15" stroke="white" strokeWidth="1.2"/>
              <path d="M2 24h44M24 2v44" stroke="white" strokeWidth="1" opacity="0.5"/>
              <ellipse cx="24" cy="24" rx="9" ry="22" stroke="white" strokeWidth="1.2" opacity="0.7"/>
              <path d="M22 6 Q24 10 26 8 Q27 12 24 14 Q21 12 22 8 Q23 10 22 6z" fill="white"/>
              <path d="M23 14 Q24 24 25 24 Q24 34 24 42" stroke="white" strokeWidth="1.8" fill="none"/>
            </svg>
            <div>
              <div className={styles.orgName}>World Health Organization</div>
              <div className={styles.orgRegion}>African Region · Analytics & Dashboards</div>
            </div>
          </div>
        </div>
      </header>

      {/* Hero */}
      <div className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>Public Health<br />Intelligence Hub</h1>
          <p className={styles.heroSub}>
            Data-driven dashboards supporting outbreak response and health surveillance across the WHO African Region.
          </p>
        </div>
        <div className={styles.heroPattern} aria-hidden="true">
          {Array.from({ length: 64 }).map((_, i) => (
            <div key={i} className={styles.dot} />
          ))}
        </div>
      </div>

      {/* Dashboard cards */}
      <main className={styles.main}>
        <div className={styles.sectionLabel}>Available Dashboards</div>
        <div className={styles.grid}>
          {DASHBOARDS.map(dash => (
            <div
              key={dash.id}
              className={`${styles.card} ${!dash.route ? styles.disabled : ''}`}
              onClick={() => dash.route && window.open(dash.route, '_blank')}
              style={{ '--accent': dash.accent }}
            >
              <div className={styles.cardAccent} />
              <div className={styles.cardHeader}>
                <div className={styles.cardVersion}>{dash.version}</div>
                <div className={styles.cardTags}>
                  {dash.tags.map(t => <span key={t} className={styles.tag}>{t}</span>)}
                </div>
              </div>
              <h2 className={styles.cardTitle}>{dash.title}</h2>
              <p className={styles.cardSub}>{dash.subtitle}</p>
              <p className={styles.cardDesc}>{dash.description}</p>

              {dash.countries !== null && (
                <div className={styles.cardStats}>
                  <div className={styles.cardStat}>
                    <span className={styles.cardStatVal}>{dash.countries}</span>
                    <span className={styles.cardStatLabel}>Countries</span>
                  </div>
                  <div className={styles.cardStat}>
                    <span className={styles.cardStatVal}>{dash.sites}</span>
                    <span className={styles.cardStatLabel}>Sites</span>
                  </div>
                </div>
              )}

              <div className={styles.cardFooter}>
                {dash.route ? (
                  <span className={styles.openBtn}>Open Dashboard →</span>
                ) : (
                  <span className={styles.comingSoon}>Coming Soon</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </main>

      <footer className={styles.footer}>
        <p>© 2025 World Health Organization · African Region · Data subject to change</p>
      </footer>
    </div>
  );
}
