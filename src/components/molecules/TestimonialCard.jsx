import { FaQuoteLeft, FaStar, FaUserCheck } from 'react-icons/fa'

function TestimonialCard({ testimonial }) {
  return (
    <article className="group h-full rounded-2xl border border-(--orchird-lilac)/60 bg-white/95 p-5 shadow-[0_16px_36px_rgba(69,32,110,0.12)] backdrop-blur-sm transition duration-300 hover:-translate-y-1.5 hover:shadow-[0_24px_50px_rgba(69,32,110,0.2)]">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-linear-to-br from-(--orchird-lavender) to-(--orchird-green-dark) text-sm font-black text-white shadow-[0_8px_20px_rgba(69,32,110,0.28)]">
            {testimonial.name.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <h3 className="text-lg font-black leading-tight text-[#45206e]">{testimonial.name}</h3>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-(--orchird-green-dark)">
              {testimonial.role}
            </p>
          </div>
        </div>
        <FaQuoteLeft className="text-2xl text-(--orchird-lavender)/70 transition duration-300 group-hover:text-(--orchird-lavender)" />
      </div>

      <div className="mt-4 flex items-center gap-1 text-[#f6b90a]">
        {Array.from({ length: testimonial.rating ?? 5 }).map((_, index) => (
          <FaStar key={`${testimonial.id}-star-${index}`} className="text-sm" />
        ))}
      </div>

      <p className="mt-4 text-sm leading-7 text-(--orchird-black)/78">{testimonial.text}</p>

      <div className="mt-5 flex items-center justify-between gap-2 border-t border-(--orchird-lilac)/45 pt-4">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#6b3f9f]">{testimonial.service}</p>
        <span className="inline-flex items-center gap-1 rounded-full bg-(--orchird-smoke) px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-(--orchird-green-dark)">
          <FaUserCheck />
          Verificado
        </span>
      </div>
    </article>
  )
}

export default TestimonialCard
