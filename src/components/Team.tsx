import { motion } from 'motion/react';

const team = [
  {
    name: "Ali Ahmed",
    role: "CEO & GTM",
    focus: "Consulting, Software & UI/UX",
    academia: "Columbia University (M.Arch), George Washington University (B.S. Mechanical Engineering)",
    workplaces: ["WSP", "Huupe", "NASA", "Autodesk"],
    description: "Mechanical Engineer and Founder with a multidisciplinary background bridging physical engineering, advanced software architecture, and UX design. Draws on extensive experience leading technical roadmaps and design systems across high-profile organizations including NASA, Autodesk, WSP, and LaunchGood. Proven expertise in developing high-throughput data ingestion pipelines, training machine learning models, and building scalable, user-centric technology solutions.",
    tags: ["Product Management", "UX/UI Engineering", "Full-stack Development"],
    linkedin: "https://www.linkedin.com/in/aliahmed-co/"
  },
  {
    name: "Aaron Patron",
    role: "M&A",
    focus: "Commercial Analysis & Renewable Energy",
    academia: "The George Washington University (B.S. Mechanical Engineering & Sustainability)",
    workplaces: ["American Power Resources", "DSD Renewables", "GE Solar", "Sol Systems"],
    description: "Manager of Commercial Analysis specializing in renewable energy optimization. Draws on nearly a decade of experience in commercial sales, architectural design, and development engineering across top clean energy firms including American Power Resources, DSD Renewables, and GE Solar. Proven expertise in cash flow forecasting, mechanical engineering projects, and leading multifaceted solar initiatives within the energy sector.",
    tags: ["Cash Flow Forecasting", "Communication", "Mergers & Acquisitions (M&A)"],
    linkedin: "https://www.linkedin.com/in/aaronpatron/"
  },
  {
    name: "Feng Xiang",
    role: "R&D",
    focus: "AI, Autonomous Driving & Robotics",
    academia: "Carnegie Mellon University (M.S. Robotic Systems Development), GWU (B.S. Mechanical Engineering)",
    workplaces: ["Waymo", "ISEE", "Forterra", "US Naval Research Laboratory"],
    description: "Software Engineer specializing in autonomous driving, vehicle navigation, and enterprise robotics. Proven expertise in building advanced AI systems for robust autonomy in safety-critical environments, global supply chains, and advanced transit. Holds an M.S. in Robotic Systems Development from Carnegie Mellon University and brings deep research and engineering experience from Waymo, ISEE, and Forterra.",
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
            <div className="mb-8 flex flex-col gap-1">
              <div className="flex items-baseline justify-between">
                <h3 className="text-2xl font-medium text-neutral-900 group-hover:underline decoration-1 underline-offset-4 decoration-neutral-300">
                  <a href={member.linkedin} target="_blank" rel="noopener noreferrer">{member.name}</a>
                </h3>
                <p className="text-xs text-neutral-500 font-mono uppercase tracking-wider">{member.role}</p>
              </div>
              <p className="text-sm font-medium text-neutral-700">{member.focus}</p>
            </div>

            <div className="mb-6 space-y-4 flex-grow">
              <div className="pt-2">
                <span className="text-xs font-mono uppercase tracking-wider text-neutral-400 block mb-1">Past Experience</span>
                <p className="text-sm text-neutral-700">{member.workplaces.join(", ")}</p>
              </div>
              <div className="pt-2">
                <span className="text-xs font-mono uppercase tracking-wider text-neutral-400 block mb-1">Summary</span>
                <p className="text-neutral-600 leading-relaxed text-sm">
                  {member.description}
                </p>
              </div>
              <div className="pt-2">
                <span className="text-xs font-mono uppercase tracking-wider text-neutral-400 block mb-1">Academia</span>
                <p className="text-sm text-neutral-700">{member.academia}</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 pt-6 border-t border-neutral-100">
              {member.tags.map(tag => (
                <span key={tag} className="text-xs text-neutral-500 bg-neutral-50 border border-neutral-100 px-2 py-1 rounded-sm">
                  {tag}
                </span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
