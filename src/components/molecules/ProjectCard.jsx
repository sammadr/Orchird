import { motion } from 'framer-motion'

const MotionArticle = motion.article

function ProjectCard({ item }) {
  return (
    <MotionArticle
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="rounded-2xl border border-(--orchird-black)/10 bg-white p-5 shadow-sm"
    >
      <span className="text-xs font-semibold uppercase tracking-wider text-(--orchird-green-dark)">{item.category}</span>
      <h3 className="mt-2 text-xl font-semibold">{item.title}</h3>
      <p className="mt-2 text-sm text-(--orchird-black)/70">{item.description}</p>
    </MotionArticle>
  )
}

export default ProjectCard
