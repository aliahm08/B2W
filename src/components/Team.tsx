import { motion } from 'motion/react';

type TeamMember = {
  name: string;
  role: string;
  focus: string;
  description: string;
  tags: string[];
  linkedin: string;
};

const team: TeamMember[] = [
  {
    name: "Ali Ahmed",
    role: "CEO (GTM)",
    focus: "Consulting, Software & UI/UX",
    description: "Mechanical engineer turned software architect and product designer. Built data pipelines at NASA, led design systems at Autodesk, and managed infrastructure projects at WSP before founding B2W. Columbia-trained in architecture, GWU-trained in engineering. Thinks in systems, ships in code.",
    tags: ["Product Management", "UX/UI Engineering", "Full-stack Development"],
    linkedin: "https://www.linkedin.com/in/aliahmed-co/"
  },
  {
    name: "Aaron Patron",
    role: "COO (M&A)",
    focus: "Commercial Analysis & Renewable Energy",
    description: "Nine years structuring commercial deals across the energy sector — American Power Resources, DSD Renewables, GE Solar, Sol Systems. Built cash flow models, sized multi-million dollar projects, and closed complex transactions. GWU mechanical engineering with a sustainability focus.",
    tags: ["Cash Flow Forecasting", "Communication", "Mergers & Acquisitions (M&A)"],
    linkedin: "https://www.linkedin.com/in/aaronpatron/"
  },
  {
    name: "Feng Xiang",
    role: "CTO (R&D)",
    focus: "AI, Autonomous Driving & Robotics",
    description: "Carnegie Mellon robotics graduate who taught machines to navigate the real world at Waymo, ISEE, and Forterra. Former researcher at the US Naval Research Laboratory. Specializes in perception systems, trajectory prediction, and motion planning for safety-critical environments.",
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        {team.map((member, index) => (
          <motion.div
            key={member.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="group flex flex-col h-full"
          >
            {/* ── Metadata ── */}
            <div className="mb-8">
              <div className="mb-5 flex flex-wrap items-center gap-2 text-xs font-mono uppercase tracking-wider text-neutral-400">
                <span className="font-semibold text-neutral-900">{member.role}</span>
                <span className="text-neutral-300">•</span>
                <span>{member.focus}</span>
              </div>

              <h3 className="text-2xl font-medium text-neutral-900 group-hover:underline decoration-1 underline-offset-4 decoration-neutral-300">
                <a href={member.linkedin} target="_blank" rel="noopener noreferrer">{member.name}</a>
              </h3>
            </div>

            {/* ── Main Content ── */}
            <div className="mb-6 flex-grow">
              <p className="text-neutral-600 leading-relaxed text-sm">
                {member.description}
              </p>
            </div>

            {/* ── Tags ── */}
            <div className="pt-6 border-t border-neutral-100 space-y-5">
              <div className="flex flex-wrap gap-2">
                {member.tags.map(tag => (
                  <span key={tag} className="text-xs text-neutral-500 bg-neutral-50 border border-neutral-100 px-2 py-1">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
