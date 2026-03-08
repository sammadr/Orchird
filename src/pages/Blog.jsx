import PageHeader from '../components/organisms/PageHeader'
import { blogPosts } from '../data/blogPosts'

function Blog() {
  return (
    <>
      <PageHeader title="Blog" description="Tips, novedades y guias para cuidar tus rizos." />
      <section className="container-x pb-16">
        <div className="grid gap-4 md:grid-cols-3">
          {blogPosts.map((post) => (
            <article key={post.id} className="rounded-2xl bg-white p-5 shadow-sm">
              <p className="text-xs font-semibold uppercase text-[var(--orchird-green-dark)]">{post.tag}</p>
              <h3 className="mt-2 text-lg font-semibold">{post.title}</h3>
              <p className="mt-2 text-sm text-[var(--orchird-black)]/70">{post.excerpt}</p>
            </article>
          ))}
        </div>
      </section>
    </>
  )
}

export default Blog
