import { useState } from 'react'
import { motion } from 'framer-motion'
import { FaAward, FaHeart, FaLeaf, FaUsers, FaInstagram, FaTimes } from 'react-icons/fa'
import {
  aboutHeroImage,
  aboutIntro,
  aboutPageContent,
  aboutStory,
  teamMembers,
  trustBadges,
} from '../data/aboutTeam'

const Motion = motion

const badgeIcons = {
  award: FaAward,
  heart: FaHeart,
  leaf: FaLeaf,
  users: FaUsers,
}

function About() {
  const [flippedCards, setFlippedCards] = useState({})

  const toggleCard = (memberId) => {
    setFlippedCards((prev) => ({ ...prev, [memberId]: !prev[memberId] }))
  }

  return (
    <div className="relative overflow-hidden pb-0">
      <div className="pointer-events-none absolute -left-16 top-24 h-72 w-72 rounded-full bg-(--orchird-lilac)/30 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 top-[35%] h-80 w-80 rounded-full bg-(--orchird-green)/12 blur-3xl" />

      <section className="container-x pt-14 md:pt-20">
        <Motion.div
          className="relative overflow-hidden rounded-4xl border border-(--orchird-lilac)/60 shadow-[0_28px_60px_rgba(69,32,110,0.2)]"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          <img
            src={aboutHeroImage}
            alt="Equipo de Orchird Beauty House"
            className="h-80 w-full object-cover md:h-115"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/58 via-black/25 to-transparent" />

          <div className="absolute inset-x-0 bottom-0 p-6 md:p-10">
            <p className="text-xs font-black uppercase tracking-[0.24em] text-(--orchird-lilac) md:text-sm">
              {aboutPageContent.hero.eyebrow}
            </p>
            <h1 className="mt-2 text-4xl font-black uppercase leading-tight text-white md:text-6xl">
              {aboutPageContent.hero.title}
            </h1>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-white/90 md:text-lg md:leading-8">
              {aboutPageContent.hero.description}
            </p>
          </div>
        </Motion.div>
      </section>

      <section className="container-x pt-14 text-center md:pt-20">
        <Motion.h2
          className="text-4xl font-black uppercase text-(--orchird-green) md:text-6xl"
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.4 }}
        >
          {aboutIntro.title}
        </Motion.h2>
        <Motion.p
          className="mx-auto mt-6 max-w-5xl text-lg leading-8 text-(--orchird-black)/80 md:text-2xl md:leading-[1.6]"
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.42, delay: 0.06 }}
        >
          {aboutIntro.description}
        </Motion.p>
      </section>

      <section className="container-x pt-14 text-center md:pt-20">
        <Motion.h2
          className="text-4xl font-black uppercase text-(--orchird-lavender) md:text-6xl"
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.4 }}
        >
          {aboutStory.title}
        </Motion.h2>
        <Motion.p
          className="mx-auto mt-6 max-w-5xl text-lg leading-8 text-(--orchird-black)/80 md:text-2xl md:leading-[1.6]"
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.42, delay: 0.06 }}
        >
          {aboutStory.description}
        </Motion.p>
      </section>

      <section className="container-x pt-12 md:pt-16">
        <Motion.div
          className="grid gap-3 md:grid-cols-2 lg:grid-cols-4"
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.4 }}
        >
          {trustBadges.map((badge) => {
            const Icon = badgeIcons[badge.iconKey]
            return (
              <div
                key={badge.id}
                className="group rounded-2xl border border-(--orchird-lilac)/50 bg-white/90 px-4 py-4 text-center shadow-[0_10px_24px_rgba(69,32,110,0.1)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_16px_34px_rgba(69,32,110,0.16)]"
              >
                <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-linear-to-br from-(--orchird-lavender) to-[#8f00e4] text-sm text-white shadow-[0_8px_18px_rgba(143,0,228,0.32)]">
                  <Icon />
                </div>
                <p className="mt-3 text-xs font-black uppercase tracking-[0.14em] text-[#5f2b93]">{badge.label}</p>
                <span className="mx-auto mt-3 block h-1 w-8 rounded-full bg-linear-to-r from-(--orchird-lavender) to-[#8f00e4] transition-all duration-300 group-hover:w-14" />
              </div>
            )
          })}
        </Motion.div>
      </section>

      <section className="mt-16 bg-linear-to-b from-(--orchird-lilac)/85 via-[#d7b5eb] to-(--orchird-lilac)/95 py-14 md:py-20">
        <div className="container-x">
          <Motion.div
            className="max-w-3xl"
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: 0.4 }}
          >
            <p className="text-sm font-black uppercase tracking-[0.18em] text-[#6c39a2] md:text-base">Equipo Orchird</p>
            <h2 className="mt-2 text-4xl font-black uppercase tracking-tight text-(--orchird-green) md:text-6xl">
              {aboutPageContent.teamTitle}
            </h2>
            <span className="mt-4 block h-1 w-24 rounded-full bg-linear-to-r from-(--orchird-lavender) to-[#8f00e4] transition-all duration-300 hover:w-32" />
            <p className="mt-5 text-base leading-8 text-(--orchird-black)/80 md:text-xl md:leading-9">
              Un equipo especializado en rizos, color y salud capilar, enfocado en resultados reales y una experiencia humana en cada cita.
            </p>
          </Motion.div>

          <Motion.div
            className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            variants={{
              hidden: {},
              show: { transition: { staggerChildren: 0.08 } },
            }}
          >
            {teamMembers.map((member) => (
              <Motion.article
                key={member.id}
                className="group rounded-3xl border border-white/60 bg-transparent perspective-[1600px]"
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' } },
                }}
              >
                <Motion.div
                  className="relative min-h-140 rounded-3xl transform-3d md:min-h-143.75"
                  animate={{ rotateY: flippedCards[member.id] ? 180 : 0 }}
                  transition={{ duration: 0.55, ease: 'easeInOut' }}
                >
                  <div className="absolute inset-0 flex flex-col overflow-hidden rounded-3xl bg-white/90 shadow-[0_20px_42px_rgba(69,32,110,0.16)] transition group-hover:-translate-y-1.5 group-hover:shadow-[0_28px_58px_rgba(69,32,110,0.24)] backface-hidden">
                    <div className="relative overflow-hidden">
                      <img
                        src={member.image}
                        alt={member.name}
                        className="h-105 w-full object-cover object-top transition duration-700 group-hover:scale-105"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-linear-to-t from-black/22 to-transparent opacity-0 transition duration-500 group-hover:opacity-100" />
                    </div>

                    <div className="p-5 text-center">
                      <h3 className="text-3xl font-black uppercase text-[#4d2378] md:text-4xl">{member.name}</h3>
                      <p className="mt-2 text-xs font-bold uppercase tracking-[0.18em] text-[#5e2f90]">{member.role}</p>
                      <button
                        type="button"
                        onClick={() => toggleCard(member.id)}
                        className="mt-4 inline-flex items-center justify-center rounded-full bg-(--orchird-lavender) px-4 py-2 text-xs font-bold uppercase tracking-[0.14em] text-white transition hover:bg-[#a45ccc]"
                      >
                        Saber Más
                      </button>
                    </div>
                  </div>

                  <div className="absolute inset-0 overflow-hidden rounded-3xl border border-(--orchird-lilac)/70 bg-[#f7f4f9] p-6 shadow-[0_20px_42px_rgba(69,32,110,0.16)] backface-hidden transform-[rotateY(180deg)]">
                    <button
                      type="button"
                      onClick={() => toggleCard(member.id)}
                      className="absolute right-4 top-4 inline-flex h-10 w-10 items-center justify-center rounded-full border border-(--orchird-lavender) text-(--orchird-lavender) transition hover:bg-(--orchird-lavender) hover:text-white"
                      aria-label={`Cerrar informacion de ${member.name}`}
                    >
                      <FaTimes />
                    </button>

                    <div className="h-full border-l-4 border-(--orchird-green) pl-5 pr-10">
                      <h4 className="text-4xl font-black uppercase leading-tight text-(--orchird-green) md:text-5xl">
                        {member.name}
                      </h4>

                      <a
                        href={member.instagramUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-4 inline-flex items-center gap-2 rounded-full bg-(--orchird-lavender) px-4 py-2 text-sm font-black text-white transition hover:bg-[#9b56ca] md:text-base"
                      >
                        <FaInstagram />
                        {member.instagram}
                      </a>

                      <p className="mt-6 text-base leading-8 text-(--orchird-black)/85 md:text-lg">{member.bio}</p>
                    </div>
                  </div>
                </Motion.div>
              </Motion.article>
            ))}
          </Motion.div>
        </div>
      </section>
    </div>
  )
}

export default About


