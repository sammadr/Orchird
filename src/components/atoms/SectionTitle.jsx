import { motion } from 'framer-motion'

const MotionDiv = motion.div
const MotionSpan = motion.span
const MotionH2 = motion.h2

function SectionTitle({ number, title, highlight }) {
  return (
    <MotionDiv
      className="relative mb-16 text-center md:mb-20"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.45 }}
      transition={{ duration: 0.55, ease: 'easeOut' }}
    >
      <MotionSpan
        className="pointer-events-none absolute left-1/2 top-full -z-10 -translate-x-1/2 -translate-y-[70%] select-none text-[84px] font-black leading-none text-[#d8c4eb]/60 md:text-[124px]"
        initial={{ opacity: 0, scale: 0.88 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, amount: 0.45 }}
        transition={{ duration: 0.5, delay: 0.05 }}
      >
        {number}
      </MotionSpan>

      <MotionH2
        className="relative text-4xl font-black leading-tight tracking-tight text-[#45206e] md:text-5xl lg:text-6xl"
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.45 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        {title}
        {highlight ? (
          <>
            {' '}
            <span className="bg-linear-to-r from-[#6d2bb3] to-[#8f00e4] bg-clip-text text-transparent">
              {highlight}
            </span>
          </>
        ) : null}
      </MotionH2>

      <MotionDiv
        className="mx-auto mt-5 h-1 w-24 rounded-full bg-linear-to-r from-[#6d2bb3] to-[#8f00e4]"
        initial={{ opacity: 0, scaleX: 0.4 }}
        whileInView={{ opacity: 1, scaleX: 1 }}
        viewport={{ once: true, amount: 0.45 }}
        transition={{ duration: 0.45, delay: 0.2 }}
      />
    </MotionDiv>
  )
}

export default SectionTitle
