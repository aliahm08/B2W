import { Badge, Button, Card, Flex, Grid, Heading, Text } from '@radix-ui/themes';
import { motion, useReducedMotion, Variants } from 'framer-motion';
import { ArrowRight, Building2, Landmark, UserRound } from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  audiencePillars,
  primaryCtaLabel,
  primaryCtaPath,
  productDescription,
  productName,
  secondaryCtaHref,
  secondaryCtaLabel,
  siteName
} from '../content/mission';

const reveal: Variants = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.34, ease: 'easeOut' } }
};

const audienceIcons = {
  Individuals: UserRound,
  Enterprises: Building2,
  Government: Landmark
};

export default function HomePage() {
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
      <motion.section className="hero-card" {...heroMotion}>
        <div className="hero-copy">
          <Badge color="teal" radius="full" size="2" variant="soft">
            {siteName}
          </Badge>
          <Heading size="8" className="hero-title">
            AI communication infrastructure for operating teams.
          </Heading>
          <Text size="4" className="muted-copy">
            {productDescription}
          </Text>

          <Flex gap="3" wrap="wrap">
            <Button asChild size="3">
              <Link to={primaryCtaPath}>{primaryCtaLabel}</Link>
            </Button>
            <Button asChild size="3" variant="soft" color="gray">
              <a href={secondaryCtaHref}>{secondaryCtaLabel}</a>
            </Button>
          </Flex>
        </div>

        <Card className="hero-surface" size="3">
          <Text size="2" weight="medium" className="surface-label">
            {productName} Operating Surface
          </Text>
          <div className="surface-lines">
            <div className="surface-line">
              <Text size="2">Signal Intake</Text>
              <Badge radius="full" variant="surface" color="gray">
                Live
              </Badge>
            </div>
            <div className="surface-line">
              <Text size="2">Policy Routing</Text>
              <Badge radius="full" variant="surface" color="gray">
                Managed
              </Badge>
            </div>
            <div className="surface-line">
              <Text size="2">Action Queue</Text>
              <Badge radius="full" variant="surface" color="gray">
                Ready
              </Badge>
            </div>
            <div className="surface-line">
              <Text size="2">Executive Summary</Text>
              <Badge radius="full" variant="surface" color="gray">
                Continuous
              </Badge>
            </div>
          </div>
        </Card>
      </motion.section>

      <motion.section className="section-card" {...sectionMotion}>
        <Flex align="end" justify="between" gap="3" wrap="wrap" className="section-head">
          <div>
            <Text size="2" className="eyebrow">
              Product
            </Text>
            <Heading size="5">How RelayOS operates</Heading>
          </div>
          <Text size="2" className="muted-copy compact">
            Structured components. Clear ownership. No synthetic reporting.
          </Text>
        </Flex>

        <Grid columns={{ initial: '1', sm: '3' }} gap="3">
          <Card size="2" className="feature-card">
            <Heading size="3">Capture</Heading>
            <Text size="2" className="muted-copy">
              Connect communication streams and workflow context into one operational plane.
            </Text>
          </Card>
          <Card size="2" className="feature-card">
            <Heading size="3">Coordinate</Heading>
            <Text size="2" className="muted-copy">
              Apply role-aware policy and escalation logic before action is delegated.
            </Text>
          </Card>
          <Card size="2" className="feature-card">
            <Heading size="3">Execute</Heading>
            <Text size="2" className="muted-copy">
              Route execution-ready actions with explicit approval boundaries.
            </Text>
          </Card>
        </Grid>
      </motion.section>

      <motion.section className="section-card" {...sectionMotion}>
        <Flex align="end" justify="between" gap="3" wrap="wrap" className="section-head">
          <div>
            <Text size="2" className="eyebrow">
              Solutions
            </Text>
            <Heading size="5">Audience-specific pathways</Heading>
          </div>
          <Button asChild variant="soft" color="gray" size="2">
            <Link to={primaryCtaPath}>Open demo</Link>
          </Button>
        </Flex>

        <Grid columns={{ initial: '1', md: '3' }} gap="3">
          {audiencePillars.map((pillar) => {
            const Icon = audienceIcons[pillar.title];

            return (
              <Card key={pillar.title} size="3" className="audience-card">
                <Flex align="center" gap="2" mb="2">
                  <Icon size={16} />
                  <Text size="2" weight="medium">
                    {pillar.title}
                  </Text>
                </Flex>
                <Text size="2" className="muted-copy">
                  {pillar.statement}
                </Text>
                <Button asChild variant="ghost" size="2" className="audience-link">
                  <Link to={pillar.path}>
                    View pathway <ArrowRight size={14} />
                  </Link>
                </Button>
              </Card>
            );
          })}
        </Grid>
      </motion.section>
    </div>
  );
}
