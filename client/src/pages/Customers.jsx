import { useState, useEffect } from 'react';
import { getCustomers } from '../api';

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const res = await getCustomers();
      setCustomers(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filtered = customers.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase())
  );

  const daysSince = (date) => {
    if (!date) return 'Never';
    const days = Math.floor((Date.now() - new Date(date)) / (1000 * 60 * 60 * 24));
    return `${days}d ago`;
  };

  if (loading) return <div style={styles.loading}>Loading customers...</div>;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>👥 Customers</h1>
        <div style={styles.searchBox}>
          <input
            style={styles.search}
            placeholder="🔍 Search by name or email..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div style={styles.stats}>
        <span style={styles.count}>{filtered.length} customers</span>
      </div>

      <div style={styles.table}>
        <div style={styles.tableHeader}>
          <span>Name</span>
          <span>Email</span>
          <span>Channel</span>
          <span>Orders</span>
          <span>Total Spent</span>
          <span>Last Order</span>
        </div>
        {filtered.map(customer => (
          <div key={customer._id} style={styles.tableRow}>
            <span style={styles.name}>{customer.name}</span>
            <span style={styles.email}>{customer.email}</span>
            <span>
              <span style={{
                ...styles.channelBadge,
                background: customer.channelPreference === 'whatsapp' ? '#25d36622' :
                  customer.channelPreference === 'email' ? '#64ffda22' : '#f6c90e22',
                color: customer.channelPreference === 'whatsapp' ? '#25d366' :
                  customer.channelPreference === 'email' ? '#64ffda' : '#f6c90e',
              }}>
                {customer.channelPreference === 'whatsapp' ? '📱' :
                  customer.channelPreference === 'email' ? '📧' : '💬'} {customer.channelPreference}
              </span>
            </span>
            <span style={styles.orders}>{customer.totalOrders}</span>
            <span style={styles.spent}>₹{customer.totalSpent?.toLocaleString()}</span>
            <span style={styles.lastOrder}>{daysSince(customer.lastOrderAt)}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const styles = {
  container: { padding: '24px', maxWidth: '1200px', margin: '0 auto' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' },
  title: { color: '#ccd6f6', margin: 0 },
  searchBox: {},
  search: {
    background: '#16213e', border: '1px solid #8892b033', borderRadius: '8px',
    padding: '10px 16px', color: '#ccd6f6', fontSize: '14px', outline: 'none', width: '280px',
  },
  stats: { marginBottom: '16px' },
  count: { color: '#8892b0', fontSize: '14px' },
  table: { background: '#16213e', borderRadius: '12px', overflow: 'hidden', border: '1px solid #8892b011' },
  tableHeader: {
    display: 'grid', gridTemplateColumns: '1.5fr 2fr 1fr 0.7fr 1fr 1fr',
    padding: '12px 20px', background: '#1a1a2e',
    color: '#8892b0', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase',
  },
  tableRow: {
    display: 'grid', gridTemplateColumns: '1.5fr 2fr 1fr 0.7fr 1fr 1fr',
    padding: '14px 20px', borderTop: '1px solid #8892b011',
    alignItems: 'center', transition: 'background 0.2s',
  },
  name: { color: '#ccd6f6', fontWeight: '600', fontSize: '14px' },
  email: { color: '#8892b0', fontSize: '13px' },
  channelBadge: { padding: '3px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: '500' },
  orders: { color: '#ccd6f6', fontSize: '14px' },
  spent: { color: '#64ffda', fontWeight: '600', fontSize: '14px' },
  lastOrder: { color: '#8892b0', fontSize: '13px' },
  loading: { color: '#8892b0', padding: '24px', textAlign: 'center' },
};

export default Customers;