import { Link } from 'react-router-dom'

function WorkHighlightCard({ item }) {
  return (
    <article className="group relative overflow-hidden rounded-sm bg-white shadow-sm">
      <img
        src={item.image}
        alt={item.title}
        className="h-105 w-full object-cover transition-transform duration-500 group-hover:scale-[1.03] md:h-125"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-black/65 p-5 text-white opacity-0 transition-opacity duration-400 group-hover:opacity-100 md:p-7">
        <div className="flex h-full flex-col justify-center">
          <h3 className="text-4xl font-black md:text-5xl">{item.title}</h3>
          <p className="mt-3 text-base font-semibold leading-tight md:text-lg">{item.description}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              to={item.learnMorePath ?? '/servicios'}
              className="inline-flex min-w-32 items-center justify-center rounded-xl bg-(--orchird-lavender) px-4 py-2 text-base font-medium text-white transition hover:brightness-95"
            >
              Saber más
            </Link>
            <Link
              to={item.reservePath ?? '/reservas'}
              className="inline-flex min-w-32 items-center justify-center rounded-xl bg-(--orchird-lavender) px-4 py-2 text-base font-medium text-white transition hover:brightness-95"
            >
              Reserva
            </Link>
          </div>
        </div>
      </div>
    </article>
  )
}

export default WorkHighlightCard
