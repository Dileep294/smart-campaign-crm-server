import { useState, useEffect } from 'react';
import { getCampaigns, getCampaign, getCustomerStats, getCampaignStats } from '../api';

const Dashboard = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [customerStats, setCustomerStats] = useState(null);
  const [campaignStats, setCampaignStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    try {
      const [campaignsRes, customerStatsRes, campaignStatsRes] = await Promise.all([
        getCampaigns(),
        getCustomerStats(),
        getCampaignStats(),
      ]);
      setCampaigns(campaignsRes.data.data);
      setCustomerStats(customerStatsRes.data.data);
      setCampaignStats(campaignStatsRes.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCampaignDetail = async (id) => {
    try {
      const res = await getCampaign(id);
      setSelectedCampaign(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  const getDeliveryRate = (campaign) => {
    if (!campaign.totalSent) return 0;
    return Math.round((campaign.totalDelivered / campaign.totalSent) * 100);
  };

  const getOpenRate = (campaign) => {
    if (!campaign.totalDelivered) return 0;
    return Math.round((campaign.totalOpened / campaign.totalDelivered) * 100);
  };

  const getClickRate = (campaign) => {
    if (!campaign.totalOpened) return 0;
    return Math.round((campaign.totalClicked / campaign.totalOpened) * 100);
  };

  if (loading) return <div style={styles.loading}>Loading dashboard...</div>;

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>📊 Campaign Dashboard</h1>

      {/* Overview Stats */}
      <div style={styles.statsGrid}>
        {[
          { label: 'Total Customers', value: customerStats?.total || 0, icon: '👥' },
          { label: 'Active Customers', value: customerStats?.active || 0, icon: '✅' },
          { label: 'Total Campaigns', value: campaignStats?.total || 0, icon: '📢' },
          { label: 'Completed', value: campaignStats?.completed || 0, icon: '🏁' },
        ].map((stat, i) => (
          <div key={i} style={styles.statCard}>
            <div style={styles.statIcon}>{stat.icon}</div>
            <div style={styles.statValue}>{stat.value}</div>
            <div style={styles.statLabel}>{stat.label}</div>
          </div>
        ))}
      </div>

      <div style={styles.grid}>
        {/* Campaigns List */}
        <div style={styles.panel}>
          <h2 style={styles.panelTitle}>Recent Campaigns</h2>
          {campaigns.length === 0 ? (
            <p style={styles.empty}>No campaigns yet. Go to AI Campaign to launch one!</p>
          ) : (
            campaigns.map(campaign => (
              <div
                key={campaign._id}
                style={{
                  ...styles.campaignCard,
                  ...(selectedCampaign?.campaign?._id === campaign._id ? styles.selectedCard : {})
                }}
                onClick={() => fetchCampaignDetail(campaign._id)}
              >
                <div style={styles.campaignHeader}>
                  <span style={styles.campaignName}>{campaign.name}</span>
                  <span style={{
                    ...styles.badge,
                    background: campaign.status === 'completed' ? '#64ffda22' : '#f6c90e22',
                    color: campaign.status === 'completed' ? '#64ffda' : '#f6c90e',
                  }}>
                    {campaign.status}
                  </span>
                </div>
                <div style={styles.campaignStats}>
                  <span>👥 {campaign.totalTargeted} targeted</span>
                  <span>📨 {campaign.totalDelivered} delivered</span>
                  <span>👁️ {campaign.totalOpened} opened</span>
                  <span>🖱️ {campaign.totalClicked} clicked</span>
                </div>
                <div style={styles.progressBar}>
                  <div style={{
                    ...styles.progressFill,
                    width: `${getDeliveryRate(campaign)}%`
                  }} />
                </div>
                <div style={styles.progressLabel}>
                  {getDeliveryRate(campaign)}% delivery rate
                </div>
              </div>
            ))
          )}
        </div>

        {/* Campaign Detail */}
        <div style={styles.panel}>
          <h2 style={styles.panelTitle}>Campaign Details</h2>
          {!selectedCampaign ? (
            <p style={styles.empty}>Click a campaign to see details</p>
          ) : (
            <div>
              <h3 style={styles.detailTitle}>{selectedCampaign.campaign.name}</h3>
              <p style={styles.prompt}>"{selectedCampaign.campaign.prompt}"</p>

              <div style={styles.metricsGrid}>
                {[
                  { label: 'Delivery Rate', value: `${getDeliveryRate(selectedCampaign.campaign)}%`, color: '#64ffda' },
                  { label: 'Open Rate', value: `${getOpenRate(selectedCampaign.campaign)}%`, color: '#f6c90e' },
                  { label: 'Click Rate', value: `${getClickRate(selectedCampaign.campaign)}%`, color: '#ff6b9d' },
                  { label: 'Failed', value: selectedCampaign.campaign.totalFailed, color: '#ff6b6b' },
                ].map((m, i) => (
                  <div key={i} style={styles.metricCard}>
                    <div style={{ ...styles.metricValue, color: m.color }}>{m.value}</div>
                    <div style={styles.metricLabel}>{m.label}</div>
                  </div>
                ))}
              </div>

              <h4 style={styles.messagesTitle}>Messages ({selectedCampaign.messages.length})</h4>
              <div style={styles.messagesList}>
                {selectedCampaign.messages.slice(0, 10).map((msg, i) => (
                  <div key={i} style={styles.messageItem}>
                    <div style={styles.messageName}>{msg.customerId?.name || 'Unknown'}</div>
                    <div style={styles.messageContent}>{msg.content.substring(0, 60)}...</div>
                    <span style={{
                      ...styles.statusBadge,
                      background: msg.status === 'clicked' ? '#64ffda22' :
                        msg.status === 'opened' ? '#f6c90e22' :
                        msg.status === 'delivered' ? '#4ade8022' :
                        msg.status === 'failed' ? '#ff6b6b22' : '#8892b022',
                      color: msg.status === 'clicked' ? '#64ffda' :
                        msg.status === 'opened' ? '#f6c90e' :
                        msg.status === 'delivered' ? '#4ade80' :
                        msg.status === 'failed' ? '#ff6b6b' : '#8892b0',
                    }}>
                      {msg.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: { padding: '24px', maxWidth: '1200px', margin: '0 auto' },
  title: { color: '#ccd6f6', marginBottom: '24px' },
  loading: { color: '#8892b0', padding: '24px', textAlign: 'center' },
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' },
  statCard: {
    background: '#16213e', borderRadius: '12px', padding: '20px',
    textAlign: 'center', border: '1px solid #8892b011',
  },
  statIcon: { fontSize: '28px', marginBottom: '8px' },
  statValue: { color: '#64ffda', fontSize: '32px', fontWeight: '700' },
  statLabel: { color: '#8892b0', fontSize: '13px', marginTop: '4px' },
  grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' },
  panel: { background: '#16213e', borderRadius: '12px', padding: '20px', border: '1px solid #8892b011' },
  panelTitle: { color: '#ccd6f6', marginTop: 0, marginBottom: '16px', fontSize: '18px' },
  empty: { color: '#8892b0', fontStyle: 'italic' },
  campaignCard: {
    background: '#1a1a2e', borderRadius: '8px', padding: '16px',
    marginBottom: '12px', cursor: 'pointer', border: '1px solid transparent',
    transition: 'all 0.2s',
  },
  selectedCard: { border: '1px solid #64ffda44' },
  campaignHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' },
  campaignName: { color: '#ccd6f6', fontWeight: '600', fontSize: '14px' },
  badge: { padding: '2px 8px', borderRadius: '12px', fontSize: '11px', fontWeight: '600' },
  campaignStats: { display: 'flex', gap: '12px', flexWrap: 'wrap', color: '#8892b0', fontSize: '12px', marginBottom: '8px' },
  progressBar: { background: '#0f3460', borderRadius: '4px', height: '4px', marginBottom: '4px' },
  progressFill: { background: '#64ffda', height: '100%', borderRadius: '4px', transition: 'width 0.5s' },
  progressLabel: { color: '#8892b0', fontSize: '11px' },
  detailTitle: { color: '#ccd6f6', marginTop: 0 },
  prompt: { color: '#8892b0', fontStyle: 'italic', fontSize: '13px', marginBottom: '16px' },
  metricsGrid: { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', marginBottom: '20px' },
  metricCard: { background: '#1a1a2e', borderRadius: '8px', padding: '16px', textAlign: 'center' },
  metricValue: { fontSize: '28px', fontWeight: '700' },
  metricLabel: { color: '#8892b0', fontSize: '12px', marginTop: '4px' },
  messagesTitle: { color: '#ccd6f6', marginBottom: '12px' },
  messagesList: { maxHeight: '300px', overflowY: 'auto' },
  messageItem: {
    background: '#1a1a2e', borderRadius: '6px', padding: '10px 12px',
    marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px',
  },
  messageName: { color: '#ccd6f6', fontSize: '13px', fontWeight: '600', minWidth: '80px' },
  messageContent: { color: '#8892b0', fontSize: '12px', flex: 1 },
  statusBadge: { padding: '2px 8px', borderRadius: '10px', fontSize: '11px', fontWeight: '600', whiteSpace: 'nowrap' },
};

export default Dashboard;