import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, TrendingUp, LayoutTemplate, Target, ShieldCheck, LineChart } from 'lucide-react';
import { Link } from 'react-router-dom';
import UyghurEatsOfferModal from '../../../components/uyghur-eats/UyghurEatsOfferModal';

type UyghurEatsProposalHubProps = {
  basePath?: string;
  label?: string;
};

export default function UyghurEatsProposalHub({
  basePath = '/client/uyghur-eats-v5',
  label = 'Uyghur Eats Portal v5',
}: UyghurEatsProposalHubProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const valueAdds = [
    {
      id: 'maximize',
      title: 'Maximize Returns',
      description: 'We normalize your financial reality to ensure buyers see the full scope of your earning power, establishing clear justification for premium transaction multiples.',
      icon: TrendingUp,
      accent: 'border-emerald-200 hover:border-emerald-600',
      bgHover: 'group-hover:bg-emerald-600'
    },
    {
      id: 'transfer',
      title: 'Ease Transfer',
      description: 'We document your operations so thoroughly that a buyer can confidently step into a turnkey environment, dramatically reducing perceived risk.',
      icon: ShieldCheck,
      accent: 'border-sky-200 hover:border-sky-600',
      bgHover: 'group-hover:bg-sky-600'
    }
  ];

  const subPages = [
    {
      title: 'Ad Profile',
      path: `${basePath}/ad`,
      description: 'Visual thesis & narrative.',
      icon: LayoutTemplate,
      delay: 0.1
    },
    {
      title: 'Valuation',
      path: `${basePath}/analysis`,
      description: 'SDE modeling & comps.',
      icon: LineChart,
      delay: 0.2
    },
    {
      title: 'Dashboard',
      path: `${basePath}/dashboard`,
      description: 'Progress & timelines.',
      icon: Target,
      delay: 0.3
    }
  ];

  const handleOpenModal = () => {
    setIsSubmitted(false);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => setIsModalOpen(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const details = {
        client: formData.get('clientName'),
        representative: formData.get('representative'),
        signature: formData.get('signature'),
        timestamp: new Date().toISOString()
    };
    
    // Mock email interaction
    console.log("Email triggered to info@b2w-ai.com");
    console.log("Subject: LOI Submitted - Uyghur Eats Proposal Acceptance");
    console.log("Body:", details);
    
    setIsSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-white text-black font-sans selection:bg-black selection:text-white pb-32">
      {/* Utility Nav */}
      <nav className="border-b border-neutral-100 flex items-center justify-between px-6 md:px-10 py-4">
        <div className="text-sm font-medium tracking-tight font-mono uppercase tracking-widest text-neutral-400">B2W Exit Advisory</div>
        <div className="text-[10px] font-mono uppercase tracking-widest text-neutral-400">{label}</div>
      </nav>

      {/* Hero Header - Modern V3 Centered Style */}
      <section className="mx-auto max-w-7xl px-6 py-24 md:py-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.25em] text-neutral-400 mb-6">
            <span>Client Engagement</span>
            <span className="text-neutral-200">/</span>
            <span>Official Proposal</span>
          </div>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-medium tracking-tight mb-8">
            Strategic Exit Preparation.
          </h1>
          <p className="max-w-3xl text-xl md:text-2xl leading-relaxed text-neutral-600 mb-12">
            A comprehensive advisory approach to maximize the value of your business sale through professional opportunity packaging, valuation modeling, and turnkey documentation.
          </p>
          
          <div className="flex flex-col md:flex-row items-start md:items-center gap-8 mb-16">
             <button 
                onClick={handleOpenModal}
                className="flex items-center gap-3 px-8 py-5 bg-orange-600 hover:bg-orange-700 text-white font-semibold text-sm rounded-full transition-transform hover:scale-105 active:scale-95 shadow-2xl"
             >
                <span>Accepting Proposal</span>
                <ArrowRight className="w-4 h-4" />
             </button>
             <div className="flex gap-8 text-sm">
                <div>
                    <span className="block text-[10px] uppercase font-mono tracking-widest text-neutral-400 mb-1">Timeline</span>
                    <span className="font-semibold">3-4 Weeks</span>
                </div>
                <div>
                    <span className="block text-[10px] uppercase font-mono tracking-widest text-neutral-400 mb-1">Investment</span>
                    <span className="font-semibold">$4K - $7.5K</span>
                </div>
             </div>
          </div>
        </motion.div>
      </section>


      {/* Quick Access Nav - Moved Explore Links Here */}
      <section className="mx-auto max-w-7xl px-6 mb-32">
         <div className="grid grid-cols-1 md:grid-cols-3 gap-1 border-y border-neutral-100 bg-neutral-100">
            {subPages.map((page) => (
                <Link 
                    key={page.path}
                    to={page.path}
                    className="bg-white p-6 flex items-center justify-between group hover:bg-neutral-50 transition-colors"
                >
                    <div className="flex items-center gap-4">
                        <div className="p-2 bg-neutral-100 text-neutral-400 group-hover:text-black group-hover:bg-white transition-colors border border-transparent group-hover:border-neutral-200">
                            <page.icon className="w-5 h-5" />
                        </div>
                        <div>
                            <span className="block text-sm font-semibold text-black">{page.title}</span>
                            <span className="text-xs text-neutral-400">{page.description}</span>
                        </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-neutral-200 group-hover:text-black transition-colors" />
                </Link>
            ))}
         </div>
      </section>

      {/* Value Add Summary */}
      <section className="mx-auto max-w-7xl px-6 pb-32">
        <div className="mb-12">
          <h2 className="text-2xl font-medium tracking-tight mb-2">Strategic Objectives</h2>
          <p className="text-neutral-500">How we capture and protect enterprise value.</p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6">
          {valueAdds.map((item, idx) => (
             <motion.div
               key={item.id}
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               transition={{ duration: 0.5, delay: idx * 0.1 }}
               className={`group border bg-white p-8 md:p-10 transition-colors duration-300 ${item.accent}`}
             >
               <div className={`mb-8 inline-flex p-4 rounded-full bg-neutral-100 text-neutral-800 transition-colors duration-300 ${item.bgHover} group-hover:text-white`}>
                 <item.icon className="w-6 h-6" />
               </div>
               <h3 className="text-2xl font-medium tracking-tight mb-4">{item.title}</h3>
               <p className="text-neutral-600 leading-relaxed">
                 {item.description}
               </p>
             </motion.div>
          ))}
        </div>
      </section>

      {/* Consolidated Deliverables List */}
      <section className="mx-auto max-w-7xl px-6 pb-32">
        <div className="mb-12">
          <h2 className="text-2xl font-medium tracking-tight mb-2">Scope of Work</h2>
          <p className="text-neutral-500">The specific assets and packages we will build.</p>
        </div>

        <div className="border-t border-neutral-200">
          <motion.div 
            initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="border-b border-neutral-200 py-8 md:py-10 flex flex-col md:flex-row gap-6 md:gap-12 group hover:bg-neutral-50 transition-colors px-4 md:px-0"
          >
            <div className="md:w-1/4">
              <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-neutral-400">Deliverable 01</span>
              <h3 className="text-xl font-medium tracking-tight mt-2 flex items-center gap-2">
                 <LayoutTemplate className="w-4 h-4 text-neutral-400" />
                 Public Profile
              </h3>
            </div>
            <div className="md:w-3/4">
              <p className="text-neutral-600 leading-relaxed md:text-lg">
                Creating a premium, public-facing digital profile to showcase the value of the Glover Park location, your unique culinary story, and the demographic strength of the neighborhood.
              </p>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="border-b border-neutral-200 py-8 md:py-10 flex flex-col md:flex-row gap-6 md:gap-12 group hover:bg-neutral-50 transition-colors px-4 md:px-0"
          >
            <div className="md:w-1/4">
              <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-neutral-400">Deliverable 02</span>
              <h3 className="text-xl font-medium tracking-tight mt-2 flex items-center gap-2">
                 <LineChart className="w-4 h-4 text-neutral-400" />
                 Valuation Model
              </h3>
            </div>
            <div className="md:w-3/4">
              <p className="text-neutral-600 leading-relaxed md:text-lg">
                Determining true earning power via SDE (Seller Discretionary Earnings) adjustments. We cross-reference this against comparable regional restaurant sales to establish a defensible asking price.
              </p>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="border-b border-neutral-200 py-8 md:py-10 flex flex-col md:flex-row gap-6 md:gap-12 group hover:bg-neutral-50 transition-colors px-4 md:px-0"
          >
            <div className="md:w-1/4">
              <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-neutral-400">Deliverable 03</span>
              <h3 className="text-xl font-medium tracking-tight mt-2 flex items-center gap-2">
                 <BriefcaseBusiness className="w-4 h-4 text-neutral-400" />
                 Operations & Due Diligence
              </h3>
            </div>
            <div className="md:w-3/4">
              <p className="text-neutral-600 leading-relaxed md:text-lg">
                <span className="font-medium text-black">Consolidated Package:</span> We merge all standard operating procedures (SOPs), vendor lists, equipment inventories, and verified financial records into a single turnkey datamanagement room for serious buyers.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Terms & Agreement Section - New */}
      <section className="mx-auto max-w-7xl px-6 pb-32">
        <div className="mb-12">
          <h2 className="text-2xl font-medium tracking-tight mb-2">Terms & Agreement</h2>
          <p className="text-neutral-500">The commercial baseline for this engagement.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
            <div className="border border-neutral-200 p-8 hover:border-neutral-400 transition-colors">
                <div className="mb-6 p-3 bg-neutral-100 w-fit rounded-lg">
                    <DollarSign className="w-5 h-5" />
                </div>
                <h4 className="font-semibold mb-2">Service Investment</h4>
                <p className="text-sm text-neutral-600 leading-relaxed">
                    The total investment for this preparation phase is <span className="font-bold text-black border-b border-black">$4,000 - $7,500</span>, payable as a success-based fee upon the closure of the transaction.
                </p>
            </div>
            <div className="border border-neutral-200 p-8 hover:border-neutral-400 transition-colors">
                <div className="mb-6 p-3 bg-neutral-100 w-fit rounded-lg">
                    <Clock className="w-5 h-5" />
                </div>
                <h4 className="font-semibold mb-2">4-Month Exclusivity</h4>
                <p className="text-sm text-neutral-600 leading-relaxed">
                    To ensure focused marketing and consistent buyer communication, we operate on a 120-day exclusive representation period.
                </p>
            </div>
            <div className="border border-neutral-200 p-8 hover:border-neutral-400 transition-colors">
                <div className="mb-6 p-3 bg-neutral-100 w-fit rounded-lg">
                    <Scale className="w-5 h-5" />
                </div>
                <h4 className="font-semibold mb-2">Mutual Confidentiality</h4>
                <p className="text-sm text-neutral-600 leading-relaxed">
                    All financial disclosures, operational SOPs, and marketing strategies are covered under our mutual Non-Disclosure Agreement.
                </p>
                <div className="mt-4">
                    <button className="text-[10px] font-mono uppercase tracking-[0.2em] text-neutral-400 hover:text-black transition-colors flex items-center gap-1">
                        [see full terms <ArrowRight className="w-3 h-3 inline" />]
                    </button>
                </div>
            </div>
        </div>
        
        <div className="mt-12 p-8 bg-neutral-950 text-white flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="max-w-xl">
                <h4 className="text-xl font-medium mb-2">Ready to initiate the preparation phase?</h4>
                <p className="text-neutral-400 text-sm">
                    By clicking accept, you authorize B2W to begin packaging your business for sale according to the scope of work defined above.
                </p>
            </div>
            <button 
                onClick={handleOpenModal}
                className="whitespace-nowrap px-8 py-4 bg-orange-600 hover:bg-orange-700 text-white font-semibold text-sm rounded-full transition-transform hover:scale-105 active:scale-95"
            >
                Execute Acceptance
            </button>
        </div>
      </section>

      <UyghurEatsOfferModal 
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        isSubmitted={isSubmitted}
        onSubmit={handleSubmit}
      />

      <footer className="mx-auto max-w-7xl px-6 pt-20 border-t border-neutral-100">
        <div className="flex flex-col md:flex-row justify-between items-start gap-8 opacity-50 text-[10px] font-mono uppercase tracking-[0.2em]">
            <div>
                <p className="mb-2 text-black font-bold">B2W LLC</p>
                <p className="text-neutral-500">M&A Advisory & Strategy Consulting</p>
            </div>
            <div className="text-right flex flex-col items-end">
                <p className="mb-2 text-black font-bold">Communication</p>
                <p className="text-neutral-500">info@b2w-ai.com</p>
            </div>
        </div>
      </footer>
    </div>
  );
}
