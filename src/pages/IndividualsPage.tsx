import { motion, Variants } from 'framer-motion';
import { Camera, CheckCircle2, Mic, SendHorizontal } from 'lucide-react';

const reveal: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
};

export default function IndividualsPage() {
  return (
    <div className="page-stack" style={{ gap: '4rem', marginTop: '2rem' }}>
      <motion.section className="hero-grid" initial="hidden" animate="visible" variants={reveal}>
        <div className="hero-copy-block">
          <p className="eyebrow" style={{ color: 'var(--muted)', fontSize: '0.9rem', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '-0.5rem' }}>Individuals</p>
          <h1>
            AI services to streamline operations
            <span>and drive growth.</span>
          </h1>
          <p>
            B2W provides accessible, high-impact AI tools for individual operators who need cleaner communication,
            faster follow-through, and better day-to-day execution.
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
        <div className="demo-content-area" style={{ maxWidth: '900px', margin: '0 auto', border: 'none', background: 'transparent', boxShadow: 'none' }}>
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
                  I just left a client meeting. Can you prep follow-ups and remind me before 5 pm?
                </div>

                <div className="msg msg-ai">
                  On it. Send voice or image notes and I will convert everything to tasks and draft responses.
                </div>

                <div className="msg msg-user msg-voice">
                  <Mic size={12} />
                  Voice note 00:18: "Client wants revised proposal by Thursday."
                </div>

                <div className="msg msg-user msg-image">
                  <Camera size={12} />
                  Image uploaded: whiteboard action list
                </div>

                <div className="msg msg-ai action-msg">
                  <p>Action completed:</p>
                  <ul>
                    <li>
                      <CheckCircle2 size={13} /> Drafted proposal follow-up email
                    </li>
                    <li>
                      <CheckCircle2 size={13} /> Added reminder for 4:30 pm
                    </li>
                    <li>
                      <CheckCircle2 size={13} /> Created 3 tasks in your tracker
                    </li>
                  </ul>
                </div>
              </div>

              <footer className="chat-input">
                <button type="button" className="input-icon"><Camera size={15} /></button>
                <button type="button" className="input-icon"><Mic size={15} /></button>
                <p>Message, voice, or image...</p>
                <button type="button" className="send-btn"><SendHorizontal size={14} /></button>
              </footer>
            </div>
          </motion.article>
        </div>
      </motion.section>
    </div>
  );
}
