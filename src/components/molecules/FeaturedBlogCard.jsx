import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

const MotionArticle = motion.article

function FeaturedBlogCard({ post }) {
  return (
    <MotionArticle
      className="group relative cursor-pointer overflow-hidden rounded-2xl border border-white/40 shadow-[0_22px_40px_rgba(69,32,110,0.16)]"
      whileHover={{ y: -8 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
    >
      <Link to={`/blog/${post.id}`} className="block">
        <img
          src={post.image}
          alt={post.title}
          className="h-127.5 w-full object-cover transition duration-700 ease-out group-hover:scale-110"
          loading="lazy"
        />

        <div className="absolute inset-0 bg-black/35 transition duration-500 group-hover:bg-black/45" />
        <div className="absolute inset-x-0 bottom-0 h-[62%] bg-linear-to-t from-black/95 via-black/60 to-transparent" />

        <div className="absolute left-4 top-4 rounded-full border border-(--orchird-lilac)/60 bg-(--orchird-lavender)/85 px-4 py-2 text-xs font-semibold tracking-wide text-(--orchird-smoke) shadow-[0_8px_18px_rgba(69,32,110,0.35)] backdrop-blur-md">
          {post.tag}
        </div>

        <div className="absolute right-4 top-4 rounded-2xl border border-(--orchird-lilac)/60 bg-(--orchird-green-dark)/82 px-3 py-2 text-center text-(--orchird-smoke) shadow-[0_10px_22px_rgba(36,166,69,0.4)] backdrop-blur-md">
          <p className="text-4xl font-black leading-none [text-shadow:0_4px_14px_rgba(0,0,0,0.72)]">{post.day}</p>
          <p className="mt-1 text-xs font-bold uppercase tracking-[0.2em] [text-shadow:0_4px_14px_rgba(0,0,0,0.72)]">
            {post.month}
          </p>
        </div>

        <div className="absolute inset-x-0 bottom-0 p-6">
          <h3 className="text-3xl font-black leading-tight text-white [text-shadow:0_5px_20px_rgba(0,0,0,0.85)] md:text-[2.1rem]">
            {post.title}
          </h3>

          <p className="mt-4 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-white/85 transition group-hover:text-white">
            Leer articulo
            <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
          </p>
        </div>
      </Link>
    </MotionArticle>
  )
}

export default FeaturedBlogCard
