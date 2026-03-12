import { projects } from '../../data/projects'
import { motion } from 'framer-motion'
import SectionTitle from '../atoms/SectionTitle'
import WorkHighlightCard from '../molecules/WorkHighlightCard'

function FeaturedWorkSection() {
  return (
    <section className="relative overflow-hidden py-16 md:py-20">
      <div className="absolute -left-16 top-8 h-52 w-52 rounded-full bg-[var(--orchird-lilac)]/35 blur-3xl" />
      <div className="absolute -right-14 bottom-6 h-56 w-56 rounded-full bg-[var(--orchird-green)]/18 blur-3xl" />

      <div className="container-x relative z-10">
        <SectionTitle number="02" title="Nuestros trabajos mas" highlight="destacados" />

        <motion.div
          className="mt-14 grid gap-6 md:grid-cols-3"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
          }}
        >
          {projects.slice(0, 6).map((item) => (
            <motion.div
              key={item.id}
              variants={{
                hidden: { opacity: 0, y: 22 },
                show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' } },
              }}
            >
              <WorkHighlightCard item={item} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

export default FeaturedWorkSection
