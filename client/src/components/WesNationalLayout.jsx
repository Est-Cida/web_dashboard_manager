import { Link, useLocation } from 'react-router-dom';
import styles from './WesLayout.module.css';

const NAV_ITEMS = [
  { label: 'Home',     to: '/wes-national' },
  { label: 'Response', to: '/wes-national/response' },
  { label: 'Summary',  to: '/wes-national/summary' },
];

export default function WesNationalLayout({ children }) {
  const { pathname } = useLocation();

  return (
    <div className={styles.root}>
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <svg className={styles.whoLogo} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="24" cy="24" r="23" stroke="white" strokeWidth="1.5"/>
            <path d="M24 4C13 4 4 13 4 24s9 20 20 20 20-9 20-20S35 4 24 4z" fill="none" stroke="white" strokeWidth="1"/>
            <path d="M4 24h40M24 4v40M8 12h32M8 36h32" stroke="white" strokeWidth="0.8" opacity="0.6"/>
            <path d="M24 10 Q30 18 24 24 Q18 30 24 38" stroke="white" strokeWidth="1.5" fill="none"/>
            <path d="M18 12 Q24 16 24 24 Q24 32 30 36" stroke="white" strokeWidth="0.8" fill="none" opacity="0.7"/>
          </svg>
          <div className={styles.orgText}>
            <span className={styles.orgName}>World Health Organization</span>
            <span className={styles.orgRegion}>African Region</span>
          </div>
        </div>

        <nav className={styles.nav}>
          {NAV_ITEMS.map(item => {
            const active = pathname === item.to || (item.to !== '/wes-national' && pathname.startsWith(item.to));
            return (
              <Link key={item.to} to={item.to} className={`${styles.navLink} ${active ? styles.active : ''}`}>
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className={styles.headerRight}>
          <span className={styles.dashTitle}>WES National Assessment</span>
        </div>
      </header>

      <main className={styles.main}>{children}</main>
    </div>
  );
}
