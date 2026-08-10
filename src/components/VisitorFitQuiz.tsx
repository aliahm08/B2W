import { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, ArrowRight, Check, ExternalLink, RotateCcw, X } from 'lucide-react';
import { Link } from 'react-router-dom';

type BusinessSize = 'micro' | 'small' | 'mid' | 'large';
type BusinessType = 'general-contracting' | 'food-and-beverage' | 'real-estate' | 'engineering' | 'other';
type Goal = 'find-context' | 'scope-estimate' | 'manage-operations' | 'grow-efficiently';
type Tool = 'whatsapp' | 'email' | 'spreadsheets' | 'project-management' | 'crm-operations' | 'verbal';

const steps = ['Business size', 'Business type', 'Primary goal', 'Current tools', 'Recommendation'] as const;

const sizeOptions: Array<{ id: BusinessSize; label: string; detail: string; people: number }> = [
  { id: 'micro', label: '1–5 people', detail: 'Owner-led or very small operating team', people: 3 },
  { id: 'small', label: '6–20 people', detail: 'Growing team with shared responsibilities', people: 12 },
  { id: 'mid', label: '21–75 people', detail: 'Several crews, functions, or locations', people: 40 },
  { id: 'large', label: '76+ people', detail: 'Multi-team or portfolio operation', people: 90 },
];

const typeOptions: Array<{ id: BusinessType; label: string }> = [
  { id: 'general-contracting', label: 'General contracting, trades, or AEC' },
  { id: 'food-and-beverage', label: 'Food and beverage' },
  { id: 'real-estate', label: 'Real estate or property management' },
  { id: 'engineering', label: 'Engineering or professional services' },
  { id: 'other', label: 'Another operating business' },
];

const goalOptions: Array<{ id: Goal; label: string; detail: string }> = [
  { id: 'find-context', label: 'Find information faster', detail: 'Decisions, requests, and updates are buried in work communication.' },
  { id: 'scope-estimate', label: 'Prepare scopes and estimates', detail: 'Project inputs take too long to turn into structured, reviewable documents.' },
  { id: 'manage-operations', label: 'Coordinate jobs or locations', detail: 'Ownership, progress, exceptions, and reporting are hard to see together.' },
  { id: 'grow-efficiently', label: 'Grow without adding the same overhead', detail: 'The team needs repeatable workflows and better handoffs before it scales.' },
];

const toolOptions: Array<{ id: Tool; label: string }> = [
  { id: 'whatsapp', label: 'WhatsApp or group texts' },
  { id: 'email', label: 'Email' },
  { id: 'spreadsheets', label: 'Spreadsheets' },
  { id: 'project-management', label: 'Project-management software' },
  { id: 'crm-operations', label: 'CRM, POS, or property software' },
  { id: 'verbal', label: 'Calls, meetings, and verbal handoffs' },
];

const industryRoute: Record<BusinessType, string> = {
  'general-contracting': '/industries/general-contracting',
  'food-and-beverage': '/industries/food-and-beverage',
  'real-estate': '/industries/real-estate-management',
  engineering: '/industries/general-contracting',
  other: '/solutions/business-use-cases',
};

const industryName: Record<BusinessType, string> = {
  'general-contracting': 'contracting business',
  'food-and-beverage': 'food and beverage operation',
  'real-estate': 'real estate operation',
  engineering: 'engineering or professional-services firm',
  other: 'operating business',
};

