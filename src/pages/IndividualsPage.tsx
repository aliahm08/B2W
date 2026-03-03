import { AnimatePresence, motion, Variants } from 'framer-motion';
import {
  Bot,
  Camera,
  CheckCircle2,
  FileText,
  Mic,
  SendHorizontal,
  Sparkles,
  Upload,
} from 'lucide-react';
import { useEffect, useState } from 'react';

type DemoMode = 'digitalTwin' | 'assistant' | 'aiMe' | 'actionLoop';

const reveal: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
};

const sceneList: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.11,
      delayChildren: 0.04
    }
  }
};

const sceneItem: Variants = {
  hidden: { opacity: 0, y: 10 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: 'easeOut' }
  }
};

const modeOrder: DemoMode[] = ['digitalTwin', 'assistant', 'aiMe', 'actionLoop'];

const modeConfig: Record<
  DemoMode,
  {
    label: string;
    title: string;
    description: string;
    bullets: string[];
    inputHint: string;
  }
> = {
  digitalTwin: {
    label: 'Digital Twin Mode',
    title: 'Configure how your AI agent talks and executes',
    description:
      'Batch upload SOPs and teach your workflow once. The assistant learns tone, approvals, and escalation rules.',
    bullets: [
      'Ingests SOP batches and operating docs',
      'Learns workflow order and response tone',
      'Builds guardrails for when to escalate'
    ],
    inputHint: 'Upload SOPs, process docs, or voice workflow notes...'
  },
  assistant: {
    label: 'Assistant Mode',
    title: 'Summaries, parameters, and control in one thread',
    description:
      'You and the assistant stay in sync. It summarizes what is happening and shows exactly when it will loop you in.',
    bullets: [
      'Live summary of all active conversations',
      'Transparent parameters for auto-replies',
      'Clear escalation triggers for human handoff'
    ],
    inputHint: 'Ask for daily summary, update parameters, or approve changes...'
  },
  aiMe: {
    label: 'AI Me',
    title: 'Others message you, your AI responds on your behalf',
    description:
      'Your assistant handles routine inbound messages directly while preserving your voice and preferred rules.',
    bullets: [
      'Responds instantly to common requests',
      'Keeps context across client and partner threads',
      'Escalates only high-value or high-risk messages'
    ],
    inputHint: 'Inbound messages are being handled by AI Me...'
  },
  actionLoop: {
    label: 'Action Loop',
    title: 'Review outcomes and evolve your SOPs',
    description:
      'After deployment, the assistant loops back with summaries and helps you author new SOP updates in WhatsApp.',
    bullets: [
      'Consolidates chat outcomes and actions',
      'Drafts new SOPs from your voice/text guidance',
      'Deploys improved workflows into Digital Twin mode'
    ],
    inputHint: 'Voice-note a new SOP and confirm deployment...'
  }
};

function DigitalTwinScene() {
  return (
    <motion.div variants={sceneList} initial="hidden" animate="show" className="workflow-scene-stack">
      <motion.div variants={sceneItem} className="msg msg-user msg-upload">
        <Upload size={12} /> Uploading batch SOPs + workflow notes.
      </motion.div>

      <motion.div variants={sceneItem} className="sop-stack">
        <div className="sop-row">
          <div>
            <FileText size={12} /> sales-handshake-v3.pdf
          </div>
          <span className="sop-state is-done">Mapped</span>
        </div>
        <div className="sop-row">
          <div>
            <FileText size={12} /> escalation-rules.md
          </div>
          <span className="sop-state is-done">Mapped</span>
        </div>
        <div className="sop-row">
          <div>
            <FileText size={12} /> onboarding-playbook.csv
          </div>
          <span className="sop-state is-live">Learning</span>
        </div>
      </motion.div>

      <motion.div variants={sceneItem} className="msg msg-ai">
        Digital Twin configured. I will mirror your workflow and only escalate deals above $25k ARR or legal changes.
      </motion.div>

      <motion.div variants={sceneItem} className="workflow-chip-row">
        <span className="workflow-chip">Tone: Direct</span>
        <span className="workflow-chip">Escalation: High-value deals</span>
        <span className="workflow-chip">Approval: Contract edits</span>
      </motion.div>
    </motion.div>
  );
}

function AssistantScene() {
  return (
    <motion.div variants={sceneList} initial="hidden" animate="show" className="workflow-scene-stack">
      <motion.div variants={sceneItem} className="msg msg-ai">
        Summary: 16 conversations active. I handled scheduling + status updates. 2 threads need your input.
      </motion.div>

      <motion.div variants={sceneItem} className="assistant-parameter-card">
        <p className="assistant-parameter-title">Current autopilot parameters</p>
        <ul>
          <li>Auto-reply to delivery timeline questions</li>
          <li>Loop you in when budget, legal, or scope shifts</li>
          <li>Escalate if sentiment turns negative twice</li>
        </ul>
      </motion.div>

      <motion.div variants={sceneItem} className="msg msg-user">
        Keep auto-handling scheduling. Loop me in for anything above $25k and all contract renegotiations.
      </motion.div>

      <motion.div variants={sceneItem} className="msg msg-ai">
        Updated. I will summarize every major thread at 1:00 PM and 6:00 PM.
      </motion.div>
    </motion.div>
  );
}

