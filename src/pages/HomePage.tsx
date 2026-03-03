import { motion, Variants } from 'framer-motion';
import { useState } from 'react';
import {
  Building2,
  Camera,
  CheckCircle2,
  Database,
  FileText,
  Mic,
  SendHorizontal,
  ShieldAlert,
  TerminalSquare
} from 'lucide-react';

const reveal: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
};

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<'individuals' | 'enterprise' | 'gov'>('individuals');

  return (
    <div className="page-stack" style={{ gap: '4rem', marginTop: '2rem' }}>
      <motion.section className="hero-grid" initial="hidden" animate="visible" variants={reveal}>
        <div className="hero-copy-block">
          <h1>
            AI solutions to improve communications
            <span>and optimize operational insights.</span>
          </h1>
          <p>
            B2W builds AI services for individuals, consulting for enterprise clients,
            and platforms for federal agencies.
          </p>
          <div className="hero-actions">
            <a className="btn" href="mailto:team@b2w-ai.com?subject=B2W%20Discovery%20Call">
              Get Started
            </a>
            <a className="btn btn-subtle" href="mailto:team@b2w-ai.com?subject=B2W%20Demo%20Request">
              Book a Demo
            </a>
          </div>
        </div>
      </motion.section>

      <motion.section
        className="demo-showcase-container"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
        variants={reveal}
      >
        <div className="demo-tabs">
          <button
            className={`demo-tab-btn ${activeTab === 'individuals' ? 'active' : ''}`}
            onClick={() => setActiveTab('individuals')}
          >
            Individuals
          </button>
          <button
            className={`demo-tab-btn ${activeTab === 'enterprise' ? 'active' : ''}`}
            onClick={() => setActiveTab('enterprise')}
          >
            Enterprises
          </button>
          <button
            className={`demo-tab-btn ${activeTab === 'gov' ? 'active' : ''}`}
            onClick={() => setActiveTab('gov')}
          >
            Government Solutions
          </button>
        </div>

        <div className="demo-content-area" style={{ maxWidth: '900px', margin: '0 auto', border: 'none', background: 'transparent', boxShadow: 'none' }}>
          {activeTab === 'individuals' && (
            <motion.article
              className="phone-shell"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              style={{ margin: '0 auto' }}
            >
              <div className="phone-notch" />
              <div className="chat-app">
                <header className="chat-header">
                  <div className="chat-contact">
                    <span className="chat-avatar">B2W</span>
                    <div>
                      <p className="chat-name">B2W Assistant</p>
                      <p className="chat-status">Online now</p>
                    </div>
                  </div>
                </header>
                <div className="chat-thread">
                  <div className="msg msg-user">
                    Just received the supplier invoice and onboarded Acme Corp. Can you update the tracker?
                  </div>
                  <div className="msg msg-ai">
                    Processing your updates.
                  </div>
                  <div className="msg msg-ai action-msg">
                    <p>Actions completed:</p>
                    <ul>
                      <li><CheckCircle2 size={13} /> Logged Invoice #1024 to Q3 Expenses</li>
                      <li><CheckCircle2 size={13} /> Triggered Acme Corp Welcome Flow</li>
                      <li><CheckCircle2 size={13} /> Drafted follow-up for tomorrow 9 AM</li>
                    </ul>
                  </div>
                </div>
                <footer className="chat-input">
                  <button type="button" className="input-icon"><Camera size={15} /></button>
                  <button type="button" className="input-icon"><Mic size={15} /></button>
                  <p>Message...</p>
                  <button type="button" className="send-btn"><SendHorizontal size={14} /></button>
                </footer>
              </div>
            </motion.article>
          )}

          {activeTab === 'enterprise' && (
            <motion.article
              className="dashboard-window"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              style={{ margin: '0 auto', border: '1px solid var(--line)', boxShadow: 'var(--shadow)' }}
            >
              <header className="dashboard-header">
                <div className="mac-dots">
                  <span /> <span /> <span />
                </div>
                <div style={{ fontSize: '0.75rem', color: '#8faac8', marginLeft: '1rem', fontWeight: 600 }}>
                  B2W SaaS Risk Analytics
                </div>
              </header>
              <div className="dashboard-body">
                <aside className="dashboard-sidebar">
                  <div className="dash-icon active"><Building2 size={14} color="#55d9c2" /></div>
                  <div className="dash-icon"><Database size={14} color="#a5bee0" /></div>
                  <div className="dash-icon"><FileText size={14} color="#a5bee0" /></div>
                  <div className="dash-icon"><ShieldAlert size={14} color="#a5bee0" /></div>
                </aside>
                <main className="dashboard-main">
                  <div className="dash-widget full">
                    <span className="widget-title">Cross-org Alignment Index</span>
                    <span className="widget-val">87.4%</span>
                    <div className="widget-chart-bar"><div className="widget-chart-fill" style={{ width: '87.4%' }} /></div>
                  </div>
                  <div className="dash-widget">
                    <span className="widget-title">Delivery Latency</span>
                    <span className="widget-val">-1.2 days</span>
                  </div>
                  <div className="dash-widget">
                    <span className="widget-title">Risk Anomalies</span>
                    <span className="widget-val" style={{ color: '#ffbd2e' }}>2 detected</span>
                  </div>
                </main>
              </div>
            </motion.article>
          )}

          {activeTab === 'gov' && (
            <motion.article
              className="secure-terminal"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              style={{ margin: '0 auto', maxWidth: '650px', border: '1px solid var(--line)', boxShadow: 'var(--shadow)' }}
            >
              <header className="terminal-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <TerminalSquare size={14} /> Mission Decisioning Gateway v4.2
                </div>
                <div className="terminal-status">
                  <span className="terminal-badge" /> EXECUTING
                </div>
              </header>
              <div className="terminal-body" style={{ height: '300px' }}>
                <div className="log-entry">
                  <span className="log-time">[14:02:01]</span>
                  <span className="log-level info">INFO</span>
                  <span className="log-msg">Connecting to secure intelligence feed... OK</span>
                </div>
                <div className="log-entry">
                  <span className="log-time">[14:02:05]</span>
                  <span className="log-level info">INFO</span>
                  <span className="log-msg">Scanning operational policy constraints...</span>
                </div>
                <div className="log-entry">
                  <span className="log-time">[14:02:06]</span>
                  <span className="log-level warn">WARN</span>
                  <span className="log-msg">Clearance level mismatch detected on node 4. Rerouting...</span>
                </div>
                <div className="log-entry">
                  <span className="log-time">[14:02:08]</span>
                  <span className="log-level success">PASS</span>
                  <span className="log-msg">Audit log generated. Action pathway approved.</span>
                </div>
                <div className="log-entry">
                  <span className="log-time">[14:02:10]</span>
                  <span className="log-level info">INFO</span>
                  <span className="log-msg">Awaiting next instruction..._</span>
                </div>
              </div>
            </motion.article>
          )}
        </div>
      </motion.section>
    </div>
  );
}
