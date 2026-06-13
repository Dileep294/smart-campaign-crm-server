import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();

  const navItems = [
    { path: '/chat', label: '🤖 AI Campaign', },
    { path: '/dashboard', label: '📊 Dashboard' },
    { path: '/customers', label: '👥 Customers' },
  ];

  return (
    <nav style={styles.nav}>
      <div style={styles.brand}>
        <span style={styles.logo}>⚡</span>
        <span style={styles.brandName}>SmartCRM</span>
      </div>
      <div style={styles.links}>
        {navItems.map(item => (
          <Link
            key={item.path}
            to={item.path}
            style={{
              ...styles.link,
              ...(location.pathname === item.path ? styles.activeLink : {})
            }}
          >
            {item.label}
          </Link>
        ))}
      </div>
    </nav>
  );
};

const styles = {
  nav: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 24px',
    height: '60px',
    background: '#1a1a2e',
    borderBottom: '1px solid #16213e',
    position: 'sticky',
    top: 0,
    zIndex: 100,
  },
  brand: { display: 'flex', alignItems: 'center', gap: '8px' },
  logo: { fontSize: '24px' },
  brandName: { color: '#fff', fontWeight: '700', fontSize: '18px' },
  links: { display: 'flex', gap: '8px' },
  link: {
    color: '#8892b0',
    textDecoration: 'none',
    padding: '8px 16px',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '500',
    transition: 'all 0.2s',
  },
  activeLink: {
    color: '#64ffda',
    background: '#16213e',
  },
};

export default Navbar;