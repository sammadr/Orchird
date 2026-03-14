import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { FaShieldAlt, FaUsers, FaAward } from 'react-icons/fa'
import { testimonials as baseTestimonials } from '../../data/testimonials'
import SectionTitle from '../atoms/SectionTitle'
import TestimonialCard from '../molecules/TestimonialCard'

const MotionDiv = motion.div
const USER_TESTIMONIALS_KEY = 'orchirdUserTestimonials'
const NEW_BADGE_WINDOW_MS = 24 * 60 * 60 * 1000

const readUserTestimonials = () => {
  const raw = JSON.parse(localStorage.getItem(USER_TESTIMONIALS_KEY) ?? '[]')
  const safeList = Array.isArray(raw) ? raw : []
  const now = Date.now()

  return safeList
    .filter((item) => String(item.status ?? '').toLowerCase() !== 'rejected')
    .map((item) => {
      const createdAt = item.createdAt ?? null
      const createdAtMs = createdAt ? new Date(createdAt).getTime() : Number.NaN
      const isNew = Number.isFinite(createdAtMs) && now - createdAtMs <= NEW_BADGE_WINDOW_MS

      return {
        id: item.id ?? `t-${Math.random().toString(36).slice(2, 9)}`,
        name: item.name ?? 'Cliente Orchid',
        role: item.role ?? 'Cliente verificada',
        service: item.service ?? 'Servicio personalizado',
        rating: Number(item.rating ?? 5),
        text: item.text ?? '',
        createdAt,
        isNew,
      }
    })
    .sort((a, b) => new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime())
}

function TestimonialsSection() {
  const [current, setCurrent] = useState(0)
  const [userTestimonials, setUserTestimonials] = useState(() => readUserTestimonials())

  const testimonials = useMemo(() => {
    return [...userTestimonials, ...baseTestimonials]
  }, [userTestimonials])

  useEffect(() => {
    const syncTestimonials = () => {
      setUserTestimonials(readUserTestimonials())
    }

    window.addEventListener('storage', syncTestimonials)
    window.addEventListener('orchird-testimonials-updated', syncTestimonials)

    return () => {
      window.removeEventListener('storage', syncTestimonials)
      window.removeEventListener('orchird-testimonials-updated', syncTestimonials)
    }
  }, [])

  useEffect(() => {
    if (testimonials.length === 0) return undefined

    const intervalId = setInterval(() => {
      setCurrent((prev) => (prev + 1) % testimonials.length)
    }, 5000)

    return () => clearInterval(intervalId)
  }, [testimonials.length])

  const safeCurrent = testimonials.length > 0 ? current % testimonials.length : 0

  const visible =
    testimonials.length === 0
      ? []
      : Array.from(
          { length: Math.min(3, testimonials.length) },
          (_, index) => testimonials[(safeCurrent + index) % testimonials.length],
        )

  return (
    <section className="relative overflow-hidden py-16 md:py-20">
      <div className="absolute -left-12 top-6 h-44 w-44 rounded-full bg-(--orchird-lilac)/30 blur-3xl" />
      <div className="absolute -right-16 bottom-8 h-56 w-56 rounded-full bg-(--orchird-green)/16 blur-3xl" />

      <div className="container-x relative z-10">
        <SectionTitle number="03" title="Testimonios" highlight="reales" />
      </div>

      <div className="mt-10 bg-linear-to-br from-(--orchird-lilac)/75 via-[#f7eafb] to-(--orchird-smoke) py-12">
        <div className="container-x">
          <MotionDiv
            className="mb-8 grid gap-3 md:grid-cols-3"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.45 }}
          >
            <div className="rounded-2xl border border-(--orchird-lilac)/60 bg-white/80 p-4 shadow-sm backdrop-blur-sm">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#6b3f9f]">Satisfacción</p>
              <p className="mt-2 text-3xl font-black text-[#45206e]">4.9/5</p>
              <p className="mt-1 text-xs text-(--orchird-black)/70">Valoración promedio de clientes</p>
            </div>
            <div className="rounded-2xl border border-(--orchird-lilac)/60 bg-white/80 p-4 shadow-sm backdrop-blur-sm">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#6b3f9f]">Resultados</p>
              <p className="mt-2 text-3xl font-black text-[#45206e]">+1,200</p>
              <p className="mt-1 text-xs text-(--orchird-black)/70">Servicios realizados con seguimiento</p>
            </div>
            <div className="rounded-2xl border border-(--orchird-lilac)/60 bg-white/80 p-4 shadow-sm backdrop-blur-sm">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#6b3f9f]">Confianza</p>
              <p className="mt-2 text-3xl font-black text-[#45206e]">95%</p>
              <p className="mt-1 text-xs text-(--orchird-black)/70">Clientes vuelven en menos de 60 días</p>
            </div>
          </MotionDiv>

          <MotionDiv
            className="mb-7 flex flex-wrap items-center justify-center gap-2 md:gap-3"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.4, delay: 0.05 }}
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-(--orchird-lilac)/65 bg-white/80 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.14em] text-[#5f2b93]">
              <FaShieldAlt />
              Calidad garantizada
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-(--orchird-lilac)/65 bg-white/80 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.14em] text-[#5f2b93]">
              <FaUsers />
              Equipo especializado
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-(--orchird-lilac)/65 bg-white/80 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.14em] text-[#5f2b93]">
              <FaAward />
              Atención premium
            </span>
          </MotionDiv>

          {visible.length > 0 ? (
            <>
              <div className="grid gap-4 md:grid-cols-3">
                {visible.map((item, index) => (
                  <MotionDiv
                    key={`${safeCurrent}-${item.id}-${index}`}
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.42, ease: 'easeOut' }}
                  >
                    <TestimonialCard testimonial={item} />
                  </MotionDiv>
                ))}
              </div>

              <MotionDiv
                className="mt-8 flex justify-center gap-3"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.35, delay: 0.1 }}
              >
                {testimonials.map((item, index) => (
                  <button
                    key={item.id}
                    className={`h-4 w-4 rounded-full border transition md:h-5 md:w-5 ${
                      safeCurrent === index
                        ? 'scale-110 border-(--orchird-green-dark) bg-(--orchird-green)'
                        : 'border-(--orchird-lavender)/60 bg-white/85 hover:scale-105 hover:bg-(--orchird-lilac)'
                    }`}
                    onClick={() => setCurrent(index)}
                    aria-label={`Ver testimonio ${index + 1}`}
                  />
                ))}
              </MotionDiv>
            </>
          ) : (
            <div className="rounded-2xl border border-(--orchird-lilac)/55 bg-white/85 px-4 py-8 text-center text-sm font-semibold text-(--orchird-black)/75">
              Aún no hay testimonios disponibles.
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

export default TestimonialsSection
