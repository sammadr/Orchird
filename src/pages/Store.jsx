import PageHeader from '../components/organisms/PageHeader'
import { products } from '../data/products'

function Store() {
  return (
    <>
      <PageHeader title="Tienda" description="Productos recomendados para tu rutina de rizos." />
      <section className="container-x pb-16">
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          {products.map((product) => (
            <article key={product.id} className="rounded-2xl bg-white p-5 shadow-sm">
              <h3 className="text-lg font-semibold">{product.name}</h3>
              <p className="mt-2 text-sm text-[var(--orchird-black)]/70">{product.description}</p>
              <p className="mt-3 text-sm font-bold text-[var(--orchird-green-dark)]">{product.price}</p>
            </article>
          ))}
        </div>
      </section>
    </>
  )
}

export default Store
