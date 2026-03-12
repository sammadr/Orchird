import { useState } from 'react'
import { motion } from 'framer-motion'
import { FaClock, FaEnvelope, FaMapMarkerAlt, FaPaperPlane, FaWhatsapp } from 'react-icons/fa'
import { contactInfo } from '../data/contactInfo'
import { contactPageContent, emailRegex, getSalonStatus, getTodayLabel } from '../data/contactPageData'

const MotionDiv = motion.div
const MotionSection = motion.section

function Contact() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  })
  const [errors, setErrors] = useState({})
  const [sent, setSent] = useState(false)
  const salonStatus = getSalonStatus()
  const todayLabel = getTodayLabel()

  const onFieldChange = (field) => (event) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }))
    setErrors((prev) => ({ ...prev, [field]: '' }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    setSent(false)

    const nextErrors = {}

    if (form.name.trim().length < 3) nextErrors.name = contactPageContent.validations.name
    if (!emailRegex.test(form.email.trim())) nextErrors.email = contactPageContent.validations.email
    if (form.subject.trim() && form.subject.trim().length < 3) nextErrors.subject = contactPageContent.validations.subject
    if (form.message.trim().length < 12) nextErrors.message = contactPageContent.validations.message

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors)
      return
    }

    setSent(true)
    setErrors({})
    setForm({ name: '', email: '', subject: '', message: '' })
  }

  return (
    <div className="relative overflow-hidden pb-20">
      <div className="pointer-events-none absolute -left-20 top-24 h-72 w-72 rounded-full bg-(--orchird-lilac)/30 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 top-[45%] h-80 w-80 rounded-full bg-(--orchird-green)/16 blur-3xl" />

      <MotionSection
        className="relative"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
      >
        <div className="relative h-90 w-full overflow-hidden md:h-117.5">
          <iframe
            src={contactInfo.mapEmbedUrl}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Mapa de Orchid Beauty Salon"
            className="h-full w-full"
          />
          <div className="absolute inset-0 bg-linear-to-t from-[#4a2374]/72 via-[#4a2374]/45 to-[#4a2374]/25" />
          <div className="absolute inset-x-0 bottom-0 mx-auto w-[min(1250px,95%)] pb-8">
            <div className="w-fit max-w-3xl rounded-2xl border border-[#24a645]/25 bg-[#24a645]/42 p-4 backdrop-blur-sm md:p-6">
              <h1 className="text-4xl font-black uppercase text-white drop-shadow md:text-6xl">{contactPageContent.hero.title}</h1>
              <p className="mt-2 max-w-2xl text-sm leading-7 text-white md:text-base">
                {contactPageContent.hero.description}
              </p>
            </div>
          </div>
        </div>
      </MotionSection>

      <section className="container-x pt-10 md:pt-14">
        <div className="grid items-start gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <MotionDiv
            className="space-y-5"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.4 }}
          >
            <a
              href={contactInfo.mapLink}
              target="_blank"
              rel="noreferrer"
              className="group block rounded-3xl border border-(--orchird-lilac)/55 bg-white/90 p-5 shadow-[0_16px_34px_rgba(69,32,110,0.13)] transition hover:-translate-y-1 hover:shadow-[0_22px_48px_rgba(69,32,110,0.18)]"
            >
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-linear-to-br from-(--orchird-lavender) to-[#8f00e4] text-white shadow-[0_10px_22px_rgba(99,32,159,0.34)]">
                <FaMapMarkerAlt />
              </span>
              <h2 className="mt-3 text-xl font-black text-[#4a2374]">{contactPageContent.cards.addressTitle}</h2>
              <p className="mt-2 text-sm leading-7 text-(--orchird-black)/78">{contactInfo.addressShort}</p>
              <p className="mt-1 text-sm leading-7 text-(--orchird-black)/72">{contactInfo.addressLong}</p>
              <p className="mt-3 text-xs font-black uppercase tracking-[0.12em] text-(--orchird-green) transition group-hover:tracking-[0.14em]">
                {contactPageContent.cards.mapsCta}
              </p>
            </a>

            <div className="grid gap-5 md:grid-cols-2">
              <a
                href={`mailto:${contactInfo.email}`}
                className="group rounded-3xl border border-(--orchird-lilac)/55 bg-white/90 p-5 shadow-[0_16px_34px_rgba(69,32,110,0.13)] transition hover:-translate-y-1 hover:shadow-[0_22px_48px_rgba(69,32,110,0.18)]"
              >
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-linear-to-br from-(--orchird-lavender) to-(--orchird-green-dark) text-white">
                  <FaEnvelope />
                </span>
                <h3 className="mt-3 text-lg font-black text-[#4a2374]">{contactPageContent.cards.emailTitle}</h3>
                <p className="mt-2 text-sm text-(--orchird-black)/78">{contactInfo.email}</p>
                <p className="mt-3 text-xs font-black uppercase tracking-[0.12em] text-(--orchird-green) transition group-hover:tracking-[0.14em]">
                  {contactPageContent.cards.emailCta}
                </p>
              </a>

              <a
                href={`https://wa.me/18297923068`}
                target="_blank"
                rel="noreferrer"
                className="group rounded-3xl border border-(--orchird-lilac)/55 bg-white/90 p-5 shadow-[0_16px_34px_rgba(69,32,110,0.13)] transition hover:-translate-y-1 hover:shadow-[0_22px_48px_rgba(69,32,110,0.18)]"
              >
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-linear-to-br from-(--orchird-green) to-(--orchird-green-dark) text-white">
                  <FaWhatsapp />
                </span>
                <h3 className="mt-3 text-lg font-black text-[#4a2374]">{contactPageContent.cards.whatsappTitle}</h3>
                <p className="mt-2 text-sm text-(--orchird-black)/78">{contactInfo.whatsapp}</p>
                <p className="mt-3 text-xs font-black uppercase tracking-[0.12em] text-(--orchird-green) transition group-hover:tracking-[0.14em]">
                  {contactPageContent.cards.whatsappCta}
                </p>
              </a>
            </div>

            <div className="rounded-3xl border border-(--orchird-lilac)/55 bg-white/90 p-5 shadow-[0_16px_34px_rgba(69,32,110,0.13)]">
              <div className="flex items-center gap-3">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-linear-to-br from-(--orchird-lavender) to-(--orchird-green-dark) text-white">
                  <FaClock />
                </span>
                <h3 className="text-xl font-black text-[#4a2374]">{contactPageContent.cards.hoursTitle}</h3>
              </div>
              <div className={`mt-4 inline-flex items-center rounded-full border px-3 py-1 text-xs font-black uppercase tracking-[0.12em] ${salonStatus.badgeClass}`}>
                {salonStatus.label}
              </div>
              <p className="mt-2 text-sm font-semibold text-(--orchird-black)/75">{salonStatus.detail}</p>
              <div className="mt-4 grid gap-2">
                {contactInfo.hours.map((item) => (
                  <div
                    key={item.day}
                    className={`flex items-center justify-between rounded-xl border px-4 py-2 text-sm ${
                      item.day === todayLabel
                        ? 'border-(--orchird-green)/55 bg-linear-to-r from-(--orchird-green)/16 to-(--orchird-lilac)/25 text-[#2f6d45] ring-1 ring-(--orchird-green)/35 shadow-[0_0_0_2px_rgba(33,191,72,0.12),0_10px_22px_rgba(33,191,72,0.18)] animate-pulse'
                        : item.closed
                        ? 'border-red-200 bg-red-50 text-red-700'
                        : 'border-(--orchird-lilac)/45 bg-white text-(--orchird-black)/80'
                    }`}
                  >
                    <span className="font-bold">
                      {item.day}
                      {item.day === todayLabel ? (
                        <span className="ml-2 rounded-full bg-(--orchird-green) px-2 py-0.5 text-[10px] font-black uppercase tracking-widest text-white">
                          Hoy
                        </span>
                      ) : null}
                    </span>
                    <span className="font-semibold">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </MotionDiv>

          <MotionDiv
            className="rounded-3xl border border-(--orchird-lilac)/55 bg-white/92 p-6 shadow-[0_20px_42px_rgba(69,32,110,0.16)]"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.42, delay: 0.05 }}
          >
            <h2 className="text-2xl font-black text-[#4a2374] md:text-3xl">{contactPageContent.form.title}</h2>
            <p className="mt-2 text-sm leading-7 text-(--orchird-black)/75">
              {contactPageContent.form.description}
            </p>

            <form onSubmit={handleSubmit} className="mt-5 space-y-4">
              <input
                type="text"
                value={form.name}
                onChange={onFieldChange('name')}
                placeholder={contactPageContent.form.placeholders.name}
                className={`h-12 w-full rounded-xl border bg-white px-4 text-sm outline-none transition focus:border-(--orchird-green) focus:shadow-[0_0_0_4px_rgba(33,191,72,0.14)] ${
                  errors.name ? 'border-red-300' : 'border-(--orchird-lilac)/65'
                }`}
              />
              {errors.name ? <p className="text-xs font-semibold text-red-600">{errors.name}</p> : null}
              <input
                type="email"
                value={form.email}
                onChange={onFieldChange('email')}
                placeholder={contactPageContent.form.placeholders.email}
                className={`h-12 w-full rounded-xl border bg-white px-4 text-sm outline-none transition focus:border-(--orchird-green) focus:shadow-[0_0_0_4px_rgba(33,191,72,0.14)] ${
                  errors.email ? 'border-red-300' : 'border-(--orchird-lilac)/65'
                }`}
              />
              {errors.email ? <p className="text-xs font-semibold text-red-600">{errors.email}</p> : null}
              <input
                type="text"
                value={form.subject}
                onChange={onFieldChange('subject')}
                placeholder={contactPageContent.form.placeholders.subject}
                className={`h-12 w-full rounded-xl border bg-white px-4 text-sm outline-none transition focus:border-(--orchird-green) focus:shadow-[0_0_0_4px_rgba(33,191,72,0.14)] ${
                  errors.subject ? 'border-red-300' : 'border-(--orchird-lilac)/65'
                }`}
              />
              {errors.subject ? <p className="text-xs font-semibold text-red-600">{errors.subject}</p> : null}
              <textarea
                value={form.message}
                onChange={onFieldChange('message')}
                placeholder={contactPageContent.form.placeholders.message}
                rows={5}
                className={`w-full rounded-xl border bg-white px-4 py-3 text-sm outline-none transition focus:border-(--orchird-green) focus:shadow-[0_0_0_4px_rgba(33,191,72,0.14)] ${
                  errors.message ? 'border-red-300' : 'border-(--orchird-lilac)/65'
                }`}
              />
              {errors.message ? <p className="text-xs font-semibold text-red-600">{errors.message}</p> : null}

              <button
                type="submit"
                className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-linear-to-r from-(--orchird-green) to-(--orchird-green-dark) text-sm font-black uppercase tracking-[0.14em] text-white shadow-[0_14px_30px_rgba(33,191,72,0.34)] transition hover:-translate-y-0.5 hover:brightness-105"
              >
                <FaPaperPlane />
                {contactPageContent.form.submitLabel}
              </button>

              {sent ? (
                <p className="rounded-xl border border-(--orchird-green)/35 bg-(--orchird-green)/12 px-4 py-3 text-sm font-semibold text-(--orchird-green-dark)">
                  {contactPageContent.form.success}
                </p>
              ) : null}
            </form>

            <div className="mt-5 rounded-2xl border border-(--orchird-lilac)/55 bg-linear-to-r from-white to-(--orchird-lilac)/15 p-4">
              <p className="text-xs font-black uppercase tracking-[0.13em] text-[#6e3ca4]">{contactPageContent.form.quickReplyTitle}</p>
              <p className="mt-1 text-sm text-(--orchird-black)/75">{contactPageContent.form.quickReplyDescription}</p>
            </div>
          </MotionDiv>
        </div>
      </section>
    </div>
  )
}

export default Contact
