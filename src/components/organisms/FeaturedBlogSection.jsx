import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { blogPosts } from '../../data/blogPosts'
import SectionTitle from '../atoms/SectionTitle'
import FeaturedBlogCard from '../molecules/FeaturedBlogCard'

const MotionLink = motion(Link)
const MotionDiv = motion.div

function FeaturedBlogSection() {
  return (
    <section className="relative overflow-hidden pb-16 md:pb-20">
      <div className="absolute -left-8 top-8 h-48 w-48 rounded-full bg-(--orchird-lilac)/26 blur-3xl" />
      <div className="absolute -right-10 bottom-2 h-52 w-52 rounded-full bg-(--orchird-green)/15 blur-3xl" />

      <div className="container-x relative z-10">
        <SectionTitle number="04" title="Blog" highlight="destacado" />

        <MotionDiv
          className="mt-14 grid gap-6 md:grid-cols-3"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.25 }}
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: 0.08 } },
          }}
        >
          {blogPosts.slice(0, 3).map((post) => (
            <MotionDiv
              key={post.id}
              variants={{
                hidden: { opacity: 0, y: 20 },
                show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' } },
              }}
            >
              <FeaturedBlogCard post={post} />
            </MotionDiv>
          ))}
        </MotionDiv>

        <MotionDiv
          className="mt-10 text-center"
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.4, delay: 0.08 }}
        >
          <MotionLink
            to="/blog"
            whileHover={{ y: -3, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="group relative inline-flex min-w-44 items-center justify-center overflow-hidden rounded-full border border-(--orchird-lilac)/80 bg-(--orchird-lavender) px-7 py-3 text-xs font-extrabold uppercase tracking-[0.22em] text-white shadow-[0_14px_28px_rgba(99,32,159,0.35)] transition-colors duration-300 hover:bg-(--orchird-green-dark) focus:outline-none focus-visible:ring-2 focus-visible:ring-(--orchird-lavender)/70"
          >
            <span className="pointer-events-none absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/30 to-transparent transition duration-500 group-hover:translate-x-full" />
            <span className="relative z-10 inline-flex items-center gap-2">
              Ver Más
              <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
            </span>
          </MotionLink>
        </MotionDiv>
      </div>
    </section>
  )
}

export default FeaturedBlogSection
