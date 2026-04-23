import { ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';
import Seo from '../components/Seo';
import LeadForm from '../components/forms/LeadForm';

type ProcessStage = {
  step: string;
  title: string;
  interactionLabel: string;
  interactionDetail: string;
  description: string;
  points?: string[];
};

const businessAuditPriorities = [
  'High ROI priorities',
  'Google Business Profile',
  'Reviews',
  'Website that converts',
  'Local SEO',
  'Paid ads with tracking',
  'Email / SMS follow-up',
  'Referral systems',
  'Repeat customer offers',
  'Reputation management',
  'Fast response time',
] as const;

const earlyLowPriorities = [
  'Fancy branding',
  'Viral TikToks',
  'Massive follower counts',
  'Complex funnels',
  'Expensive agencies',
  'Posting daily without strategy',
] as const;

const processStages: ProcessStage[] = [
  {
    step: '01',
    title: 'Business Audit',
    interactionLabel: 'Audit Baseline',
    interactionDetail: 'Offer review, channel check, and conversion friction scan.',
    description:
      'Growth marketing starts with finding what is already close to working. We audit the business around the channels, assets, and follow-up systems most likely to produce measurable local revenue.',
    points: [
      'We look for the places where demand is already present but capture is weak.',
      'We prioritize fixes that tighten conversion before adding more traffic.',
      'We separate what matters now from what can wait until the economics support it.',
    ],
  },
  {
    step: '02',
    title: 'Due Diligence',
    interactionLabel: 'Contact Intake',
    interactionDetail: 'Same intake flow as the homepage, adapted for growth work.',
    description:
      'This stage is the intake and qualification step. Once we have your business context, we can review fit, identify the highest-leverage opportunities, and determine the right next working session.',
  },
  {
    step: '03A',
    title: 'Improvement Scoping',
    interactionLabel: 'Growth Plan',
    interactionDetail: 'Channel priorities, offers, tracking, and execution sequence.',
    description:
      'We turn the audit into a scoped plan: what to fix first, what to test, what to track, and which growth levers should stay manual or be systematized.',
    points: [
      'Offer and message adjustments tied to actual customer intent.',
      'Local search, paid acquisition, review generation, and follow-up sequencing.',
      'Tracking setup so spend and response can be evaluated against outcomes.',
    ],
  },
  {
    step: '03B',
    title: 'Contracting with Engineers and Creatives',
    interactionLabel: 'Execution Staffing',
    interactionDetail: 'Specialists matched to the actual growth bottleneck.',
    description:
      'If the work needs landing pages, ad operations, automation, CRM cleanup, creative production, or analytics implementation, we translate scope into the right execution setup.',
  },
  {
    step: '04',
    title: 'Initial Delivery',
    interactionLabel: 'Launch Setup',
    interactionDetail: 'Core fixes shipped with measurable checkpoints.',
    description:
      'The first delivery is focused on getting the revenue path cleaner: stronger conversion surfaces, better tracking, faster follow-up, and the operational pieces needed to support inbound demand.',
  },
  {
    step: '05',
    title: 'Publishing and Monitoring',
    interactionLabel: 'Reporting Loop',
    interactionDetail: 'Performance review, adjustment, and compounding improvements.',
    description:
      'After launch, we monitor response speed, lead quality, booked business, repeat behavior, and channel performance so the system can improve from real signal instead of guesswork.',
  },
];

function PriorityList({
  title,
  eyebrow,
  items,
  tone,
}: {
  title: string;
  eyebrow: string;
  items: readonly string[];
  tone: 'high' | 'low';
}) {
  const toneClasses =
    tone === 'high'
      ? 'border-emerald-200 bg-emerald-50/70'
      : 'border-neutral-200 bg-neutral-50';

  return (
    <div className={`border p-6 md:p-8 ${toneClasses}`}>
      <p className="text-[11px] font-mono uppercase tracking-[0.24em] text-neutral-500">{eyebrow}</p>
      <h3 className="mt-4 text-2xl font-medium tracking-tight text-neutral-950">{title}</h3>
      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {items.map((item) => (
          <div key={item} className="border border-black/10 bg-white px-4 py-4 text-sm text-neutral-800">
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function GrowthMarketingPage() {
  return (
    <>
      <Seo
        title="Growth Marketing | B2W"
        description="B2W growth marketing process focused on business audits, local demand capture, tracking, follow-up systems, and measurable conversion improvements."
      />

      <section className="mx-auto max-w-7xl px-6 pb-18 pt-36 md:pb-24">
        <div className="max-w-5xl">
          <p className="text-xs font-mono uppercase tracking-[0.26em] text-neutral-400">Growth Marketing</p>
          <h1 className="mt-5 max-w-5xl text-5xl font-medium tracking-tight text-neutral-950 md:text-7xl md:leading-[0.92]">
            Growth work for businesses that need better demand capture, not more random marketing activity.
          </h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-neutral-600">
            This page follows the same process structure used on our About page, adapted for growth marketing. The goal
            is to identify what already has revenue potential, tighten conversion and follow-up, and build from signal
            before layering on more complexity.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-20 md:pb-24">
        <div className="grid gap-6">
          {processStages.map((stage, index) => (
            <motion.div
              key={stage.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: index * 0.04 }}
              className="border border-neutral-200 bg-white p-6 md:p-8"
            >
              <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
                <div className="max-w-3xl">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="text-[10px] font-mono uppercase tracking-[0.28em] text-neutral-400">
                      {stage.step}
                    </span>
                    <span className="border border-neutral-300 px-3 py-1 text-[10px] font-mono uppercase tracking-[0.24em] text-neutral-600">
                      {stage.interactionLabel}
                    </span>
                    <span className="text-sm text-neutral-500">{stage.interactionDetail}</span>
                  </div>
                  <h2 className="mt-5 text-3xl font-medium tracking-tight text-neutral-950 md:text-4xl">{stage.title}</h2>
                  <p className="mt-4 text-base leading-8 text-neutral-600 md:text-lg">{stage.description}</p>
                  {stage.points ? (
                    <div className="mt-6 grid gap-3">
                      {stage.points.map((point) => (
                        <div key={point} className="flex items-start gap-3 border-l border-neutral-300 pl-4">
                          <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-neutral-400" />
                          <p className="text-sm leading-7 text-neutral-700">{point}</p>
                        </div>
                      ))}
                    </div>
                  ) : null}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-20 md:pb-24">
        <div className="mb-8 max-w-3xl">
          <p className="text-xs font-mono uppercase tracking-[0.26em] text-neutral-400">Business Audit Focus</p>
          <h2 className="mt-5 text-4xl font-medium tracking-tight text-neutral-950 md:text-5xl">
            What we prioritize first in a growth audit.
          </h2>
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          <PriorityList
            eyebrow="High Priority"
            title="Areas we look for immediately"
            items={businessAuditPriorities}
            tone="high"
          />
          <PriorityList
            eyebrow="Low Priority Early On"
            title="Things we do not over-index on at the beginning"
            items={earlyLowPriorities}
            tone="low"
          />
        </div>
      </section>

      <section id="contact" className="mx-auto max-w-7xl px-5 pb-24 sm:px-6 lg:pb-32">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
          className="border-t border-black pt-10 sm:pt-12 md:pt-16"
        >
          <p className="text-xs font-mono uppercase tracking-[0.26em] text-neutral-400">Due Diligence</p>
          <h2 className="mt-5 mb-4 max-w-[14ch] text-3xl font-medium tracking-tight text-neutral-950 sm:text-4xl">
            Tell us about your business.
          </h2>
          <p className="mb-8 max-w-3xl text-base leading-7 text-neutral-600 sm:text-lg sm:leading-8">
            This is the same intake flow used on the homepage. Once we have the basics, we can review fit, assess the
            growth baseline, and schedule the right next conversation.
          </p>
          <LeadForm
            heading="Due Diligence"
            intro="Share the basic first. Once we have your information, we will schedule a call with you."
            submitLabel="Request a growth review"
            preselectedProjectAreas={['Growth']}
          />
        </motion.div>
      </section>
    </>
  );
}
