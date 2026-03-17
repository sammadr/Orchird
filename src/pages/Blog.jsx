import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { FaSearch, FaTag, FaTimes, FaUser } from 'react-icons/fa'
import { blogPosts } from '../data/blogPosts'
import { blogPageData } from '../data/blogPageData'

const pageSize = blogPageData.pageSize
const MotionDiv = motion.div

function Blog() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [query, setQuery] = useState(searchParams.get('q') ?? '')
  const [activeTag, setActiveTag] = useState(searchParams.get('tag') ?? blogPageData.defaultTag)

  const [page, setPage] = useState(1)
  const [direction, setDirection] = useState(1)

  const tags = useMemo(() => [blogPageData.defaultTag, ...new Set(blogPosts.map((post) => post.tag))], [])

  useEffect(() => {
    const nextParams = {}
    if (query.trim()) nextParams.q = query.trim()
    if (activeTag !== blogPageData.defaultTag) nextParams.tag = activeTag
    setSearchParams(nextParams, { replace: true })
  }, [query, activeTag, setSearchParams])

  const filteredPosts = useMemo(() => {
    return blogPosts.filter((post) => {
      const tagMatches = activeTag === blogPageData.defaultTag || post.tag === activeTag
      if (!tagMatches) return false

      if (!query.trim()) return true
      const haystack = `${post.title} ${post.excerpt} ${post.contentHeading} ${post.contentIntro}`.toLowerCase()
      return haystack.includes(query.trim().toLowerCase())
    })
  }, [activeTag, query])

  const featuredPost = filteredPosts[0] ?? null
  const heroPost = featuredPost ?? blogPosts[0]
  const sidePosts = filteredPosts.slice(1)
  const totalPages = Math.max(1, Math.ceil(sidePosts.length / pageSize))

  const start = (page - 1) * pageSize
  const currentPosts = sidePosts.slice(start, start + pageSize)


  return (
    <div className="relative overflow-hidden pb-20">
      <div className="pointer-events-none absolute -left-20 top-24 h-80 w-80 rounded-full bg-(--orchird-lilac)/28 blur-3xl" />
      <div className="pointer-events-none absolute -right-16 top-[45%] h-72 w-72 rounded-full bg-(--orchird-green)/14 blur-3xl" />

      <section className="container-x pt-8 md:pt-10">
        <MotionDiv
          className="relative overflow-hidden rounded-3xl border border-(--orchird-lilac)/60"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
        >
          <img src={heroPost.image} alt={heroPost.title} className="h-75 w-full object-cover md:h-107.5" />
          <div className="absolute inset-0 bg-black/40" />
          <h1 className="absolute inset-0 flex items-center justify-center text-5xl font-black uppercase tracking-tight text-white md:text-7xl">
            {blogPageData.heroTitle}
          </h1>
        </MotionDiv>
      </section>

      <section className="container-x mt-10 md:mt-12">
        <div className="mb-8 rounded-2xl border border-(--orchird-lilac)/60 bg-white/90 p-4 shadow-[0_12px_30px_rgba(69,32,110,0.1)] md:p-5">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="relative w-full md:max-w-lg">
              <FaSearch className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#7b4eac]" />
              <input
                value={query}
                onChange={(event) => {
                  setQuery(event.target.value)
                  setPage(1)
                  setDirection(1)
                }}
                placeholder={blogPageData.searchPlaceholder}
                className="w-full rounded-full border border-(--orchird-lilac)/60 bg-[#faf6fd] py-3 pl-11 pr-10 text-sm font-medium text-[#3a214f] outline-none transition focus:border-(--orchird-green) focus:bg-white"
              />
              {query ? (
                <button
                  type="button"
                  onClick={() => {
                    setQuery('')
                    setPage(1)
                    setDirection(1)
                  }}
                  className="absolute right-3 top-1/2 inline-flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full text-[#7b4eac] transition hover:bg-(--orchird-lilac)/30"
                  aria-label="Limpiar busqueda"
                >
                  <FaTimes className="text-xs" />
                </button>
              ) : null}
            </div>

            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => {
                    setActiveTag(tag)
                    setPage(1)
                    setDirection(1)
                  }}
                  className={`rounded-full border px-4 py-2 text-xs font-black uppercase tracking-[0.12em] transition ${
                    activeTag === tag
                      ? 'border-(--orchird-green) bg-(--orchird-green) text-white'
                      : 'border-(--orchird-lilac)/60 bg-white text-[#6f3ea5] hover:bg-(--orchird-lilac)/25'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          <p className="mt-3 text-xs font-bold uppercase tracking-[0.15em] text-[#7b4eac]/80">
            {blogPageData.resultsLabel}: {filteredPosts.length}
          </p>
        </div>

        {featuredPost ? (
        <div className="grid gap-7 xl:grid-cols-[42%_58%]">
          <Link
            to={`/blog/${featuredPost.id}`}
            className="group overflow-hidden rounded-2xl border border-(--orchird-lilac)/55 bg-white shadow-[0_18px_44px_rgba(69,32,110,0.13)] transition hover:-translate-y-1"
          >
            <img
              src={featuredPost.image}
              alt={featuredPost.title}
              className="h-90 w-full object-cover transition duration-700 group-hover:scale-105"
            />

            <div className="flex flex-wrap items-center gap-2 p-5 pb-0">
              <span className="inline-flex items-center gap-1 rounded-full border border-(--orchird-green)/45 bg-(--orchird-green)/12 px-3 py-1 text-xs font-black uppercase tracking-[0.12em] text-(--orchird-green-dark)">
                <FaUser />
                By {featuredPost.author}
              </span>
              <span className="inline-flex items-center gap-1 rounded-full border border-(--orchird-lavender)/55 bg-(--orchird-lilac)/35 px-3 py-1 text-xs font-black uppercase tracking-[0.12em] text-[#6f3ea5]">
                <FaTag />
                #{featuredPost.tag}
              </span>
            </div>

            <div className="p-5 pt-4">
              <h2 className="text-3xl font-black uppercase leading-tight text-(--orchird-green) md:text-4xl">
                {featuredPost.title}
              </h2>
              <p className="mt-4 text-base leading-9 text-(--orchird-black)/80 md:text-lg [display:-webkit-box] [-webkit-line-clamp:4] [-webkit-box-orient:vertical] overflow-hidden">
                {featuredPost.excerpt}
              </p>
            </div>
          </Link>

          <div className="overflow-hidden">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={page}
                className="space-y-5"
                custom={direction}
                initial={{ opacity: 0, x: 90 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -90 }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
              >
                {currentPosts.map((post, index) => (
                  <Link
                    key={post.id}
                    to={`/blog/${post.id}`}
                    className="grid overflow-hidden rounded-2xl border border-(--orchird-lilac)/60 bg-white shadow-[0_14px_34px_rgba(69,32,110,0.12)] transition hover:-translate-y-1 md:grid-cols-[180px_1fr]"
                  >
                    <div
                      className={`flex flex-col items-center justify-center p-6 text-white ${
                        index % 2 === 0 ? 'bg-(--orchird-lavender)' : 'bg-(--orchird-green)'
                      }`}
                    >
                      <p className="text-6xl font-black leading-none md:text-7xl">{post.day}</p>
                      <p className="mt-1 text-6xl font-black leading-none md:text-7xl">{post.month}</p>
                    </div>

                    <div className="p-5 md:p-6">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="inline-flex items-center gap-1 rounded-full border border-(--orchird-green)/45 bg-(--orchird-green)/12 px-3 py-1 text-xs font-black uppercase tracking-[0.12em] text-(--orchird-green-dark)">
                          <FaUser />
                          By {post.author}
                        </span>
                        <span className="inline-flex items-center gap-1 rounded-full border border-(--orchird-lavender)/55 bg-(--orchird-lilac)/35 px-3 py-1 text-xs font-black uppercase tracking-[0.12em] text-[#6f3ea5]">
                          <FaTag />
                          #{post.tag}
                        </span>
                    </div>

                      <h3 className="mt-4 text-xl font-black uppercase leading-tight text-(--orchird-green) md:text-2xl">
                        {post.title}
                      </h3>
                      <p className="mt-3 text-sm leading-7 text-(--orchird-black)/78 md:text-base [display:-webkit-box] [-webkit-line-clamp:2] [-webkit-box-orient:vertical] overflow-hidden">
                        {post.excerpt}
                      </p>
                    </div>
                  </Link>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
        ) : (
          <div className="rounded-2xl border border-(--orchird-lilac)/55 bg-white p-8 text-center shadow-sm">
            <p className="text-lg font-semibold text-[#5f2b93]">{blogPageData.empty.title}</p>
            <p className="mt-2 text-sm text-(--orchird-black)/70">{blogPageData.empty.description}</p>
          </div>
        )}

        <motion.div
          className="mt-12 flex flex-wrap items-center justify-center gap-3"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.35 }}
        >
          {Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNumber) => {
            const isActive = pageNumber === page
            return (
              <button
                key={pageNumber}
                type="button"
                onClick={() => {
                  setDirection(pageNumber > page ? 1 : -1)
                  setPage(pageNumber)
                }}
                className={`inline-flex h-12 w-12 items-center justify-center rounded-full border text-sm font-black transition duration-200 ${
                  isActive
                    ? 'border-(--orchird-green) bg-linear-to-br from-(--orchird-green) to-(--orchird-green-dark) text-white shadow-[0_10px_22px_rgba(33,191,72,0.34)]'
                    : 'border-(--orchird-lilac)/60 bg-white text-[#6f3ea5] hover:-translate-y-0.5 hover:border-(--orchird-lavender) hover:bg-(--orchird-lilac)/25'
                }`}
                aria-label={`Ir a pagina ${pageNumber} del blog`}
              >
                {pageNumber}
              </button>
            )
          })}
        </motion.div>
      </section>
    </div>
  )
}

export default Blog


