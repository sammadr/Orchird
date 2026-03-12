import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { homeBanners } from '../../data/homeBanners'

const MotionSection = motion.section

function HomeBannerCarousel() {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrent((prev) => (prev + 1) % homeBanners.length)
    }, 4500)

    return () => clearInterval(intervalId)
  }, [])

  return (
    <MotionSection
      className="relative"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: 'easeOut' }}
    >
      <div className="relative h-85 w-full overflow-hidden md:h-140">
        {homeBanners.map((slide, index) => (
          <img
            key={slide.id}
            src={slide.image}
            alt={slide.alt}
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
              index === current ? 'opacity-100' : 'opacity-0'
            }`}
            style={{ objectPosition: 'center 28%' }}
          />
        ))}
        <div className="absolute inset-0 bg-black/30" />
      </div>

      <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-2">
        {homeBanners.map((slide, index) => (
          <button
            key={slide.id}
            className={`h-3 w-3 rounded-full border border-white/80 ${
              current === index ? 'bg-(--orchird-green)' : 'bg-white'
            }`}
            onClick={() => setCurrent(index)}
            aria-label={`Ir al slide ${index + 1}`}
          />
        ))}
      </div>
    </MotionSection>
  )
}

export default HomeBannerCarousel
