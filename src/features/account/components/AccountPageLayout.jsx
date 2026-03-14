import { FaArrowRight } from 'react-icons/fa'

function AccountPageLayout({ eyebrow, title, subtitle, children }) {
  return (
    <section className="container-x py-10 md:py-14">
      <header className="rounded-3xl bg-linear-to-r from-(--orchird-lavender) via-[#b57ed4] to-(--orchird-lavender) p-6 text-white shadow-[0_20px_42px_rgba(69,32,110,0.2)] md:p-8">
        <p className="text-xs font-black uppercase tracking-[0.16em] text-white/85">{eyebrow}</p>
        <h1 className="mt-2 text-3xl font-black md:text-5xl">{title}</h1>
        <p className="mt-2 max-w-3xl text-sm font-medium text-white/90 md:text-base">{subtitle}</p>
      </header>

      <div className="mt-6 rounded-3xl border border-(--orchird-lilac)/55 bg-white p-5 shadow-[0_16px_34px_rgba(69,32,110,0.12)] md:p-7">
        {children}
      </div>

      <div className="mt-6 rounded-2xl border border-(--orchird-green)/35 bg-(--orchird-green)/10 px-4 py-3 text-sm font-semibold text-(--orchird-green-dark)">
        <span className="inline-flex items-center gap-2">
          <FaArrowRight className="text-xs" />
          Etapa 2 iniciada: la estructura de cuenta ya esta lista para seguir implementando funcionalidades.
        </span>
      </div>
    </section>
  )
}

export default AccountPageLayout
