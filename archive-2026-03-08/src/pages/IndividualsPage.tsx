import { Badge, Button, Card, Flex, Grid, Heading, Tabs, Text } from '@radix-ui/themes';
import { motion, useReducedMotion, Variants } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  primaryCtaLabel,
  primaryCtaPath,
  secondaryCtaHref,
  secondaryCtaLabel
} from '../content/mission';

const reveal: Variants = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.34, ease: 'easeOut' } }
};

const modeContent = {
  twin: {
    title: 'Digital Twin Mode',
    details: [
      'Batch SOP upload and rule normalization',
      'Preferred tone and response boundaries',
      'Escalation thresholds for high-priority chats'
    ]
  },
  assistant: {
    title: 'Assistant Mode',
    details: [
      'Daily summary of active conversations',
      'Visibility into delegation parameters',
      'Loop-in policy when human review is required'
    ]
  },
  aiMe: {
    title: 'AI Me Mode',
    details: [
      'Delegated responses to inbound requests',
      'Policy-checked answers with traceable decisions',
      'Feedback loop for SOP updates and approvals'
    ]
  }
};

export default function IndividualsPage() {
  const reducedMotion = useReducedMotion();
  const heroMotion = reducedMotion
    ? {}
    : { initial: 'hidden' as const, animate: 'visible' as const, variants: reveal };
  const sectionMotion = reducedMotion
    ? {}
    : {
        initial: 'hidden' as const,
        whileInView: 'visible' as const,
        viewport: { once: true, margin: '-90px' },
        variants: reveal
      };

  return (
    <div className="landing-stack">
      <motion.section className="section-card hero-lite" {...heroMotion}>
        <Badge color="teal" radius="full" size="2" variant="soft">
          Individuals
        </Badge>
        <Heading size="7">AI services for Individuals</Heading>
        <Text size="3" className="muted-copy">
          Built for high-output operators who need clear communication control without manually handling
          every thread.
        </Text>
        <Flex gap="3" wrap="wrap">
          <Button asChild size="3">
            <Link to={primaryCtaPath}>{primaryCtaLabel}</Link>
          </Button>
          <Button asChild size="3" variant="soft" color="gray">
            <a href={secondaryCtaHref}>{secondaryCtaLabel}</a>
          </Button>
        </Flex>
      </motion.section>

      <motion.section className="section-card" {...sectionMotion}>
        <Flex align="end" justify="between" gap="3" wrap="wrap" className="section-head">
          <div>
            <Text size="2" className="eyebrow">
              Workflow
            </Text>
            <Heading size="5">Individual operating modes</Heading>
          </div>
          <Text size="2" className="muted-copy compact">
            Modes map to configuration, active management, and delegated execution.
          </Text>
        </Flex>

        <Tabs.Root defaultValue="assistant" className="mode-tabs">
          <Tabs.List>
            <Tabs.Trigger value="twin">Digital Twin</Tabs.Trigger>
            <Tabs.Trigger value="assistant">Assistant</Tabs.Trigger>
            <Tabs.Trigger value="aiMe">AI Me</Tabs.Trigger>
          </Tabs.List>

          <Tabs.Content value="twin" className="tab-panel">
            <ModeGrid title={modeContent.twin.title} details={modeContent.twin.details} />
          </Tabs.Content>
          <Tabs.Content value="assistant" className="tab-panel">
            <ModeGrid title={modeContent.assistant.title} details={modeContent.assistant.details} />
          </Tabs.Content>
          <Tabs.Content value="aiMe" className="tab-panel">
            <ModeGrid title={modeContent.aiMe.title} details={modeContent.aiMe.details} />
          </Tabs.Content>
        </Tabs.Root>
      </motion.section>

      <motion.section className="section-card" {...sectionMotion}>
        <Heading size="5">Capability scope</Heading>
        <Grid columns={{ initial: '1', sm: '3' }} gap="3">
          <Card size="2">
            <Heading size="3">Communication Optimization</Heading>
            <Text size="2" className="muted-copy">
              Route messages through policy-aware responses and controlled delegation.
            </Text>
          </Card>
          <Card size="2">
            <Heading size="3">Workflow Structuring</Heading>
            <Text size="2" className="muted-copy">
              Convert SOPs into practical behavior rules the assistant can execute against.
            </Text>
          </Card>
          <Card size="2">
            <Heading size="3">Action Coordination</Heading>
            <Text size="2" className="muted-copy">
              Surface decisions and actions in one queue with explicit approval logic.
            </Text>
          </Card>
        </Grid>
      </motion.section>
    </div>
  );
}

type ModeGridProps = {
  title: string;
  details: string[];
};

function ModeGrid({ title, details }: ModeGridProps) {
  return (
    <Grid columns={{ initial: '1', md: '2' }} gap="3" className="mode-grid">
      <Card size="3" className="mode-panel">
        <Heading size="4">{title}</Heading>
        <div className="mode-list">
          {details.map((detail) => (
            <div key={detail} className="mode-item">
              <Text size="2">{detail}</Text>
            </div>
          ))}
        </div>
      </Card>

      <Card size="3" className="mode-preview">
        <Text size="2" weight="medium">
          Demo linkage
        </Text>
        <Text size="2" className="muted-copy">
          The hosted demo includes this mode in a WhatsApp-style interface with text, voice, and image
          inputs.
        </Text>
        <Button asChild size="2" variant="soft" color="gray">
          <Link to="/demo">Open mode in demo</Link>
        </Button>
      </Card>
    </Grid>
  );
}
