import { useMemo } from 'react'
import { Link, useParams } from 'react-router-dom'
import { FaCalendarAlt, FaTag, FaUser } from 'react-icons/fa'
import { blogPosts } from '../data/blogPosts'

function BlogDetail() {
  const { id } = useParams()
  const post = blogPosts.find((item) => String(item.id) === id)
  const expandedParagraphs = useMemo(() => {
    if (!post) return []

    return [
      ...post.contentBlocks,
      'En Orchird aplicamos este enfoque con diagnostico, tecnica y seguimiento para que el resultado no solo se vea bien en salon, sino que se mantenga durante tu rutina semanal.',
      'Cuando se combinan corte correcto, producto adecuado y metodo de secado inteligente, se obtiene una mejora visible en forma, definicion y control de frizz.',
    ]
  }, [post])

  if (!post) {
    return (
      <section className="container-x py-16">
        <h1 className="text-4xl font-black text-(--orchird-green)">Noticia no encontrada</h1>
        <Link to="/blog" className="mt-6 inline-flex rounded-full bg-(--orchird-lavender) px-5 py-2 text-sm font-black text-white">
          Volver al blog
        </Link>
      </section>
    )
  }

  const relatedPosts = blogPosts.filter((item) => item.id !== post.id).slice(0, 2)

  return (
    <div className="relative overflow-hidden pb-20">
      <div className="pointer-events-none absolute -left-20 top-28 h-72 w-72 rounded-full bg-(--orchird-lilac)/28 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 top-[44%] h-72 w-72 rounded-full bg-(--orchird-green)/14 blur-3xl" />

      <section className="container-x pt-16">
        <div className="rounded-3xl border border-(--orchird-lilac)/60 bg-white/90 p-6 shadow-[0_16px_34px_rgba(69,32,110,0.12)] md:p-8">
          <h1 className="text-3xl font-black uppercase leading-tight text-(--orchird-green) md:text-5xl">{post.title}</h1>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-2 rounded-full border border-(--orchird-lilac)/60 bg-[#f8f2fc] px-4 py-2 text-sm font-black uppercase tracking-[0.12em] text-[#171717]">
              <FaCalendarAlt className="text-[#6f3ea5]" />
              {post.dateLabel}
            </span>
            <span className="inline-flex items-center gap-1 rounded-full border border-(--orchird-green)/45 bg-(--orchird-green)/12 px-3 py-1 text-xs font-black uppercase tracking-[0.12em] text-(--orchird-green-dark)">
              <FaUser />
              By {post.author}
            </span>
            <Link
              to={`/blog?tag=${encodeURIComponent(post.tag)}`}
              className="inline-flex items-center gap-1 rounded-full border border-(--orchird-lavender)/55 bg-(--orchird-lilac)/35 px-3 py-1 text-xs font-black uppercase tracking-[0.12em] text-[#6f3ea5] transition hover:bg-(--orchird-lavender)/35"
            >
              <FaTag />
              #{post.tag}
            </Link>
          </div>

          <div className="mt-8 h-1 w-full rounded-full bg-(--orchird-green)" />
        </div>

        <div className="mt-8 space-y-8 rounded-3xl border border-(--orchird-lilac)/60 bg-white/85 p-6 text-base leading-9 text-(--orchird-black)/84 shadow-sm md:p-8 md:text-lg md:leading-9">
          <p>{post.contentIntro}</p>

          <h2 className="text-3xl font-black text-(--orchird-green) md:text-5xl">{post.contentHeading}</h2>

          {expandedParagraphs.map((block, index) => (
            <p key={`${post.id}-block-${index}`}>{block}</p>
          ))}
        </div>
      </section>

      <section className="mt-14 bg-(--orchird-lilac)/85 py-16 md:py-20">
        <div className="container-x">
          <h2 className="mb-6 text-3xl font-black uppercase text-[#5f2b93] md:text-4xl">Tambien puede interesarte...</h2>
          <div className="grid gap-8 md:grid-cols-2">
            {relatedPosts.map((item) => (
              <Link
                key={item.id}
                to={`/blog/${item.id}`}
                className="overflow-hidden rounded-2xl border border-(--orchird-lilac)/60 bg-white shadow-[0_16px_36px_rgba(69,32,110,0.14)] transition hover:-translate-y-1.5"
              >
                <img src={item.image} alt={item.title} className="h-65 w-full object-cover md:h-70" />

                <div className="flex flex-wrap items-center gap-2 p-5 pb-0">
                  <span className="inline-flex items-center gap-1 rounded-full border border-(--orchird-green)/45 bg-(--orchird-green)/12 px-3 py-1 text-xs font-black uppercase tracking-[0.12em] text-(--orchird-green-dark)">
                    <FaUser />
                    By {item.author}
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full border border-(--orchird-lavender)/55 bg-(--orchird-lilac)/35 px-3 py-1 text-xs font-black uppercase tracking-[0.12em] text-[#6f3ea5]">
                    <FaTag />
                    #{item.tag}
                  </span>
                </div>

                <div className="p-5 pt-4">
                  <h3 className="text-2xl font-black uppercase leading-tight text-(--orchird-green) md:text-3xl">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-base leading-8 text-(--orchird-black)/78">{item.excerpt}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

export default BlogDetail
