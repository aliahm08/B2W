import { motion } from 'motion/react';

type TeamMember = {
  name: string;
  title: string;
  focus: string;
  academia: string;
  workplaces: string[];
  description: string;
  impact: string;
  tags: string[];
  linkedin: string;
};

const team: TeamMember[] = [
  {
    name: "Ali Ahmed",
    title: "CEO",
    focus: "Consulting, Software & UI/UX",
    academia: "Columbia University (M.Arch), George Washington University (B.S. Mechanical Engineering)",
    workplaces: ["WSP", "Huupe", "NASA", "Autodesk"],
    description: "Mechanical Engineer and Founder with a multidisciplinary background bridging physical engineering, advanced software architecture, and UX design. Draws on extensive experience leading technical roadmaps and design systems across high-profile organizations including NASA, Autodesk, WSP, and LaunchGood. Proven expertise in developing high-throughput data ingestion pipelines, training machine learning models, and building scalable, user-centric technology solutions.",
    impact: "Drives company vision and go-to-market strategy, translating complex technical capabilities into client-facing solutions that deliver measurable business outcomes.",
    tags: ["Product Management", "UX/UI Engineering", "Full-stack Development"],
    linkedin: "https://www.linkedin.com/in/aliahmed-co/"
  },
  {
    name: "Aaron Patron",
    title: "COO (M&A)",
    focus: "Commercial Analysis & Renewable Energy",
    academia: "The George Washington University (B.S. Mechanical Engineering & Sustainability)",
    workplaces: ["American Power Resources", "DSD Renewables", "GE Solar", "Sol Systems"],
    description: "Manager of Commercial Analysis specializing in renewable energy optimization. Draws on nearly a decade of experience in commercial sales, architectural design, and development engineering across top clean energy firms including American Power Resources, DSD Renewables, and GE Solar. Proven expertise in cash flow forecasting, mechanical engineering projects, and leading multifaceted solar initiatives within the energy sector.",
    impact: "Leads operational strategy and M&A due diligence, structuring acquisition opportunities and operational improvements that unlock new revenue pathways for clients.",
    tags: ["Cash Flow Forecasting", "Communication", "Mergers & Acquisitions (M&A)"],
    linkedin: "https://www.linkedin.com/in/aaronpatron/"
  },
  {
    name: "Feng Xiang",
    title: "CTO (R&D)",
    focus: "AI, Autonomous Driving & Robotics",
    academia: "Carnegie Mellon University (M.S. Robotic Systems Development), GWU (B.S. Mechanical Engineering)",
    workplaces: ["Waymo", "ISEE", "Forterra", "US Naval Research Laboratory"],
    description: "Software Engineer specializing in autonomous driving, vehicle navigation, and enterprise robotics. Proven expertise in building advanced AI systems for robust autonomy in safety-critical environments, global supply chains, and advanced transit. Holds an M.S. in Robotic Systems Development from Carnegie Mellon University and brings deep research and engineering experience from Waymo, ISEE, and Forterra.",
    impact: "Architects the technical R&D pipeline, from proof-of-concept AI models to production-grade systems, ensuring every deliverable meets engineering rigor at scale.",
    tags: ["Multi-Object Tracking", "Trajectory Prediction", "Motion Planning"],
    linkedin: "https://www.linkedin.com/in/fengxiang1/"
  }
];

export default function Team() {
  return (
    <section className="py-32 px-6 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mb-16"
      >
        <h2 className="text-4xl font-medium tracking-tight mb-4">Team</h2>
        <div className="h-px w-full bg-neutral-200" />
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {team.map((member, index) => (
          <motion.a
            key={member.name}
            href={member.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.08 }}
            className="group relative flex flex-col border border-neutral-800 bg-neutral-950 p-8 transition-colors duration-300 hover:border-neutral-600"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.08),transparent_35%)]" />

            <div className="relative grid h-full grid-rows-[auto,1fr,auto] gap-8">
              {/* ── Metadata ── */}
              <div>
                <div className="mb-6 flex flex-wrap items-center gap-2 text-xs font-mono uppercase tracking-wider text-neutral-400">
                  <span className="font-semibold text-stone-100">{member.title}</span>
                  <span className="text-neutral-700">•</span>
                  <span>{member.focus}</span>
                </div>

                <h3 className="mb-3 text-2xl font-medium text-stone-50 group-hover:underline decoration-1 underline-offset-4 decoration-neutral-700">
                  {member.name}
                </h3>
                <p className="text-sm leading-relaxed text-neutral-300">
                  {member.academia}
                </p>
              </div>

              {/* ── Main Content ── */}
              <div className="space-y-5 border-t border-neutral-800 pt-6">
                <div>
                  <p className="text-[11px] font-mono uppercase tracking-[0.24em] text-neutral-400">
                    Summary
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-neutral-200">
                    {member.description}
                  </p>
                </div>

                <div>
                  <p className="text-[11px] font-mono uppercase tracking-[0.24em] text-neutral-400">
                    Past Experience
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {member.workplaces.map((workplace) => (
                      <span
                        key={workplace}
                        className="border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm font-medium text-stone-100"
                      >
                        {workplace}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* ── Impact ── */}
              <div className="border-t border-neutral-800 pt-6">
                <div className="mb-5">
                  <p className="text-[11px] font-mono uppercase tracking-[0.24em] text-neutral-400">
                    Impact
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-neutral-200">
                    {member.impact}
                  </p>
                </div>

                <div>
                  <p className="text-[11px] font-mono uppercase tracking-[0.24em] text-neutral-400">
                    Deliverables
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {member.tags.map((tag) => (
                      <span
                        key={tag}
                        className="border border-neutral-700 px-2 py-1 text-xs text-neutral-300"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.a>
        ))}
      </div>
    </section>
  );
}
