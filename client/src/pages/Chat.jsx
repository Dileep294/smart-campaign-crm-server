import { useState } from 'react';
import { chatWithAI, sendCampaign } from '../api';

const Chat = () => {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hi! I'm your AI campaign manager 👋 Tell me who you want to reach and what you want to say. For example: 'Send a 20% discount to customers who haven't ordered in 30 days'",
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [campaignResult, setCampaignResult] = useState(null);

  const isLaunchIntent = (text) => {
    const keywords = ['send', 'launch', 'run', 'create campaign', 'reach', 'message', 'notify', 'offer', 'discount'];
    return keywords.some(k => text.toLowerCase().includes(k));
  };

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage = { role: 'user', content: input };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput('');
    setLoading(true);
    setCampaignResult(null);

    try {
      if (isLaunchIntent(input)) {
        // First get AI response
        const chatRes = await chatWithAI(updatedMessages);
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: chatRes.data.message
        }]);

        // Then launch campaign
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: '🚀 Launching your campaign now...'
        }]);

        const campaignRes = await sendCampaign(input);
        const result = campaignRes.data.data;
        setCampaignResult(result);

        setMessages(prev => [...prev, {
          role: 'assistant',
          content: `✅ Campaign launched successfully!\n\n📊 **${result.campaign.name}**\n👥 Targeted: ${result.totalTargeted} customers\n📝 Segment: ${result.segmentDescription}\n\nMessages are being delivered. Check the Dashboard to track performance!`
        }]);
      } else {
        const chatRes = await chatWithAI(updatedMessages);
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: chatRes.data.message
        }]);
      }
    } catch (err) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: '❌ Something went wrong. Please try again.'
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>🤖 AI Campaign Manager</h1>
        <p style={styles.subtitle}>Describe your campaign in plain English — AI will handle the rest</p>
      </div>

      <div style={styles.suggestions}>
        {[
          "Send a win-back offer to customers inactive for 60 days",
          "Message high spenders (₹10000+) with an exclusive deal",
          "Reach customers who prefer WhatsApp with a flash sale",
        ].map((s, i) => (
          <button key={i} style={styles.suggestion} onClick={() => setInput(s)}>
            {s}
          </button>
        ))}
      </div>

      <div style={styles.chatBox}>
        {messages.map((msg, i) => (
          <div key={i} style={{
            ...styles.message,
            ...(msg.role === 'user' ? styles.userMessage : styles.aiMessage)
          }}>
            <div style={styles.messageRole}>
              {msg.role === 'user' ? '👤 You' : '🤖 AI'}
            </div>
            <div style={styles.messageContent}>
              {msg.content.split('\n').map((line, j) => (
                <p key={j} style={{ margin: '4px 0' }}>{line}</p>
              ))}
            </div>
          </div>
        ))}
        {loading && (
          <div style={{ ...styles.message, ...styles.aiMessage }}>
            <div style={styles.messageRole}>🤖 AI</div>
            <div style={styles.typing}>Thinking...</div>
          </div>
        )}
      </div>

      <div style={styles.inputArea}>
        <textarea
          style={styles.input}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Describe your campaign... (Press Enter to send)"
          rows={2}
        />
        <button
          style={{ ...styles.sendBtn, opacity: loading ? 0.6 : 1 }}
          onClick={handleSend}
          disabled={loading}
        >
          {loading ? '...' : 'Send ➤'}
        </button>
      </div>
    </div>
  );
};

const styles = {
  container: { maxWidth: '800px', margin: '0 auto', padding: '24px', },
  header: { marginBottom: '24px' },
  title: { color: '#ccd6f6', fontSize: '28px', margin: '0 0 8px' },
  subtitle: { color: '#8892b0', margin: 0 },
  suggestions: { display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '16px' },
  suggestion: {
    background: '#16213e', color: '#64ffda', border: '1px solid #64ffda33',
    borderRadius: '20px', padding: '6px 14px', fontSize: '12px',
    cursor: 'pointer', transition: 'all 0.2s',
  },
  chatBox: {
    background: '#16213e', borderRadius: '12px', padding: '16px',
    minHeight: '400px', maxHeight: '500px', overflowY: 'auto',
    marginBottom: '16px', display: 'flex', flexDirection: 'column', gap: '12px',
  },
  message: { borderRadius: '8px', padding: '12px 16px', maxWidth: '85%' },
  userMessage: { background: '#0f3460', alignSelf: 'flex-end', marginLeft: 'auto' },
  aiMessage: { background: '#1a1a2e', alignSelf: 'flex-start', border: '1px solid #16213e' },
  messageRole: { fontSize: '11px', color: '#64ffda', marginBottom: '6px', fontWeight: '600' },
  messageContent: { color: '#ccd6f6', fontSize: '14px', lineHeight: '1.5' },
  typing: { color: '#8892b0', fontStyle: 'italic' },
  inputArea: { display: 'flex', gap: '12px', alignItems: 'flex-end' },
  input: {
    flex: 1, background: '#16213e', border: '1px solid #8892b033',
    borderRadius: '8px', padding: '12px', color: '#ccd6f6',
    fontSize: '14px', resize: 'none', outline: 'none',
  },
  sendBtn: {
    background: '#64ffda', color: '#1a1a2e', border: 'none',
    borderRadius: '8px', padding: '12px 20px', fontWeight: '700',
    cursor: 'pointer', fontSize: '14px', whiteSpace: 'nowrap',
  },
};

export default Chat;