function AiMeScene() {
  return (
    <motion.div variants={sceneList} initial="hidden" animate="show" className="workflow-scene-stack">
      <motion.div variants={sceneItem} className="msg msg-external">
        <span className="msg-sender">Client • Olivia</span>
        Can we move review to Thursday and keep launch timeline intact?
      </motion.div>

      <motion.div variants={sceneItem} className="msg msg-ai">
        AI Me: Thursday works. I reserved 2:30 PM and shared the updated review agenda.
      </motion.div>

      <motion.div variants={sceneItem} className="msg msg-external">
        <span className="msg-sender">Partner • Niko</span>
        Need an update on invoice timeline.
      </motion.div>

      <motion.div variants={sceneItem} className="msg msg-ai">
        AI Me: Payment is scheduled for Friday. Sending confirmation receipt after processing.
      </motion.div>

      <motion.div variants={sceneItem} className="msg msg-ai action-msg">
        Looping you in: Olivia asked for expanded scope tied to +$42k ARR.
      </motion.div>
    </motion.div>
  );
}

function ActionLoopScene() {
  return (
    <motion.div variants={sceneList} initial="hidden" animate="show" className="workflow-scene-stack">
      <motion.div variants={sceneItem} className="msg msg-ai">
        End-of-day summary: 22 chats handled. 6 follow-ups closed. 3 new patterns detected for SOP improvement.
      </motion.div>

      <motion.div variants={sceneItem} className="msg msg-user msg-voice">
        <Mic size={12} /> Voice note 00:14: Add SOP to qualify inbound leads before scheduling strategy calls.
      </motion.div>

      <motion.div variants={sceneItem} className="msg msg-ai">
        Drafted new SOP v4. Rules: qualification first, then calendar offer, then pricing context.
      </motion.div>

      <motion.div variants={sceneItem} className="msg msg-user">
        Confirmed. Deploy this flow starting tomorrow morning.
      </motion.div>

      <motion.div variants={sceneItem} className="msg msg-ai msg-deploy">
        <Sparkles size={12} /> Deployed. Returning to Digital Twin mode with new SOP.
      </motion.div>
    </motion.div>
  );
}

function WorkflowScene({ mode }: { mode: DemoMode }) {
  if (mode === 'digitalTwin') {
    return <DigitalTwinScene />;
  }

  if (mode === 'assistant') {
    return <AssistantScene />;
  }

  if (mode === 'aiMe') {
    return <AiMeScene />;
  }

  return <ActionLoopScene />;
}

export default function IndividualsPage() {
  const [modeIndex, setModeIndex] = useState(0);
  const activeMode = modeOrder[modeIndex];

  useEffect(() => {
    const interval = window.setInterval(() => {
      setModeIndex((current) => (current + 1) % modeOrder.length);
    }, 6200);

    return () => window.clearInterval(interval);
  }, []);

  return (
    <div className="page-stack" style={{ gap: '4rem', marginTop: '2rem' }}>
      <motion.section className="hero-grid" initial="hidden" animate="visible" variants={reveal}>
        <div className="hero-copy-block">
          <p
            className="eyebrow"
            style={{
              color: 'var(--muted)',
              fontSize: '0.9rem',
              fontWeight: 600,
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
              marginBottom: '-0.5rem'
            }}
          >
            Individuals
          </p>
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
        <div className="demo-content-area individuals-demo-surface">
          <div className="mode-tabs">
            {modeOrder.map((mode, index) => (
              <button
                key={mode}
                type="button"
                className={mode === activeMode ? 'mode-tab active' : 'mode-tab'}
                onClick={() => setModeIndex(index)}
              >
                {index + 1}. {modeConfig[mode].label}
              </button>
            ))}
          </div>

          <div className="individuals-demo-layout">
            <article className="mode-brief-card">
              <p className="mode-step">Mode {modeIndex + 1}</p>
              <h3>{modeConfig[activeMode].title}</h3>
              <p>{modeConfig[activeMode].description}</p>
              <ul className="mode-brief-list">
                {modeConfig[activeMode].bullets.map((bullet) => (
                  <li key={bullet}>
                    <CheckCircle2 size={14} />
                    {bullet}
                  </li>
                ))}
              </ul>
            </article>

            <motion.article
              className="phone-shell workflow-phone"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <div className="phone-notch" />
              <div className="chat-app">
                <header className="chat-header">
                  <div className="chat-contact">
                    <span className="chat-avatar">B2W</span>
                    <div>
                      <p className="chat-name">B2W Assistant</p>
                      <p className="chat-status">Individuals deployment</p>
                    </div>
                  </div>
                  <span className="mode-live-badge">{modeConfig[activeMode].label}</span>
                </header>

                <div className="chat-thread workflow-thread">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeMode}
                      initial={{ opacity: 0, y: 14 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.55, ease: 'easeOut' }}
                      className="workflow-scene"
                    >
                      <WorkflowScene mode={activeMode} />
                    </motion.div>
                  </AnimatePresence>
                </div>

                <footer className="chat-input">
                  <button type="button" className="input-icon" aria-label="Attach image">
                    <Camera size={15} />
                  </button>
                  <button type="button" className="input-icon" aria-label="Record voice">
                    <Mic size={15} />
                  </button>
                  <p>{modeConfig[activeMode].inputHint}</p>
                  <button type="button" className="send-btn" aria-label="Send message">
                    {activeMode === 'aiMe' ? <Bot size={14} /> : activeMode === 'digitalTwin' ? <Upload size={14} /> : activeMode === 'actionLoop' ? <Sparkles size={14} /> : <SendHorizontal size={14} />}
                  </button>
                </footer>
              </div>
            </motion.article>
          </div>

          <p className="workflow-caption">
            Loop sequence: <span>Digital Twin</span>
            {' -> '}
            <span>Assistant</span>
            {' -> '}
            <span>AI Me</span>
            {' -> '}
            <span>Action Loop</span>
            {' -> '}
            back to <span>Digital Twin</span>
          </p>
        </div>
      </motion.section>
    </div>
  );
}
