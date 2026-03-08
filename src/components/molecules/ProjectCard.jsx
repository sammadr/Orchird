import { motion } from 'framer-motion'

function ProjectCard({ item }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="rounded-2xl border border-[var(--orchird-black)]/10 bg-white p-5 shadow-sm"
    >
      <span className="text-xs font-semibold uppercase tracking-wider text-[var(--orchird-green-dark)]">{item.category}</span>
      <h3 className="mt-2 text-xl font-semibold">{item.title}</h3>
      <p className="mt-2 text-sm text-[var(--orchird-black)]/70">{item.description}</p>
    </motion.article>
  )
}

export default ProjectCard
