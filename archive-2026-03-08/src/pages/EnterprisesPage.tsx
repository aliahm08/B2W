import { Badge, Button, Card, Flex, Grid, Heading, Text } from '@radix-ui/themes';
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

export default function EnterprisesPage() {
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
          Enterprises
        </Badge>
        <Heading size="7">AI consulting for enterprise clients</Heading>
        <Text size="3" className="muted-copy">
          B2W partners with enterprise teams to shape AI operating models, architecture decisions, and
          controlled rollout plans.
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
              Lifecycle
            </Text>
            <Heading size="5">Consulting operating structure</Heading>
          </div>
          <Text size="2" className="muted-copy compact">
            Strategy, architecture, and integration are handled as one delivery system.
          </Text>
        </Flex>

        <Grid columns={{ initial: '1', sm: '3' }} gap="3">
          <Card size="2">
            <Heading size="3">Strategy</Heading>
            <ul className="bullet-list">
              <li>Operating model assessment</li>
              <li>Priority selection framework</li>
              <li>Adoption sequencing</li>
            </ul>
          </Card>
          <Card size="2">
            <Heading size="3">Architecture</Heading>
            <ul className="bullet-list">
              <li>System boundary definition</li>
              <li>Workflow and data mapping</li>
              <li>Integration planning</li>
            </ul>
          </Card>
          <Card size="2">
            <Heading size="3">Integration</Heading>
            <ul className="bullet-list">
              <li>Execution track design</li>
              <li>Governance and control checks</li>
              <li>Operational handoff model</li>
            </ul>
          </Card>
        </Grid>
      </motion.section>

      <motion.section className="section-card" {...sectionMotion}>
        <Heading size="5">Delivery emphasis</Heading>
        <Grid columns={{ initial: '1', md: '2' }} gap="3">
          <Card size="3">
            <Heading size="3">Business-critical communication lanes</Heading>
            <Text size="2" className="muted-copy">
              Prioritize high-impact communication pathways where action latency and clarity directly affect
              performance.
            </Text>
          </Card>
          <Card size="3">
            <Heading size="3">Actionable operational insight</Heading>
            <Text size="2" className="muted-copy">
              Convert distributed message streams into clear decisions, review checkpoints, and tracked
              execution.
            </Text>
          </Card>
        </Grid>
      </motion.section>
    </div>
  );
}
