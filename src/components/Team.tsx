import { motion } from 'motion/react';

const team = [
  {
    name: "Ali Ahmed",
    role: "Head of AI & Engineering",
    description: "10+ years of experience blending Data Science and Mechanical Engineering. Proven track record of building customer-facing software, B2B analytics tools, and physical products. Formerly with NASA and Autodesk.",
    tags: ["Deep Learning", "Data Systems", "Product Architecture"],
    linkedin: "https://www.linkedin.com/in/aliahmed-co/"
  },
  {
    name: "Aaron Patron",
    role: "Lead Development Engineer",
    description: "Multidisciplinary engineer with a strong background in analytical mechanics, energy systems, and sustainability. Experience driving commercial sales and engineering design at Distributed Solar Development and GE Solar.",
    tags: ["Clean Energy", "Automation", "Hardware-Software Integration"],
    linkedin: "https://www.linkedin.com/in/aaronpatron/"
  },
  {
    name: "Feng Xiang",
    role: "Lead Product Strategy",
    description: "Strategic leader focused on user-centered design, bringing high-tech AI products to market. Guides the vision for seamlessly integrating AI agents into everyday SMB workflows.",
    tags: ["Product Management", "User Experience", "SaaS Growth"],
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
            <div className="mb-6 flex items-baseline justify-between">
              <h3 className="text-2xl font-medium text-neutral-900 group-hover:underline decoration-1 underline-offset-4 decoration-neutral-300">
                <a href={member.linkedin} target="_blank" rel="noopener noreferrer">{member.name}</a>
              </h3>
              <p className="text-xs text-neutral-500 font-mono uppercase tracking-wider">{member.role}</p>
            </div>

            <p className="text-neutral-600 leading-relaxed text-sm flex-grow mb-6">
              {member.description}
            </p>

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
