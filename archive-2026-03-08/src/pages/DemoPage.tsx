import { Badge, Button, Card, Flex, Grid, Heading, Tabs, Text } from '@radix-ui/themes';
import { motion, useReducedMotion, Variants } from 'framer-motion';
import { Image, Mic, SendHorizontal } from 'lucide-react';
import { secondaryCtaHref, secondaryCtaLabel } from '../content/mission';

type Message = {
  id: string;
  from: 'user' | 'assistant';
  text: string;
};

const demoData: Record<
  string,
  {
    label: string;
    summary: string;
    messages: Message[];
    controls: string[];
  }
> = {
  twin: {
    label: 'Digital Twin Mode',
    summary:
      'Configure how RelayOS responds on your behalf by mapping SOPs, workflow rules, and escalation boundaries.',
    messages: [
      { id: 't1', from: 'assistant', text: 'SOP batch uploaded. I mapped 14 workflow rules.' },
      {
        id: 't2',
        from: 'user',
        text: 'Escalate only client messages marked urgent and route vendor updates automatically.'
      },
      {
        id: 't3',
        from: 'assistant',
        text: 'Policy saved. I will loop you in for urgent client requests and keep vendor flows delegated.'
      }
    ],
    controls: ['SOP upload', 'Priority routing', 'Escalation thresholds']
  },
  assistant: {
    label: 'Assistant Mode',
    summary:
      'Operate with a live assistant that summarizes active communication threads and keeps delegation rules visible.',
    messages: [
      {
        id: 'a1',
        from: 'assistant',
        text: 'Summary: 6 active chats, 2 awaiting your approval, 4 currently delegated.'
      },
      {
        id: 'a2',
        from: 'user',
        text: 'Show why I was looped into the two pending threads.'
      },
      {
        id: 'a3',
        from: 'assistant',
        text: 'Both exceeded your approval threshold: contract language and revised delivery terms.'
      }
    ],
    controls: ['Live summaries', 'Decision context', 'Approval queue']
  },
  aime: {
    label: 'AI Me Mode',
    summary:
      'RelayOS handles inbound communication using your configured policies while reporting outcomes back to you.',
    messages: [
      { id: 'm1', from: 'assistant', text: 'Incoming from Alex: "Can we move the kickoff to Thursday?"' },
      { id: 'm2', from: 'assistant', text: 'Response sent using your policy: "Thursday 2 PM confirmed."' },
      {
        id: 'm3',
        from: 'user',
        text: 'Update SOP: ask for agenda items before confirming any rescheduled meetings.'
      }
    ],
    controls: ['Delegated responses', 'Policy-constrained actions', 'SOP feedback loop']
  }
};

const reveal: Variants = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.34, ease: 'easeOut' } }
};

export default function DemoPage() {
  const reducedMotion = useReducedMotion();
  const sectionMotion = reducedMotion
    ? {}
    : { initial: 'hidden' as const, animate: 'visible' as const, variants: reveal };

  return (
    <div className="landing-stack">
      <motion.section className="section-card hero-lite" {...sectionMotion}>
        <Badge color="teal" radius="full" size="2" variant="soft">
          Hosted Demo
        </Badge>
        <Heading size="7">RelayOS WhatsApp-style operating interface</Heading>
        <Text size="3" className="muted-copy">
          This demo models the live interaction patterns for Individuals: Digital Twin setup, Assistant
          control, and AI Me delegated execution.
        </Text>
      </motion.section>

      <motion.section className="section-card" {...sectionMotion}>
        <Tabs.Root defaultValue="assistant" className="demo-tabs">
          <Tabs.List>
            <Tabs.Trigger value="twin">Digital Twin</Tabs.Trigger>
            <Tabs.Trigger value="assistant">Assistant</Tabs.Trigger>
            <Tabs.Trigger value="aime">AI Me</Tabs.Trigger>
          </Tabs.List>

          {(Object.entries(demoData) as Array<[keyof typeof demoData, (typeof demoData)[string]]>).map(
            ([key, mode]) => (
              <Tabs.Content key={key} value={key} className="tab-panel">
                <Grid columns={{ initial: '1', md: '2' }} gap="4" className="demo-grid">
                  <Card size="3" className="phone-card">
                    <div className="phone-shell" role="img" aria-label={`${mode.label} messenger view`}>
                      <div className="phone-head">
                        <Text size="2" weight="medium">
                          RelayOS Chat
                        </Text>
                        <Badge radius="full" variant="surface" color="gray">
                          {mode.label}
                        </Badge>
                      </div>

                      <div className="chat-thread">
                        {mode.messages.map((message) => (
                          <div key={message.id} className={`bubble ${message.from}`}>
                            <Text size="2">{message.text}</Text>
                          </div>
                        ))}
                      </div>

                      <div className="composer-row">
                        <button type="button" className="composer-chip" aria-label="Text input">
                          <SendHorizontal size={14} /> Text
                        </button>
                        <button type="button" className="composer-chip" aria-label="Voice input">
                          <Mic size={14} /> Voice
                        </button>
                        <button type="button" className="composer-chip" aria-label="Image input">
                          <Image size={14} /> Image
                        </button>
                      </div>
                    </div>
                  </Card>

                  <Card size="3" className="demo-summary-card">
                    <Heading size="4">{mode.label}</Heading>
                    <Text size="2" className="muted-copy">
                      {mode.summary}
                    </Text>

                    <div className="mode-list">
                      {mode.controls.map((control) => (
                        <div key={control} className="mode-item">
                          <Text size="2">{control}</Text>
                        </div>
                      ))}
                    </div>

                    <Flex gap="2" wrap="wrap">
                      <Button asChild size="2" variant="soft" color="gray">
                        <a href={secondaryCtaHref}>{secondaryCtaLabel}</a>
                      </Button>
                    </Flex>
                  </Card>
                </Grid>
              </Tabs.Content>
            )
          )}
        </Tabs.Root>
      </motion.section>
    </div>
  );
}