export default function VisitorFitQuiz({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [step, setStep] = useState(0);
  const [size, setSize] = useState<BusinessSize | null>(null);
  const [businessType, setBusinessType] = useState<BusinessType | null>(null);
  const [goal, setGoal] = useState<Goal | null>(null);
  const [tools, setTools] = useState<Tool[]>([]);

  useEffect(() => {
    if (!isOpen) return undefined;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, onClose]);

  const reset = () => {
    setStep(0);
    setSize(null);
    setBusinessType(null);
    setGoal(null);
    setTools([]);
  };

  const recommendation = useMemo(() => {
    if (!size || !businessType || !goal || tools.length === 0) return null;
    const team = sizeOptions.find((option) => option.id === size)?.people ?? 3;
    const communicationHeavy = tools.some((tool) => tool === 'whatsapp' || tool === 'email' || tool === 'verbal');
    const fragmentationFactor = Math.min(1.35, 1 + Math.max(0, tools.length - 2) * 0.08);
    const goalFactor = goal === 'find-context' ? 0.72 : goal === 'grow-efficiently' ? 0.55 : 0.38;
    const monthlyHours = Math.min(120, Math.max(7, Math.round(team * goalFactor * 4.33 * fragmentationFactor)));
    const lowHours = Math.max(5, Math.round(monthlyHours * 0.75));
    const highHours = Math.round(monthlyHours * 1.25);
    const monthlyValue = monthlyHours * 45;
    const annualInvestment = 2000 + 99 * 12;
    const annualMultiple = Math.max(0, (monthlyValue * 12) / annualInvestment);
    const recommendJason = communicationHeavy || goal === 'find-context' || goal === 'grow-efficiently';
    const recommendClara = goal === 'scope-estimate' || tools.includes('verbal') || tools.includes('spreadsheets');
    const recommendWorkflow = goal === 'manage-operations' || goal === 'grow-efficiently';
    const claraHours = Math.max(5, Math.min(40, Math.round(team * (goal === 'scope-estimate' ? 0.55 : 0.25))));

    return { lowHours, highHours, monthlyValue, annualMultiple, recommendJason, recommendClara, recommendWorkflow, claraHours };
  }, [businessType, goal, size, tools]);

  if (!isOpen) return null;

  const canContinue = step === 0 ? Boolean(size) : step === 1 ? Boolean(businessType) : step === 2 ? Boolean(goal) : step === 3 ? tools.length > 0 : true;
  const toggleTool = (tool: Tool) => setTools((current) => current.includes(tool) ? current.filter((item) => item !== tool) : [...current, tool]);

  return (
    <div className="fixed inset-0 z-[100] overflow-y-auto bg-[#0d120f]/72 p-3 backdrop-blur-xl sm:p-6" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <section role="dialog" aria-modal="true" aria-labelledby="visitor-fit-title" className="mx-auto my-4 flex min-h-[calc(100svh-2rem)] w-full max-w-5xl flex-col overflow-hidden rounded-[12px] border border-white/15 bg-[#f6f3eb] text-[#141714] shadow-[0_36px_120px_rgba(0,0,0,.34)] sm:my-8 sm:min-h-[min(48rem,calc(100svh-4rem))]">
        <header className="flex items-center justify-between gap-5 border-b border-black/10 px-5 py-4 sm:px-7">
          <div><p className="font-mono text-[9px] font-semibold uppercase tracking-[.2em] text-[#426149]">B2W solution finder</p><h2 id="visitor-fit-title" className="mt-1 text-lg font-semibold">Find a practical starting point</h2></div>
          <button type="button" onClick={onClose} aria-label="Close solution finder" className="grid h-11 w-11 place-items-center rounded-[8px] border border-black/12 bg-white transition hover:bg-black hover:text-white"><X className="h-5 w-5" /></button>
        </header>

        <div className="grid flex-1 lg:grid-cols-[15rem_1fr]">
          <aside className="border-b border-black/10 bg-[#e8ece2] p-5 lg:border-b-0 lg:border-r lg:p-7">
            <ol className="grid grid-cols-5 gap-2 lg:grid-cols-1 lg:gap-3">
              {steps.map((label, index) => <li key={label} className={`flex items-center gap-3 text-xs font-semibold ${index === step ? 'text-[#141714]' : index < step ? 'text-[#426149]' : 'text-black/35'}`}><span className={`grid h-7 w-7 shrink-0 place-items-center rounded-full text-[10px] ${index === step ? 'bg-[#141714] text-white' : index < step ? 'bg-[#426149] text-white' : 'bg-white/70'}`}>{index < step ? <Check className="h-3.5 w-3.5" /> : index + 1}</span><span className="hidden lg:inline">{label}</span></li>)}
            </ol>
            <p className="mt-8 hidden text-xs leading-6 text-black/48 lg:block">This recommendation is directional. B2W confirms sources, workflow fit, controls, and measurable value before implementation.</p>
          </aside>

          <div className="flex min-h-[32rem] flex-col p-5 sm:p-8 lg:p-10">
            {step === 0 ? <QuizQuestion title="How large is the operating team?" intro="Choose the range closest to the people coordinating day-to-day work."><div className="grid gap-3 sm:grid-cols-2">{sizeOptions.map((option) => <OptionButton key={option.id} selected={size === option.id} label={option.label} detail={option.detail} onClick={() => setSize(option.id)} />)}</div></QuizQuestion> : null}
            {step === 1 ? <QuizQuestion title="What kind of business are you operating?" intro="This shapes the examples, industry page, and likely first workflow."><div className="grid gap-3">{typeOptions.map((option) => <OptionButton key={option.id} selected={businessType === option.id} label={option.label} onClick={() => setBusinessType(option.id)} />)}</div></QuizQuestion> : null}
            {step === 2 ? <QuizQuestion title="What should your current tools do better?" intro="Choose the outcome that matters most right now."><div className="grid gap-3 sm:grid-cols-2">{goalOptions.map((option) => <OptionButton key={option.id} selected={goal === option.id} label={option.label} detail={option.detail} onClick={() => setGoal(option.id)} />)}</div></QuizQuestion> : null}
            {step === 3 ? <QuizQuestion title="Where does the team work today?" intro="Select every tool or channel that holds important operating context."><div className="grid gap-3 sm:grid-cols-2">{toolOptions.map((option) => <OptionButton key={option.id} selected={tools.includes(option.id)} label={option.label} onClick={() => toggleTool(option.id)} />)}</div></QuizQuestion> : null}
            {step === 4 && recommendation && businessType && goal ? (
              <div>
                <p className="font-mono text-[9px] font-semibold uppercase tracking-[.18em] text-[#426149]">Your starting recommendation</p>
                <h3 className="mt-4 max-w-2xl text-4xl font-semibold leading-[1.02] tracking-[-.045em] sm:text-5xl">Start with the information and handoff problem inside your {industryName[businessType]}.</h3>
                <div className="mt-8 grid gap-4 md:grid-cols-2">
                  {recommendation.recommendJason ? <RecommendationCard status="Available now" title="JasonAI · The Admin" body={`Because your team uses ${tools.length} operating channels and wants to ${goal === 'find-context' ? 'find context faster' : 'reduce coordination overhead'}, JasonAI can provide a focused first step: search approved WhatsApp work-group communication and return concise, reviewable answers.`} to="/jasonai" cta="Explore JasonAI" /> : null}
                  {recommendation.recommendClara ? <RecommendationCard status="Concept phase" title="Clara · The Expert" body={`Your selections point to repeated project inputs that need more structure. Clara is designed to turn notes, requirements, quantities, and assumptions into editable scopes and estimate drafts. It is not yet available or priced.`} to="/clara" cta="Explore Clara" /> : null}
                  {recommendation.recommendWorkflow ? <RecommendationCard status="Scoped with B2W" title="AI workflow design" body="Map one repeated handoff around the systems you already use, including approved sources, owners, review points, exceptions, and a measurable result before expanding." to="/solutions/ai-workflows" cta="See AI workflows" /> : null}
                  <RecommendationCard status="Industry context" title="Your solution page" body="See the common operating conditions, possible workflows, and product roles for businesses like yours." to={industryRoute[businessType]} cta="Open the relevant solution" />
                </div>

                <div className="mt-5 rounded-[10px] bg-[#141714] p-6 text-white sm:p-7">
                  <div className="grid gap-6 md:grid-cols-[1fr_auto] md:items-end">
                    <div><p className="font-mono text-[9px] font-semibold uppercase tracking-[.16em] text-[#9fd4ae]">Illustrative JasonAI time-value model</p><p className="mt-3 text-3xl font-semibold">{recommendation.lowHours}–{recommendation.highHours} hours/month</p><p className="mt-2 max-w-xl text-sm leading-6 text-white/55">Potential time recovered from communication search and summary work, based on team size, goals, and channel count. At an assumed $45/hour, the midpoint represents about ${recommendation.monthlyValue.toLocaleString()}/month in time value.</p></div>
                    <div className="md:text-right"><p className="text-3xl font-semibold">{recommendation.annualMultiple.toFixed(1)}×</p><p className="text-xs text-white/45">illustrative first-year value / price</p></div>
                  </div>
                  <div className="mt-5 grid gap-3 border-t border-white/12 pt-5 text-xs leading-5 text-white/55 sm:grid-cols-2"><p>JasonAI standard pricing: $99/month plus $2,000 one-time setup.</p><p>Estimate is not guaranteed and excludes billing recovery, prevented errors, automation, and future capabilities.</p></div>
                  {recommendation.recommendClara ? <p className="mt-4 border-t border-white/12 pt-4 text-xs leading-5 text-white/55">Clara could target roughly {recommendation.claraHours} hours/month of scope and document-preparation effort for a team this size, but no ROI multiple is shown because Clara is a concept and has no available price.</p> : null}
                </div>

                <div className="mt-6 flex flex-col gap-3 sm:flex-row"><a href="https://calendly.com/b2w-ai-info/30min?hide_event_type_details=1&hide_gdpr_banner=1&primary_color=b24a24" target="_blank" rel="noreferrer" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-[8px] bg-[#b24a24] px-6 text-sm font-semibold text-white">Book a demo <ExternalLink className="h-4 w-4" /></a><Link to="/pricing" onClick={onClose} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-[8px] border border-black/15 bg-white px-6 text-sm font-semibold">Review pricing and ROI <ArrowRight className="h-4 w-4" /></Link></div>
              </div>
            ) : null}

            <div className="mt-auto flex items-center justify-between gap-4 border-t border-black/10 pt-6">
              {step > 0 ? <button type="button" onClick={() => setStep((current) => Math.max(0, current - 1))} className="inline-flex min-h-11 items-center gap-2 rounded-[8px] px-4 text-sm font-semibold hover:bg-black/5"><ArrowLeft className="h-4 w-4" />Back</button> : <button type="button" onClick={reset} className="inline-flex min-h-11 items-center gap-2 rounded-[8px] px-4 text-sm font-semibold text-black/45 hover:bg-black/5"><RotateCcw className="h-4 w-4" />Reset</button>}
              {step < 4 ? <button type="button" disabled={!canContinue} onClick={() => setStep((current) => Math.min(4, current + 1))} className="inline-flex min-h-11 items-center gap-2 rounded-[8px] bg-[#141714] px-5 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-35">{step === 3 ? 'Build recommendation' : 'Continue'}<ArrowRight className="h-4 w-4" /></button> : <button type="button" onClick={reset} className="inline-flex min-h-11 items-center gap-2 rounded-[8px] border border-black/15 bg-white px-5 text-sm font-semibold"><RotateCcw className="h-4 w-4" />Start over</button>}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function QuizQuestion({ title, intro, children }: { title: string; intro: string; children: React.ReactNode }) {
  return <div><p className="font-mono text-[9px] font-semibold uppercase tracking-[.18em] text-[#426149]">Tell us about the work</p><h3 className="mt-4 text-3xl font-semibold tracking-[-.04em] sm:text-4xl">{title}</h3><p className="mb-7 mt-3 max-w-2xl text-sm leading-6 text-black/52">{intro}</p>{children}</div>;
}

function OptionButton({ selected, label, detail, onClick }: { selected: boolean; label: string; detail?: string; onClick: () => void }) {
  return <button type="button" aria-pressed={selected} onClick={onClick} className={`flex min-h-16 items-center justify-between gap-4 rounded-[10px] border p-4 text-left transition ${selected ? 'border-[#141714] bg-[#141714] text-white' : 'border-black/12 bg-white hover:border-[#426149]'}`}><span><span className="block text-sm font-semibold">{label}</span>{detail ? <span className={`mt-1 block text-xs leading-5 ${selected ? 'text-white/55' : 'text-black/45'}`}>{detail}</span> : null}</span><span className={`grid h-6 w-6 shrink-0 place-items-center rounded-full border ${selected ? 'border-white/25 bg-white text-black' : 'border-black/20'}`}>{selected ? <Check className="h-3.5 w-3.5" /> : null}</span></button>;
}

function RecommendationCard({ status, title, body, to, cta }: { status: string; title: string; body: string; to: string; cta: string }) {
  return <article className="flex min-h-64 flex-col rounded-[10px] border border-black/10 bg-white p-5"><span className="w-fit rounded-full bg-[#eef4ea] px-3 py-1 text-[9px] font-semibold uppercase tracking-[.12em] text-[#426149]">{status}</span><h4 className="mt-5 text-2xl font-semibold tracking-[-.035em]">{title}</h4><p className="mt-3 text-sm leading-6 text-black/52">{body}</p><Link to={to} className="mt-auto inline-flex items-center gap-2 pt-6 text-sm font-semibold">{cta}<ArrowRight className="h-4 w-4" /></Link></article>;
}
