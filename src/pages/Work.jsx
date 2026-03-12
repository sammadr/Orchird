import { useCallback, useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { FaChevronLeft, FaChevronRight, FaExpand, FaTimes } from 'react-icons/fa'
import { projects } from '../data/projects'

const Motion = motion

const serviceOrder = ['Corte En Forma', 'Rëzocut', 'Color', 'Secado', 'Barberia', 'Peinados']
const visiblePerSection = 6
const cardWidth = 200
const cardGap = 16
const step = cardWidth + cardGap

function getVisibleItems(items, start, visibleCount) {
  if (items.length <= visibleCount) return items
  return Array.from({ length: visibleCount }).map((_, index) => items[(start + index) % items.length])
}

function ServiceCarousel({ group, onOpenModal, paused }) {
  const items = group.items
  const total = items.length
  const canSlide = total > visiblePerSection

  const [index, setIndex] = useState(0)
  const [direction, setDirection] = useState('next')
  const [trackX, setTrackX] = useState(0)
  const [animating, setAnimating] = useState(false)

  const visibleItems = useMemo(() => {
    if (!canSlide) return items
    const start = direction === 'prev' ? (index - 1 + total) % total : index
    return getVisibleItems(items, start, visiblePerSection + 1)
  }, [canSlide, direction, index, items, total])

  const finishSlide = () => {
    if (!animating) return

    if (direction === 'next') {
      setIndex((prev) => (prev + 1) % total)
    } else {
      setIndex((prev) => (prev - 1 + total) % total)
      setDirection('next')
    }

    setTrackX(0)
    setAnimating(false)
  }

  const goNext = useCallback(() => {
    if (!canSlide || animating) return
    setDirection('next')
    setAnimating(true)
    setTrackX(0)
    requestAnimationFrame(() => setTrackX(-step))
  }, [canSlide, animating])

  const goPrev = () => {
    if (!canSlide || animating) return
    setDirection('prev')
    setAnimating(true)
    setTrackX(-step)
    requestAnimationFrame(() => setTrackX(0))
  }

  useEffect(() => {
    if (!canSlide || paused || animating) return undefined

    const intervalId = setInterval(() => {
      goNext()
    }, 2700)

    return () => clearInterval(intervalId)
  }, [canSlide, paused, animating, goNext])

  return (
    <Motion.div
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <h2 className="text-3xl font-black uppercase text-[#4f237c] md:text-4xl">{group.service}</h2>
          <span className="h-1 w-12 rounded-full bg-linear-to-r from-(--orchird-lavender) to-(--orchird-green)" />
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={goPrev}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-(--orchird-lilac)/70 bg-white text-[#7d43b1] transition hover:bg-(--orchird-lilac)/24"
            aria-label={`Deslizar ${group.service} hacia la izquierda`}
          >
            <FaChevronLeft />
          </button>
          <button
            type="button"
            onClick={goNext}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-(--orchird-lilac)/70 bg-white text-[#7d43b1] transition hover:bg-(--orchird-lilac)/24"
            aria-label={`Deslizar ${group.service} hacia la derecha`}
          >
            <FaChevronRight />
          </button>
        </div>
      </div>

      <div className="mt-5 overflow-hidden">
        <Motion.div
          className="flex gap-4"
          animate={{ x: trackX }}
          transition={{ duration: 0.55, ease: 'easeInOut' }}
          onAnimationComplete={finishSlide}
        >
          {visibleItems.map((item, itemIndex) => (
            <article
              key={`${group.service}-${item.id}-${itemIndex}`}
              className="group w-50 shrink-0 overflow-hidden rounded-3xl border border-(--orchird-lilac)/60 bg-white shadow-[0_18px_40px_rgba(69,32,110,0.14)] transition hover:-translate-y-1.5 hover:shadow-[0_24px_52px_rgba(69,32,110,0.2)]"
            >
              <button
                type="button"
                onClick={() => onOpenModal(item)}
                className="relative block w-full"
                aria-label={`Abrir imagen de ${item.title}`}
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="h-80 w-full object-cover transition duration-700 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/35 to-transparent opacity-70 transition group-hover:opacity-90" />
                <span className="absolute right-4 top-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/88 text-[#7139aa] shadow-md transition group-hover:scale-110">
                  <FaExpand />
                </span>
              </button>
            </article>
          ))}
        </Motion.div>
      </div>
    </Motion.div>
  )
}

function Work() {
  const [selectedProject, setSelectedProject] = useState(null)

  const groupedProjects = useMemo(() => {
    const grouped = projects.reduce((acc, project) => {
      if (!acc[project.service]) acc[project.service] = []
      acc[project.service].push(project)
      return acc
    }, {})

    return serviceOrder.map((service) => ({
      service,
      items: grouped[service] ?? [],
    }))
  }, [])

  return (
    <div className="relative overflow-hidden pb-20">
      <div className="pointer-events-none absolute -left-20 top-16 h-72 w-72 rounded-full bg-(--orchird-lilac)/32 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 top-[42%] h-72 w-72 rounded-full bg-(--orchird-green)/14 blur-3xl" />

      <section className="container-x pt-16 text-center md:pt-20">
        <Motion.p
          className="text-xs font-black uppercase tracking-[0.28em] text-[#965fca]"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
        >
          Galeria Orchird
        </Motion.p>
        <Motion.h1
          className="mt-4 text-4xl font-black uppercase tracking-tight text-(--orchird-green) md:text-6xl"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.05 }}
        >
          Nuestro Trabajo
        </Motion.h1>
        <Motion.p
          className="mx-auto mt-6 max-w-5xl text-lg leading-8 text-(--orchird-black)/80 md:text-2xl md:leading-[1.55]"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.42, delay: 0.1 }}
        >
          Galeria organizada por servicio. Cada seccion se desliza automaticamente para mostrar mas resultados.
          Haz click en cualquier foto para verla en detalle.
        </Motion.p>
      </section>

      <section className="container-x mt-12 space-y-12 md:mt-14 md:space-y-14">
        {groupedProjects.map((group) => (
          <ServiceCarousel
            key={group.service}
            group={group}
            onOpenModal={setSelectedProject}
            paused={Boolean(selectedProject)}
          />
        ))}
      </section>

      <AnimatePresence>
        {selectedProject ? (
          <Motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-[#4d74c8]/35 p-4 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedProject(null)}
          >
            <Motion.div
              className="relative w-full max-w-4xl rounded-3xl border border-(--orchird-lilac)/60 bg-white p-4 shadow-[0_34px_70px_rgba(0,0,0,0.2)] md:p-5"
              initial={{ opacity: 0, scale: 0.95, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 8 }}
              transition={{ duration: 0.25 }}
              onClick={(event) => event.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => setSelectedProject(null)}
                className="absolute right-4 top-4 z-10 inline-flex h-11 w-11 items-center justify-center rounded-full bg-black/65 text-white transition hover:bg-black/80"
                aria-label="Cerrar modal"
              >
                <FaTimes />
              </button>

              <div className="rounded-2xl bg-[#f8f4fc] p-3">
                <img
                  src={selectedProject.image}
                  alt={selectedProject.title}
                  className="h-[72vh] w-full rounded-xl object-contain"
                />
              </div>

              <div className="mt-4 rounded-2xl bg-white p-3 md:p-4">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-(--orchird-green-dark)">
                  {selectedProject.service}
                </p>
                <h3 className="mt-1 text-2xl font-black text-[#351b52]">{selectedProject.title}</h3>
                <p className="mt-2 text-sm leading-7 text-(--orchird-black)/78">{selectedProject.description}</p>
              </div>
            </Motion.div>
          </Motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  )
}

export default Work
