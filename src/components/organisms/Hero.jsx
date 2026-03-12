import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import Button from '../atoms/Button'
import Title from '../atoms/Title'
import Text from '../atoms/Text'

const MotionDiv = motion.div

function Hero() {
  return (
    <section className="section-pad">
      <div className="container-x grid items-center gap-8 md:grid-cols-2">
        <MotionDiv initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <span className="inline-block rounded-full bg-(--orchird-lilac) px-4 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-(--orchird-black)">
            Belleza para rizos
          </span>
          <Title as="h1" className="mt-4 text-4xl md:text-6xl">
            Cuida, define y ama tus rizos
          </Title>
          <Text className="mt-4 max-w-xl">
            Somos un salon especializado en cuidado capilar rizado, tratamientos personalizados y productos seleccionados.
          </Text>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link to="/reservas">
              <Button>Reservar cita</Button>
            </Link>
            <Link to="/tienda">
              <Button variant="ghost">Ver tienda</Button>
            </Link>
          </div>
        </MotionDiv>

        <div className="rounded-3xl border border-(--orchird-black)/10 bg-linear-to-br from-(--orchird-lilac) via-white to-(--orchird-smoke) p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.15em] text-(--orchird-black)/60">Experiencia Orchird</p>
          <ul className="mt-4 space-y-3 text-sm text-(--orchird-black)/75">
            <li>Diagnostico capilar y rutina ideal.</li>
            <li>Servicios especializados en texturas rizadas.</li>
            <li>Asesoria para cuidado en casa.</li>
          </ul>
        </div>
      </div>
    </section>
  )
}

export default Hero
