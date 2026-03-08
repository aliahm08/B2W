import { motion } from 'motion/react';

const team = [
  {
    name: "Feng Xiang",
    role: "Team Lead",
    focus: "AI & Software Engineer",
    academia: "Computer Science & User-Centered Design",
    workplaces: ["High-Growth Tech Startups", "SaaS Enterprises"],
    description: "Strategic leader focused on user-centered design, bringing high-tech AI products to market. Guides the vision for seamlessly integrating AI agents into everyday SMB workflows.",
    tags: ["Product Management", "User Experience", "SaaS Growth"],
    linkedin: "https://www.linkedin.com/in/fengxiang1/"
  },
  {
    name: "Aaron Patron",
    role: "Team Lead",
    focus: "Solar Development Engineer & Real Estate",
    academia: "The George Washington University (B.S. Mechanical Engineering & Sustainability)",
    workplaces: ["Distributed Solar Development", "GE Solar"],
    description: "Multidisciplinary engineer with a strong background in analytical mechanics, energy systems, and sustainability. Drives commercial sales, real estate integrations, and engineering design.",
    tags: ["Clean Energy", "Automation", "Hardware-Software Integration"],
    linkedin: "https://www.linkedin.com/in/aaronpatron/"
  },
  {
    name: "Ali Ahmed",
    role: "Team Lead",
    focus: "Consulting, Software & UI/UX",
    academia: "B.S. Mechanical Engineering & Data Science",
    workplaces: ["NASA", "Autodesk"],
    description: "10+ years of experience blending Data Science and Mechanical Engineering. Proven track record of building customer-facing software, B2B analytics tools, and physical products.",
    tags: ["Deep Learning", "Data Systems", "Product Architecture"],
    linkedin: "https://www.linkedin.com/in/aliahmed-co/"
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
              <div>
                <span className="text-xs font-mono uppercase tracking-wider text-neutral-400 block mb-1">Academia</span>
                <p className="text-sm text-neutral-700">{member.academia}</p>
              </div>
              <div>
                <span className="text-xs font-mono uppercase tracking-wider text-neutral-400 block mb-1">Past Experience</span>
                <p className="text-sm text-neutral-700">{member.workplaces.join(", ")}</p>
              </div>
              <div className="pt-2">
                <p className="text-neutral-600 leading-relaxed text-sm">
                  {member.description}
                </p>
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
