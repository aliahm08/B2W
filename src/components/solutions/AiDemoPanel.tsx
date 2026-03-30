import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { BarChart3, Mic, MessageSquareText } from 'lucide-react';
import type { AiDemoMode } from '../../content/aiSolutions';

function formatCurrency(value: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value);
}

function DemoShell({
  title,
  subtitle,
  badge,
  icon,
  dark,
  children,
}: {
  title: string;
  subtitle: string;
  badge: string;
  icon: React.ReactNode;
  dark?: boolean;
  children: React.ReactNode;
}) {
  return (
    <section
      className={`relative overflow-hidden rounded-[30px] p-5 md:p-6 ${
        dark
          ? 'bg-[linear-gradient(180deg,rgba(18,24,34,0.86)_0%,rgba(11,16,22,0.88)_100%)] text-white'
          : 'bg-[linear-gradient(180deg,rgba(255,255,255,0.96)_0%,rgba(239,245,255,0.92)_100%)] text-black'
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <span className={`${dark ? 'text-white' : 'text-neutral-950'}`}>{icon}</span>
          <div>
            <p className={`text-sm font-medium ${dark ? 'text-white' : 'text-neutral-950'}`}>{title}</p>
            <p className={`mt-1 text-xs ${dark ? 'text-neutral-500' : 'text-neutral-500'}`}>{subtitle}</p>
          </div>
        </div>
        <span
          className={`text-[10px] uppercase tracking-[0.18em] ${
            dark
              ? 'text-emerald-300/80'
              : 'text-neutral-500'
          }`}
        >
          {badge}
        </span>
      </div>
      <div className="mt-5">{children}</div>
    </section>
  );
}

function StatTile({
  label,
  value,
  dark,
}: {
  label: string;
  value: string;
  dark?: boolean;
}) {
  return (
    <div
      className={`rounded-[22px] p-4 ${
        dark
          ? 'bg-white/[0.045]'
          : 'bg-white/70'
      }`}
    >
      <p className={`text-[11px] uppercase tracking-[0.18em] ${dark ? 'text-neutral-500' : 'text-neutral-500'}`}>{label}</p>
      <p className={`mt-2 text-xl font-medium tracking-tight ${dark ? 'text-white' : 'text-neutral-950'}`}>{value}</p>
    </div>
  );
}

function ChatBubble({
  children,
  tone = 'dark',
  delay = 0,
}: {
  children: React.ReactNode;
  tone?: 'dark' | 'light';
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className={`max-w-[88%] rounded-[26px] px-4 py-3 text-[13px] leading-6 md:px-5 md:py-4 md:text-sm md:leading-7 ${
        tone === 'dark'
          ? 'bg-[linear-gradient(135deg,#1a2330_0%,#111821_100%)] text-neutral-200'
          : 'ml-auto bg-[linear-gradient(135deg,#ffffff_0%,#dfe8ff_100%)] text-black'
      }`}
    >
      {children}
    </motion.div>
  );
}

function ChatbotsDemo() {
  return (
    <div className="grid gap-4 xl:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)]">
      <DemoShell
        dark
        title="Chat session"
        subtitle="Customer intake becomes structured job context"
        badge="Active thread"
        icon={<MessageSquareText className="h-4 w-4" />}
      >
        <div className="space-y-3">
          <ChatBubble>I need a rough estimate for a six-camera install and after-hours mobile alerts.</ChatBubble>
          <ChatBubble tone="light" delay={0.08}>
            I can collect the site details, prepare a starting estimate, and route this to the right workflow.
          </ChatBubble>
          <ChatBubble delay={0.16}>
            Existing wiring works in the front. The rear entrance needs new conduit and weekend scheduling.
          </ChatBubble>
        </div>
        <div className="mt-5 rounded-[22px] bg-white/[0.045] p-4">
          <p className="text-[11px] uppercase tracking-[0.18em] text-neutral-500">Detected intent</p>
          <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-xs text-neutral-300">
            {['Commercial install', 'Weekend work', 'Conduit needed', 'Estimate request'].map((item) => (
              <span key={item}>
                {item}
              </span>
            ))}
          </div>
        </div>
      </DemoShell>

      <DemoShell
        title="Workflow response"
        subtitle="The conversation updates downstream systems"
        badge="Queued actions"
        icon={<MessageSquareText className="h-4 w-4" />}
      >
        <div className="grid gap-3 md:grid-cols-3">
          {[
            ['Lead type', 'Commercial install'],
            ['Estimated range', '$20k-$25k'],
            ['Next step', 'Site visit requested'],
          ].map(([label, value]) => (
            <StatTile key={label} label={label} value={value} />
          ))}
        </div>
        <div className="mt-4 rounded-[22px] bg-white/72 p-4">
          <p className="text-[11px] uppercase tracking-[0.18em] text-neutral-500">System output</p>
          <ul className="mt-3 space-y-2 text-sm leading-7 text-neutral-700">
            <li>Scope captured and tagged in CRM</li>
            <li>Weekend scheduling added to the project record</li>
            <li>Estimation workflow opened with the right assumptions</li>
          </ul>
        </div>
      </DemoShell>
    </div>
  );
}

function EstimationsDemo() {
  const [units, setUnits] = useState(6);
  const [hours, setHours] = useState(32);
  const materialCost = 850 + units * 1500;
  const laborCost = hours * 180;
  const targetSellPrice = Math.round((materialCost + laborCost) * 1.42);
  const expectedProfit = targetSellPrice - materialCost - laborCost;

  return (
    <div className="grid gap-4 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
      <DemoShell
        dark
        title="Estimation inputs"
        subtitle="Business-specific assumptions shape the quote"
        badge="Pricing logic"
        icon={<BarChart3 className="h-4 w-4" />}
      >
        <div className="space-y-4">
          <div className="rounded-[22px] bg-white/[0.045] p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-white">Units</p>
              <p className="text-sm font-medium text-white">{units} cameras</p>
            </div>
            <input
              type="range"
              min={2}
              max={12}
              step={1}
              value={units}
              onChange={(event) => setUnits(Number(event.target.value))}
              className="mt-4 w-full accent-sky-300"
            />
          </div>
          <div className="rounded-[22px] bg-white/[0.045] p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-white">Labor</p>
              <p className="text-sm font-medium text-white">{hours} hours</p>
            </div>
            <input
              type="range"
              min={12}
              max={60}
              step={2}
              value={hours}
              onChange={(event) => setHours(Number(event.target.value))}
              className="mt-4 w-full accent-teal-300"
            />
          </div>
          <div className="rounded-[22px] bg-white/[0.045] p-4">
            <p className="text-[11px] uppercase tracking-[0.18em] text-neutral-500">Assumptions</p>
            <p className="mt-3 text-sm leading-7 text-neutral-300">
              Weekend scheduling, rear conduit work, mobile alerts, and field-access coordination included.
            </p>
          </div>
        </div>
      </DemoShell>

      <DemoShell
        dark
        title="Commercial output"
        subtitle="The model returns a quote that is margin-aware"
        badge="Confidence 0.86"
        icon={<BarChart3 className="h-4 w-4" />}
      >
        <div className="grid gap-3 md:grid-cols-2">
          {[
            ['Material cost', formatCurrency(materialCost)],
            ['Labor cost', formatCurrency(laborCost)],
            ['Target sell price', formatCurrency(targetSellPrice)],
            ['Expected gross profit', formatCurrency(expectedProfit)],
          ].map(([label, value]) => (
            <motion.div key={label} layout>
              <StatTile label={label} value={value} dark />
            </motion.div>
          ))}
        </div>
        <div className="mt-4 rounded-[22px] bg-white/[0.045] p-4">
          <p className="text-[11px] uppercase tracking-[0.18em] text-neutral-500">Actions</p>
          <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-sm text-neutral-300">
            {['Send estimate', 'Export worksheet', 'Create follow-up task'].map((item) => (
              <span key={item}>
                {item}
              </span>
            ))}
          </div>
        </div>
      </DemoShell>
    </div>
  );
}

function FinancialModelsDemo() {
  const [monthlyRevenue, setMonthlyRevenue] = useState(118000);
  const [grossMargin, setGrossMargin] = useState(54);
  const [laborLoad, setLaborLoad] = useState(31);
  const grossProfit = monthlyRevenue * (grossMargin / 100);
  const laborCost = monthlyRevenue * (laborLoad / 100);
  const operatingProfit = grossProfit - laborCost - 8600;
  const modeledRevenue = Math.round(monthlyRevenue * 1.123);

  return (
    <div className="grid gap-4 xl:grid-cols-[minmax(0,1.02fr)_minmax(0,0.98fr)]">
      <DemoShell
        title="Financial model"
        subtitle="Scenario inputs reshape the economics live"
        badge="Scenario B"
        icon={<BarChart3 className="h-4 w-4" />}
      >
        <div className="grid gap-4">
          {[
            ['Monthly revenue', monthlyRevenue, 60000, 220000, 5000, setMonthlyRevenue, '$'],
            ['Gross margin', grossMargin, 35, 72, 1, setGrossMargin, '%'],
            ['Labor load', laborLoad, 12, 45, 1, setLaborLoad, '%'],
          ].map(([label, value, min, max, step, setter, suffix]) => (
            <div key={label} className="rounded-[22px] bg-white/72 p-4">
              <div className="flex items-center justify-between gap-4">
                <p className="text-sm font-medium text-neutral-900">{label}</p>
                <p className="text-sm font-medium text-neutral-950">
                  {suffix === '$' ? formatCurrency(value as number) : `${value}${suffix}`}
                </p>
              </div>
              <input
                type="range"
                min={min as number}
                max={max as number}
                step={step as number}
                value={value as number}
                onChange={(event) => (setter as (value: number) => void)(Number(event.target.value))}
                className="mt-4 w-full accent-sky-400"
              />
            </div>
          ))}
        </div>
        <div className="mt-4 overflow-hidden rounded-[22px] bg-white/72">
          <table className="min-w-full divide-y divide-neutral-200 text-left text-sm">
            <thead className="bg-neutral-50 text-neutral-500">
              <tr>
                <th className="px-4 py-3 font-medium">Line item</th>
                <th className="px-4 py-3 font-medium">Current</th>
                <th className="px-4 py-3 font-medium">Modeled</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200 bg-white text-neutral-800">
              {[
                ['Monthly revenue', formatCurrency(monthlyRevenue), formatCurrency(modeledRevenue)],
                ['Gross profit', formatCurrency(grossProfit), formatCurrency(modeledRevenue * ((grossMargin + 4) / 100))],
                ['Labor cost', formatCurrency(laborCost), formatCurrency(modeledRevenue * ((laborLoad - 3) / 100))],
                ['Operating profit', formatCurrency(operatingProfit), formatCurrency(operatingProfit + 13600)],
              ].map(([label, current, modeled]) => (
                <tr key={label}>
                  <td className="px-4 py-3">{label}</td>
                  <td className="px-4 py-3">{current}</td>
                  <td className="px-4 py-3 font-medium text-neutral-950">{modeled}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </DemoShell>

      <DemoShell
        dark
        title="Decision layer"
        subtitle="The numbers are turned into a practical recommendation"
        badge="Recommendation"
        icon={<BarChart3 className="h-4 w-4" />}
      >
        <div className="space-y-4">
          <div className="rounded-[22px] bg-white/[0.045] p-4">
            <p className="text-[11px] uppercase tracking-[0.18em] text-neutral-500">Recommendation</p>
            <p className="mt-3 text-base font-medium leading-7 text-white md:text-lg">
              Reprice low-margin bundles and consolidate weekend labor before adding new paid demand.
            </p>
          </div>
          <div className="rounded-[22px] bg-white/[0.045] p-4">
            <p className="text-[11px] uppercase tracking-[0.18em] text-neutral-500">Expected effect</p>
            <ul className="mt-3 space-y-2 text-sm leading-7 text-neutral-300">
              <li>Modeled revenue lift to {formatCurrency(modeledRevenue)}</li>
              <li>Gross margin improvement from {grossMargin}% to {grossMargin + 4}%</li>
              <li>Operating profit lift of {formatCurrency(13600)}</li>
            </ul>
          </div>
        </div>
      </DemoShell>
    </div>
  );
}

function VoiceToPlanDemo() {
  const bars = [18, 34, 26, 44, 22, 31, 17, 38, 24, 42, 19, 29];

  return (
    <div className="grid gap-4 xl:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)]">
      <DemoShell
        dark
        title="Field recording"
        subtitle="Spoken context becomes structured intake"
        badge="Processing"
        icon={<Mic className="h-4 w-4" />}
      >
        <div className="rounded-[22px] bg-white/[0.045] px-4 py-4">
          <div className="flex h-16 items-end gap-1">
            {bars.map((height, index) => (
              <motion.span
                key={index}
                className="w-2 rounded-full bg-white/80"
                animate={{ height: [Math.max(10, height - 8), height, Math.max(12, height - 5)] }}
                transition={{ duration: 1.6, repeat: Infinity, delay: index * 0.06, ease: 'easeInOut' }}
                style={{ height }}
              />
            ))}
          </div>
        </div>
        <div className="mt-4 rounded-[22px] bg-white/[0.045] p-4 text-sm leading-7 text-neutral-300">
          "Customer wants six cameras, front-door access control, and after-hours mobile alerts. Existing wiring works
          in front, rear entrance needs new conduit. They want the job staged over two weekends."
        </div>
      </DemoShell>

      <DemoShell
        title="Calculated output"
        subtitle="The recording becomes an estimate-ready plan"
        badge="Ready to export"
        icon={<Mic className="h-4 w-4" />}
      >
        <div className="grid gap-3 md:grid-cols-3">
          {[
            ['Estimated project', '$23,400'],
            ['Gross margin', '41%'],
            ['Install duration', '2 weekends'],
          ].map(([label, value]) => (
            <StatTile key={label} label={label} value={value} />
          ))}
        </div>
        <div className="mt-4 rounded-[22px] bg-white/72 p-4">
          <p className="text-[11px] uppercase tracking-[0.18em] text-neutral-500">Plan export</p>
          <ul className="mt-3 space-y-2 text-sm leading-7 text-neutral-700">
            <li>Scope broken into equipment, labor, wiring, and contingency</li>
            <li>Weekend deployment sequence generated for the crew</li>
            <li>Financing option flagged for the sales follow-up</li>
          </ul>
        </div>
      </DemoShell>
    </div>
  );
}

export default function AiDemoPanel({ mode }: { mode: AiDemoMode }) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={mode}
        initial={{ opacity: 0, y: 12, filter: 'blur(8px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        exit={{ opacity: 0, y: -8, filter: 'blur(8px)' }}
        transition={{ duration: 0.34, ease: [0.22, 1, 0.36, 1] }}
      >
        {mode === 'chatbots' ? (
          <ChatbotsDemo />
        ) : mode === 'estimations' ? (
          <EstimationsDemo />
        ) : mode === 'financial-models' ? (
          <FinancialModelsDemo />
        ) : (
          <VoiceToPlanDemo />
        )}
      </motion.div>
    </AnimatePresence>
  );
}
