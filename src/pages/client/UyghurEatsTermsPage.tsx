import { useEffect, useState, type FormEvent } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import Seo from '../../components/Seo';
import Footer from '../../components/Footer';
import ClientNavbar, { type ClientNavAction } from '../../components/ClientNavbar';
import UyghurEatsOfferModal from '../../components/uyghur-eats/UyghurEatsOfferModal';
import {
  projectPageEyebrowClassName,
  projectPageHeaderClassName,
  projectPageHeroTitleClassName,
  projectPageShellClassName,
  projectHeroGridClassNames,
} from '../../components/projectPageLayout';

export default function UyghurEatsTermsPage() {
  const [showPricingWhy, setShowPricingWhy] = useState(false);
  const [isOfferModalOpen, setIsOfferModalOpen] = useState(false);
  const [isOfferSubmitted, setIsOfferSubmitted] = useState(false);

  const openOfferModal = () => {
    setIsOfferSubmitted(false);
    setIsOfferModalOpen(true);
  };

  const closeOfferModal = () => {
    setIsOfferModalOpen(false);
  };

  const handleOfferSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsOfferSubmitted(true);
  };

  const navItems: ClientNavAction[] = [
    { label: 'Proposal', to: '/client/uyghur-eats' },
    { label: 'Profile', to: '/client/uyghur-eats/profile' },
    { label: 'Valuation', to: '/client/uyghur-eats/valuation' },
    { label: 'Documentation', to: '/client/uyghur-eats/data-room' },
    { label: 'Terms', to: '/client/uyghur-eats/terms' },
    { label: 'Accept', type: 'cta', onClick: openOfferModal },
  ];

  useEffect(() => {
    if (!isOfferModalOpen) {
      return;
    }

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOfferModalOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOfferModalOpen]);

  const terms = [
    {
      number: '01',
      label: 'Scope of Work',
      detail:
        'Services are limited to the preparation, analysis, and documentation outlined in the selected option(s) above. B2W provides advisory and preparation services only.',
    },
    {
      number: '02',
      label: 'Information Provided by Client',
      detail:
        'The client is responsible for providing accurate financial, operational, and business information required to perform the services. B2W will rely on the information provided and does not independently audit or verify its accuracy.',
    },
    {
      number: '03',
      label: 'Financial Analysis and Valuation',
      detail:
        'Any valuation estimates or financial analyses are illustrative and based on available data and market benchmarks. They are not formal appraisals and do not guarantee a specific sale price or transaction outcome.',
    },
    {
      number: '04',
      label: 'Market Research',
      detail:
        'Market research and competitive analysis are based on publicly available information and industry data available at the time of analysis. Market conditions may change over time and may affect the accuracy or relevance of findings.',
    },
    {
      number: '05',
      label: 'Documentation and SOP Development',
      detail:
        'Operational documentation and SOPs will be developed based on interviews, available records, and observations of current processes. These materials are intended as guidance and may require future updates as the business evolves.',
    },
    {
      number: '06',
      label: 'Client Participation',
      detail:
        'Timely client participation, including interviews, document sharing, and operational clarification, is required to complete the engagement within the estimated timeline.',
    },
    {
      number: '07',
      label: 'Buyer Communication and Brokerage Activities',
      detail:
        'B2W does not act as a licensed business broker, intermediary, or advisor in negotiating a transaction. B2W will not solicit buyers, negotiate sale terms, or participate in brokerage activities. All communications with prospective buyers and any transaction negotiations will be conducted by the business owner or their licensed broker.',
    },
    {
      number: '08',
      label: 'Use of Materials',
      detail:
        'All materials prepared as part of the engagement are intended for use by the client in presenting the business opportunity to prospective buyers. The client retains ownership of materials produced specifically for their business. B2W reserves the right to reference non-confidential aspects of the engagement for portfolio or case study purposes.',
    },
    {
      number: '09',
      label: 'Confidentiality',
      detail:
        'Both parties agree to maintain confidentiality of non-public financial, operational, and strategic information shared during the engagement.',
    },
    {
      number: '10',
      label: 'Timeline and Deliverables',
      detail:
        'Project timelines are estimates based on timely client participation and information availability. Delays in receiving required information may extend the project timeline.',
    },
    {
      number: '11',
      label: 'Payment Terms',
      detail:
        'Payment terms will be outlined in the selected package. Unless otherwise agreed, payment is due at the start of the engagement.',
    },
    {
      number: '12',
      label: 'No Legal, Tax, or Investment Advice',
      detail:
        'B2W does not provide legal, tax, accounting, or investment advice. Clients should consult qualified professionals for advice related to legal matters, taxation, accounting treatment, or transaction structuring.',
    },
    {
      number: '13',
      label: 'No Guarantee of Sale',
      detail:
        'While the services are designed to improve the presentation and preparedness of the business for sale, B2W does not guarantee that a sale will occur or that any specific valuation or transaction outcome will be achieved.',
    },
  ];

  return (
    <article className={projectPageShellClassName}>
      <ClientNavbar clientName="Uyghur Eats" clientLink="/client/uyghur-eats" navItems={navItems} hasFieldBoss={true} />
      <Seo
        title="Uyghur Eats Proposal Terms and Scope"
        description="Proposal terms for the Uyghur Eats strategic exit engagement, including scope, valuation assumptions, documentation limits, confidentiality, timeline, and payment expectations."
        robots="noindex, nofollow"
        imageUrl="https://www.b2w-ai.com/images/uyghur-eats/interior.jpg"
        imageAlt="Interior dining room at Uyghur Eats in Washington, DC."
      />

      <header className={projectPageHeaderClassName}>
        <div className="mb-8">
          <Link
            to="/client/uyghur-eats"
            className="inline-flex items-center gap-2 rounded-full bg-neutral-100 px-4 py-2 text-xs font-medium text-neutral-500 transition-colors hover:bg-neutral-200 hover:text-black"
          >
            <ArrowLeft className="h-4 w-4" />
            Return to Proposal
          </Link>
        </div>

        <div className={projectPageEyebrowClassName}>
          <span className="font-semibold text-neutral-900">Client Proposal</span>
          <span className="text-neutral-300">/</span>
          <span>Key Terms</span>
        </div>

        <div className={projectHeroGridClassNames.profile}>
          <div>
            <h1 className={projectPageHeroTitleClassName}>
              Key Terms of the Proposal
            </h1>
            <p className="max-w-2xl text-lg leading-relaxed text-neutral-600 md:text-xl">
              A full-page summary of commercial terms, scope, and working expectations for the Uyghur Eats strategic exit engagement.
            </p>
          </div>

          <aside className="border border-neutral-900 bg-neutral-950 p-6 text-white md:p-7">
            <p className="mb-4 text-[11px] font-mono uppercase tracking-[0.28em] text-neutral-400">
              Agreement Snapshot
            </p>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="border border-white/15 bg-white/5 p-3">
                <p className="mb-2 text-[10px] uppercase tracking-[0.22em] text-neutral-500">Investment</p>
                <button
                  type="button"
                  onClick={() => setShowPricingWhy((current) => !current)}
                  className="text-left font-medium text-white transition-colors hover:text-orange-300"
                  aria-expanded={showPricingWhy}
                  aria-controls="terms-pricing-why-aside"
                >
                  <span className="font-semibold">$4K - $7.5K</span>
                </button>
              </div>
              <div className="border border-white/15 bg-white/5 p-3">
                <p className="mb-2 text-[10px] uppercase tracking-[0.22em] text-neutral-500">Timeline</p>
                <p className="font-medium">3 Weeks</p>
              </div>
            </div>
            {showPricingWhy ? (
              <div
                id="terms-pricing-why-aside"
                className="mt-4 rounded-xl border border-white/15 bg-white/5 p-4"
              >
                <p className="mb-2 text-[10px] font-mono uppercase tracking-[0.22em] text-neutral-400">
                  Why We Charge This
                </p>
                <p className="text-sm leading-6 text-neutral-300">
                  This fee covers strategy, financial profiling, and sale-ready packaging across the three core deliverables rather than a single design artifact.
                </p>
              </div>
            ) : null}
          </aside>
        </div>
      </header>

      <section className="grid gap-4 lg:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)]">
        <div className="border border-neutral-200 bg-white p-6">
          <div className="divide-y divide-neutral-100 border-y border-neutral-100">
            {terms.map((item) => (
              <div key={item.label} className="py-4">
                <p className="mb-1 text-[10px] font-mono uppercase tracking-[0.22em] text-neutral-500">
                  {item.number}
                </p>
                <h2 className="mb-2 text-lg font-medium tracking-tight text-black">
                  {item.label}
                </h2>
                <p className="text-sm leading-6 text-neutral-700">{item.detail}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="border border-neutral-900 bg-neutral-950 p-6 text-white">
          <p className="mb-3 text-[10px] font-mono uppercase tracking-[0.22em] text-neutral-400">
            Working Terms
          </p>
          <div className="space-y-4 text-sm leading-6 text-neutral-300">
            <p>
              All materials are developed in coordination with the client and refined as new business and financial information becomes available.
            </p>
            <p>
              Buyer-facing materials should be treated as controlled documents and shared in line with the client&apos;s approval and diligence process.
            </p>
          </div>
          <Link
            to="/client/uyghur-eats"
            className="mt-6 inline-flex items-center gap-2 text-sm text-orange-500 transition-colors hover:text-orange-600"
          >
            Return to Proposal
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <UyghurEatsOfferModal
        isOpen={isOfferModalOpen}
        onClose={closeOfferModal}
        isSubmitted={isOfferSubmitted}
        onSubmit={handleOfferSubmit}
      />

      <AnimatePresence>
        {!isOfferModalOpen ? (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-8 left-0 right-0 z-40 flex justify-center pointer-events-none"
          >
            <button
              type="button"
              onClick={openOfferModal}
              className="pointer-events-auto inline-flex items-center gap-2 rounded-full bg-black px-6 py-3.5 text-sm font-medium text-white shadow-[0_8px_30px_rgb(0,0,0,0.12)] transition-all hover:scale-105 hover:bg-neutral-800"
            >
              Accept Proposal
              <ArrowRight className="h-4 w-4" />
            </button>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <Footer />
    </article>
  );
}
