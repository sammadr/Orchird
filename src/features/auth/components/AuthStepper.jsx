import { motion } from 'framer-motion'

const MotionDiv = motion.div
const MotionSpan = motion.span

function AuthStepper({ currentStep = 1 }) {
  const isStepOneActive = currentStep === 1
  const isStepTwoActive = currentStep === 2

  return (
    <MotionDiv
      className="mx-auto flex w-full max-w-47.5 items-center justify-center gap-3 py-2"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
    >
      <MotionSpan
        animate={
          isStepOneActive
            ? { scale: [1, 1.06, 1], boxShadow: ['0 0 0 rgba(33,191,72,0)', '0 0 24px rgba(33,191,72,0.4)', '0 0 0 rgba(33,191,72,0)'] }
            : { scale: 1 }
        }
        transition={{ duration: 1.8, repeat: isStepOneActive ? Infinity : 0, ease: 'easeInOut' }}
        className={`inline-flex h-10 w-10 items-center justify-center rounded-full text-sm font-black transition ${
          isStepOneActive
            ? 'bg-(--orchird-green) text-white shadow-[0_10px_24px_rgba(33,191,72,0.35)]'
            : 'bg-white text-[#5b2f8d] border border-(--orchird-lilac)/60'
        }`}
      >
        1
      </MotionSpan>
      <MotionSpan
        className="h-1 w-14 rounded-full bg-linear-to-r from-(--orchird-lavender) to-(--orchird-lilac)"
        animate={
          isStepTwoActive
            ? { opacity: [0.65, 1, 0.65], scaleX: [1, 1.08, 1] }
            : { opacity: [0.55, 0.9, 0.55] }
        }
        transition={{ duration: 1.7, repeat: Infinity, ease: 'easeInOut' }}
      />
      <MotionSpan
        animate={
          isStepTwoActive
            ? { scale: [1, 1.06, 1], boxShadow: ['0 0 0 rgba(33,191,72,0)', '0 0 24px rgba(33,191,72,0.4)', '0 0 0 rgba(33,191,72,0)'] }
            : { scale: 1 }
        }
        transition={{ duration: 1.8, repeat: isStepTwoActive ? Infinity : 0, ease: 'easeInOut' }}
        className={`inline-flex h-10 w-10 items-center justify-center rounded-full text-sm font-black transition ${
          isStepTwoActive
            ? 'bg-(--orchird-green) text-white shadow-[0_10px_24px_rgba(33,191,72,0.35)]'
            : 'bg-white text-[#5b2f8d] border border-(--orchird-lilac)/60'
        }`}
      >
        2
      </MotionSpan>
    </MotionDiv>
  )
}

export default AuthStepper
