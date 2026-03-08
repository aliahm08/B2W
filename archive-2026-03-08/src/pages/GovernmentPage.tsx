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

export default function GovernmentPage() {
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
          Government
        </Badge>
        <Heading size="7">AI platforms for federal agencies</Heading>
        <Text size="3" className="muted-copy">
          Mission-focused platform design for agencies that require secure communication workflows,
          policy-aligned controls, and explicit governance.
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
              Platform
            </Text>
            <Heading size="5">Control-surface architecture</Heading>
          </div>
          <Text size="2" className="muted-copy compact">
            Security, compliance, and workflow governance are treated as first-class controls.
          </Text>
        </Flex>

        <Grid columns={{ initial: '1', sm: '3' }} gap="3">
          <Card size="2">
            <Heading size="3">Security</Heading>
            <ul className="bullet-list">
              <li>Identity and access boundaries</li>
              <li>Role-based execution controls</li>
              <li>Operational safeguard patterns</li>
            </ul>
          </Card>
          <Card size="2">
            <Heading size="3">Compliance</Heading>
            <ul className="bullet-list">
              <li>Policy mapping workflow</li>
              <li>Review checkpoints</li>
              <li>Audit alignment support</li>
            </ul>
          </Card>
          <Card size="2">
            <Heading size="3">Governance</Heading>
            <ul className="bullet-list">
              <li>Decision-routing model</li>
              <li>Escalation workflow</li>
              <li>Oversight operating view</li>
            </ul>
          </Card>
        </Grid>
      </motion.section>

      <motion.section className="section-card" {...sectionMotion}>
        <Heading size="5">Operational profile</Heading>
        <Grid columns={{ initial: '1', md: '2' }} gap="3">
          <Card size="3">
            <Heading size="3">Communication clarity for critical missions</Heading>
            <Text size="2" className="muted-copy">
              Structure inter-team and inter-agency communication so decisions and handoffs stay explicit.
            </Text>
          </Card>
          <Card size="3">
            <Heading size="3">Governed action orchestration</Heading>
            <Text size="2" className="muted-copy">
              Keep delegated execution inside defined policy and escalation boundaries.
            </Text>
          </Card>
        </Grid>
      </motion.section>
    </div>
  );
}
