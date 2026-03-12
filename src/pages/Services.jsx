import { Link } from 'react-router-dom'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { FaClipboardCheck, FaSpa, FaCut, FaArrowRight } from 'react-icons/fa'
import { servicesCatalog } from '../data/servicesCatalog'
import { servicesPageContent } from '../data/servicesPage'

const Motion = motion
const iconMap = {
  'clipboard-check': FaClipboardCheck,
  spa: FaSpa,
  cut: FaCut,
}

function Services() {
  const [flippedCards, setFlippedCards] = useState({})

  const toggleCard = (serviceId) => {
    setFlippedCards((prev) => ({ ...prev, [serviceId]: !prev[serviceId] }))
  }

  return (
    <div className="relative overflow-hidden pb-20">
      <div className="pointer-events-none absolute -left-20 top-20 h-72 w-72 rounded-full bg-(--orchird-lilac)/40 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 top-[36%] h-72 w-72 rounded-full bg-(--orchird-green)/15 blur-3xl" />

      <section className="container-x pt-16 text-center md:pt-20">
        <Motion.p
          className="text-xs font-bold uppercase tracking-[0.3em] text-[#8b4fc2]"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
        >
          {servicesPageContent.hero.eyebrow}
        </Motion.p>

        <Motion.h1
          className="mt-4 text-4xl font-black uppercase tracking-tight text-(--orchird-green) md:text-6xl"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.05 }}
        >
          {servicesPageContent.hero.title}
        </Motion.h1>

        <Motion.p
          className="mx-auto mt-6 max-w-4xl text-lg leading-8 text-(--orchird-black)/80 md:text-[1.42rem] md:leading-10"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.1 }}
        >
          {servicesPageContent.hero.description}
        </Motion.p>
      </section>

      <section className="container-x mt-20 text-center">
        <Motion.p
          className="text-sm font-black uppercase tracking-[0.2em] text-(--orchird-lavender) md:text-3xl"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.35 }}
        >
          {servicesPageContent.method.eyebrow}
        </Motion.p>
        <Motion.h2
          className="mt-3 text-4xl font-black uppercase tracking-tight text-(--orchird-green) md:text-6xl"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.38, delay: 0.05 }}
        >
          {servicesPageContent.method.title}
        </Motion.h2>

        <Motion.div
          className="mt-10 grid gap-4 md:grid-cols-3"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: 0.08 } },
          }}
        >
          {servicesPageContent.method.cards.map((item) => {
            const Icon = iconMap[item.icon]
            return (
              <Motion.article
                key={item.id}
                className="rounded-2xl border border-(--orchird-lilac)/65 bg-white/85 p-6 shadow-[0_16px_32px_rgba(69,32,110,0.1)] backdrop-blur-sm transition hover:-translate-y-1.5 hover:shadow-[0_20px_44px_rgba(69,32,110,0.16)]"
                variants={{
                  hidden: { opacity: 0, y: 18 },
                  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' } },
                }}
              >
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-linear-to-br from-(--orchird-lavender) to-(--orchird-green-dark) text-xl text-white shadow-[0_10px_24px_rgba(69,32,110,0.26)]">
                  <Icon />
                </div>
                <h3 className="mt-4 text-3xl font-black uppercase text-[#a36cd0] md:text-4xl">{item.title}</h3>
                <p className="mx-auto mt-3 max-w-sm text-sm leading-7 text-(--orchird-black)/80">
                  {item.description}
                </p>
              </Motion.article>
            )
          })}
        </Motion.div>
      </section>

      <section className="mt-16 bg-linear-to-r from-(--orchird-lilac) via-[#cfabe7] to-(--orchird-lilac) py-14 md:py-20">
        <div className="container-x text-center">
          <p className="text-sm font-extrabold uppercase tracking-[0.2em] text-[#6d2cae]">{servicesPageContent.resultsBand.eyebrow}</p>
          <h3 className="mt-3 text-3xl font-black text-[#432367] md:text-5xl">{servicesPageContent.resultsBand.title}</h3>
          <p className="mx-auto mt-4 max-w-3xl text-base leading-8 text-[#51346f] md:text-lg">
            {servicesPageContent.resultsBand.description}
          </p>
        </div>
      </section>

      <section className="container-x pt-16 md:pt-20">
        <Motion.p
          className="text-center text-sm font-black uppercase tracking-[0.2em] text-[#a36cd0] md:text-3xl"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.35 }}
        >
          {servicesPageContent.stars.eyebrow}
        </Motion.p>

        <Motion.h2
          className="mt-3 text-center text-4xl font-black uppercase text-(--orchird-green) md:text-6xl"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.38, delay: 0.05 }}
        >
          {servicesPageContent.stars.title}
        </Motion.h2>

        <Motion.p
          className="mx-auto mt-6 max-w-5xl text-center text-lg leading-8 text-(--orchird-black)/80 md:text-2xl md:leading-[1.55]"
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.4, delay: 0.08 }}
        >
          {servicesPageContent.stars.description}
        </Motion.p>

        <Motion.div
          className="mt-12 grid gap-6 md:grid-cols-2"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: 0.07 } },
          }}
        >
          {servicesCatalog.map((service) => (
            <Motion.article
              key={service.id}
              className="group rounded-3xl border border-(--orchird-lilac)/60 bg-transparent perspective-[1600px]"
              variants={{
                hidden: { opacity: 0, y: 20 },
                show: { opacity: 1, y: 0, transition: { duration: 0.44, ease: 'easeOut' } },
              }}
            >
              <Motion.div
                className="relative min-h-92.5 rounded-3xl transform-3d"
                animate={{ rotateY: flippedCards[service.id] ? 180 : 0 }}
                transition={{ duration: 0.55, ease: 'easeInOut' }}
              >
                <div className="absolute inset-0 overflow-hidden rounded-3xl bg-white shadow-[0_18px_38px_rgba(69,32,110,0.12)] backface-hidden transition group-hover:-translate-y-1.5 group-hover:shadow-[0_24px_52px_rgba(69,32,110,0.2)]">
                  <div className="grid h-full gap-0 sm:grid-cols-[43%_57%]">
                    <div className="relative overflow-hidden">
                      <img
                        src={service.image}
                        alt={service.name}
                        className="h-64 w-full object-cover transition duration-700 group-hover:scale-105 sm:h-full"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-linear-to-t from-black/32 to-transparent opacity-75 transition group-hover:opacity-90" />
                    </div>

                    <div className="flex h-full flex-col p-5">
                      <h3 className="text-2xl font-black uppercase leading-tight text-[#101010] md:text-3xl">{service.name}</h3>
                      <p className="mt-3 text-sm leading-7 text-(--orchird-black)/80">{service.description}</p>

                      <p className="mt-4 whitespace-nowrap text-lg font-black text-[#2b1c3c] md:text-xl">
                        Precio base: <span className="text-(--orchird-green-dark)">{service.price}</span>
                      </p>

                      <div className="mt-auto pt-4">
                        <div className="flex flex-wrap gap-2">
                          <Link
                            to="/reservas"
                            className="inline-flex items-center justify-center gap-2 rounded-full bg-(--orchird-green) px-4 py-2 text-xs font-bold uppercase tracking-[0.14em] text-white transition hover:bg-(--orchird-green-dark)"
                          >
                            Reservar
                            <FaArrowRight className="text-[10px]" />
                          </Link>
                          <button
                            type="button"
                            onClick={() => toggleCard(service.id)}
                            className="inline-flex items-center justify-center rounded-full bg-(--orchird-lilac) px-4 py-2 text-xs font-bold uppercase tracking-[0.14em] text-[#532d7c] transition hover:bg-(--orchird-lavender) hover:text-white"
                          >
                            Saber Más
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="absolute inset-0 flex rounded-3xl border border-(--orchird-lilac)/70 bg-linear-to-br from-[#f7edfc] via-white to-[#e7f8ec] p-6 shadow-[0_18px_38px_rgba(69,32,110,0.12)] backface-hidden">
                  <div className="flex h-full w-full flex-col">
                    <p className="text-xs font-black uppercase tracking-[0.2em] text-[#9059c5]">Protocolo Orchird</p>
                    <h4 className="mt-2 text-2xl font-black uppercase text-[#2a173d] md:text-3xl">{service.name}</h4>

                    <ol className="mt-4 space-y-3">
                      {service.protocol.map((step, index) => (
                        <li key={`${service.id}-step-${index}`} className="flex items-start gap-3">
                          <span className="mt-1 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-(--orchird-lavender) text-[11px] font-black text-white">
                            {index + 1}
                          </span>
                          <p className="text-sm leading-6 text-(--orchird-black)/85">{step}</p>
                        </li>
                      ))}
                    </ol>

                    <div className="mt-auto flex flex-wrap gap-2 pt-5">
                      <Link
                        to="/reservas"
                        className="inline-flex items-center justify-center gap-2 rounded-full bg-(--orchird-green) px-4 py-2 text-xs font-bold uppercase tracking-[0.14em] text-white transition hover:bg-(--orchird-green-dark)"
                      >
                        Reservar
                        <FaArrowRight className="text-[10px]" />
                      </Link>
                      <button
                        type="button"
                        onClick={() => toggleCard(service.id)}
                        className="inline-flex items-center justify-center rounded-full bg-(--orchird-lilac) px-4 py-2 text-xs font-bold uppercase tracking-[0.14em] text-[#532d7c] transition hover:bg-(--orchird-lavender) hover:text-white"
                      >
                        Volver
                      </button>
                    </div>
                  </div>
                </div>
              </Motion.div>
            </Motion.article>
          ))}
        </Motion.div>
      </section>
    </div>
  )
}

export default Services
