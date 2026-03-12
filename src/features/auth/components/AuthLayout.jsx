import { motion } from 'framer-motion'
import { FaLock, FaShieldAlt, FaStar } from 'react-icons/fa'
import { authHighlights } from '../data/authPages'

const MotionDiv = motion.div

function AuthLayout({ content, children, footer }) {
  return (
    <section className="relative overflow-hidden py-12 md:py-16">
      <div className="pointer-events-none absolute -left-24 top-10 h-72 w-72 rounded-full bg-(--orchird-lilac)/35 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 top-1/3 h-80 w-80 rounded-full bg-(--orchird-green)/14 blur-3xl" />

      <div className="container-x relative z-10">
        <div className="grid items-stretch gap-6 lg:grid-cols-[1.1fr_1fr]">
          <MotionDiv
            className="relative overflow-hidden rounded-3xl border border-(--orchird-lilac)/60 bg-linear-to-br from-[#fbf5ff] via-white to-[#eef9f1] p-7 shadow-[0_24px_56px_rgba(69,32,110,0.16)] md:p-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
          >
            <span className="inline-flex items-center gap-2 rounded-full bg-(--orchird-lavender) px-4 py-1.5 text-xs font-black uppercase tracking-[0.14em] text-white shadow-[0_12px_28px_rgba(99,32,159,0.3)]">
              <FaStar />
              {content.badge}
            </span>

            <h1 className="mt-5 max-w-xl text-3xl font-black leading-tight text-[#32174f] md:text-5xl">{content.title}</h1>
            <p className="mt-4 max-w-2xl text-base leading-8 text-(--orchird-black)/76 md:text-lg">{content.subtitle}</p>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              {authHighlights.map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-(--orchird-lilac)/55 bg-white/85 px-4 py-4 text-center shadow-[0_10px_24px_rgba(69,32,110,0.1)]"
                >
                  <span className="mx-auto inline-flex h-9 w-9 items-center justify-center rounded-full bg-linear-to-br from-(--orchird-lavender) to-(--orchird-green-dark) text-white">
                    <FaShieldAlt />
                  </span>
                  <p className="mt-2 text-xs font-black uppercase tracking-[0.12em] text-[#633494]">{item}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 rounded-2xl border border-(--orchird-lilac)/55 bg-white/80 p-4 shadow-sm md:p-5">
              <p className="text-xs font-black uppercase tracking-[0.16em] text-[#7b4aae]">{content.sideTitle}</p>
              <p className="mt-2 text-sm leading-7 text-(--orchird-black)/74 md:text-base">{content.sideText}</p>
            </div>
          </MotionDiv>

          <MotionDiv
            className="rounded-3xl border border-(--orchird-lilac)/60 bg-white/90 p-6 shadow-[0_24px_56px_rgba(69,32,110,0.16)] backdrop-blur-sm md:p-8"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.05 }}
          >
            <div className="mb-6 flex items-center gap-3">
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-linear-to-br from-(--orchird-lavender) to-(--orchird-green-dark) text-white shadow-[0_12px_28px_rgba(69,32,110,0.26)]">
                <FaLock />
              </span>
              <h2 className="text-xl font-black text-[#3a1d59] md:text-2xl">{content.panelTitle}</h2>
            </div>
            {children}
            {footer ? <div className="mt-5 text-center">{footer}</div> : null}
          </MotionDiv>
        </div>
      </div>
    </section>
  )
}

export default AuthLayout
