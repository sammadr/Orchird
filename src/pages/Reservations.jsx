import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import {
  FaCalendarAlt,
  FaCheckCircle,
  FaClock,
  FaLock,
  FaPlus,
  FaUserTie,
} from 'react-icons/fa'
import { reservationServices, reservationStaff } from '../data/reservationsData'
import {
  categoryStyles,
  formatMoney,
  getAvailableSlots,
  getUpcomingDays,
  groupByCategory,
  reservationsPageContent,
  sectionTitleClass,
} from '../data/reservationsPageData'

const MotionDiv = motion.div
const MotionSection = motion.section
const staffMap = new Map(reservationStaff.map((person) => [person.id, person]))
const RESERVATION_DRAFT_KEY = 'orchirdReservationDraftIds'
const RESERVATION_PREFILL_KEY = 'orchirdReservationPrefill'
const RESERVATION_TOAST_KEY = 'orchirdReservationToast'

function Reservations() {
  const isLogged = localStorage.getItem('orchirdSession') === 'active'
  const userName = localStorage.getItem('orchirdUserName') ?? 'Cliente'
  const userEmail = localStorage.getItem('orchirdUserEmail') ?? ''
  const userRole = localStorage.getItem('orchirdUserRole') ?? 'cliente'

  const [appointments, setAppointments] = useState(() => {
    const draftIds = JSON.parse(localStorage.getItem(RESERVATION_DRAFT_KEY) ?? '[]')
    const prefillIds = JSON.parse(localStorage.getItem(RESERVATION_PREFILL_KEY) ?? '[]')

    const validDraft = Array.isArray(draftIds) ? draftIds : []
    const validPrefill = Array.isArray(prefillIds) ? prefillIds : []
    const uniqueIds = Array.from(new Set([...validDraft, ...validPrefill]))

    if (uniqueIds.length === 0) return []

    const prefillServices = uniqueIds
      .map((serviceId) => reservationServices.find((service) => service.id === serviceId))
      .filter(Boolean)

    return prefillServices.map((service, index) => ({
      appointmentId: `ap-prefill-${index + 1}`,
      serviceId: service.id,
      serviceName: service.name,
      category: service.category,
      price: service.price,
      duration: service.duration,
      staffId: service.staffIds[0] ?? '',
      dayId: '',
      time: '',
    }))
  })

  const appointmentCounter = useRef(1)
  const [notes, setNotes] = useState('')
  const [errors, setErrors] = useState('')
  const [success, setSuccess] = useState(false)
  const [reservationToast, setReservationToast] = useState(() => localStorage.getItem(RESERVATION_TOAST_KEY) ?? '')
  const [hasPendingRequest, setHasPendingRequest] = useState(() => {
    const savedRequests = JSON.parse(localStorage.getItem('orchirdReservations') ?? '[]')
    return savedRequests.some(
      (request) => request.userEmail === userEmail && (!request.status || request.status === 'pending'),
    )
  })

  const groupedServices = useMemo(() => groupByCategory(reservationServices), [])
  const days = useMemo(() => getUpcomingDays(5), [])

  useEffect(() => {
    localStorage.removeItem(RESERVATION_TOAST_KEY)
    localStorage.removeItem(RESERVATION_PREFILL_KEY)
  }, [])

  useEffect(() => {
    appointmentCounter.current = appointments.length + 1

    if (appointments.length === 0) {
      localStorage.removeItem(RESERVATION_DRAFT_KEY)
      return
    }

    const serviceIds = Array.from(new Set(appointments.map((item) => item.serviceId)))
    localStorage.setItem(RESERVATION_DRAFT_KEY, JSON.stringify(serviceIds))
  }, [appointments])

  useEffect(() => {
    if (!reservationToast) return undefined
    const timerId = setTimeout(() => setReservationToast(''), 2400)
    return () => clearTimeout(timerId)
  }, [reservationToast])

  const totalAmount = appointments.reduce((total, item) => total + Number(item.price ?? 0), 0)
  const hasAppointments = appointments.length > 0

  const createAppointmentFromService = (service) => {
    const appointmentId = `ap-${appointmentCounter.current}`
    appointmentCounter.current += 1

    return {
      appointmentId,
      serviceId: service.id,
      serviceName: service.name,
      category: service.category,
      price: service.price,
      duration: service.duration,
      staffId: service.staffIds[0] ?? '',
      dayId: '',
      time: '',
    }
  }

  const handleAddService = (service) => {
    setSuccess(false)
    setErrors('')
    setReservationToast(`Servicio agregado: ${service.name}`)
    setAppointments((prev) => [...prev, createAppointmentFromService(service)])
  }

  const handleRemoveAppointment = (appointmentId) => {
    setAppointments((prev) => prev.filter((item) => item.appointmentId !== appointmentId))
  }

  const handleAppointmentChange = (appointmentId, field, value) => {
    setSuccess(false)
    setErrors('')
    setAppointments((prev) =>
      prev.map((item) => {
        if (item.appointmentId !== appointmentId) return item
        if (field === 'staffId') return { ...item, staffId: value, dayId: '', time: '' }
        if (field === 'dayId') return { ...item, dayId: value, time: '' }
        return { ...item, [field]: value }
      }),
    )
  }

  const handleSubmitRequest = () => {
    setSuccess(false)

    if (appointments.length === 0) {
      setErrors('Agrega al menos un servicio para continuar.')
      return
    }

    const missingFields = appointments.some((item) => !item.staffId || !item.dayId || !item.time)
    if (missingFields) {
      setErrors('Completa especialista, fecha y hora en todos los servicios.')
      return
    }

    const savedRequests = JSON.parse(localStorage.getItem('orchirdReservations') ?? '[]')
    savedRequests.push({
      id: `r-${Date.now()}`,
      userEmail,
      userName,
      role: userRole,
      status: 'pending',
      notes,
      createdAt: new Date().toISOString(),
      appointments,
    })
    localStorage.setItem('orchirdReservations', JSON.stringify(savedRequests))
    setHasPendingRequest(true)

    setSuccess(true)
    setErrors('')
    setAppointments([])
    setNotes('')
  }

  if (!isLogged) {
    return (
      <section className="container-x py-16">
        <div className="mx-auto max-w-3xl rounded-3xl border border-(--orchird-lilac)/65 bg-white/92 p-8 text-center shadow-[0_22px_50px_rgba(69,32,110,0.16)]">
          <span className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-full bg-linear-to-br from-(--orchird-lavender) to-(--orchird-green-dark) text-white shadow-[0_12px_28px_rgba(69,32,110,0.32)]">
            <FaLock />
          </span>
          <h1 className="mt-4 text-3xl font-black text-[#4b2274] md:text-5xl">Reservas para clientes registrados</h1>
          <p className="mt-4 text-base leading-8 text-(--orchird-black)/75">
            Para agendar una cita debes iniciar sesión o crear una cuenta de cliente.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link
              to="/login"
              state={{ redirectTo: '/reservas' }}
              className="inline-flex h-11 items-center justify-center rounded-full bg-(--orchird-green) px-6 text-sm font-black uppercase tracking-[0.12em] text-white transition hover:bg-(--orchird-green-dark)"
            >
              Iniciar sesión
            </Link>
            <Link
              to="/registro"
              className="inline-flex h-11 items-center justify-center rounded-full bg-(--orchird-lilac) px-6 text-sm font-black uppercase tracking-[0.12em] text-[#4b2274] transition hover:bg-(--orchird-lavender) hover:text-white"
            >
              Crear cuenta
            </Link>
          </div>
        </div>
      </section>
    )
  }

  return (
    <div className="relative overflow-hidden pb-20">
      <AnimatePresence>
        {reservationToast ? (
          <motion.div
            className="fixed right-4 top-24 z-50 rounded-2xl border border-(--orchird-green)/40 bg-white/95 px-4 py-3 text-sm font-bold text-(--orchird-green-dark) shadow-[0_14px_28px_rgba(33,191,72,0.22)] backdrop-blur-sm"
            initial={{ opacity: 0, y: -10, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.96 }}
            transition={{ duration: 0.2 }}
          >
            <span className="inline-flex items-center gap-2">
              <FaCheckCircle />
              {reservationToast}
            </span>
          </motion.div>
        ) : null}
      </AnimatePresence>
      <div className="pointer-events-none absolute -left-24 top-20 h-80 w-80 rounded-full bg-(--orchird-lilac)/32 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 top-[42%] h-80 w-80 rounded-full bg-(--orchird-green)/14 blur-3xl" />

      <MotionSection
        className="relative overflow-hidden bg-linear-to-r from-(--orchird-lavender) via-[#c792e4] to-(--orchird-lavender) py-14 md:py-20"
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="container-x">
          <p className="text-xs font-black uppercase tracking-[0.24em] text-white/90">{reservationsPageContent.hero.eyebrow}</p>
          <h1 className="mt-3 text-4xl font-black uppercase text-white md:text-6xl">{reservationsPageContent.hero.title}</h1>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-white/90 md:text-base">
            {reservationsPageContent.hero.description}
          </p>
        </div>
      </MotionSection>

      <section className="container-x pt-10 md:pt-14">
        <div className="rounded-2xl border border-(--orchird-lilac)/60 bg-white/88 px-5 py-4 text-sm font-semibold text-[#4b2274] shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="inline-flex items-center rounded-full border border-(--orchird-lilac)/60 bg-linear-to-r from-(--orchird-lilac)/25 to-white px-3 py-1 text-[11px] font-black uppercase tracking-[0.12em] text-[#6d3ea2]">
                Experiencia guiada
              </p>
              <p className="mt-2 text-lg font-black text-[#4b2274] md:text-xl">
                Hola, <span className="text-(--orchird-green-dark)">{userName}</span>. Tu cita está a un paso de confirmarse.
              </p>
              <p className="mt-1 text-sm leading-7 text-(--orchird-black)/72">
                Nuestro equipo revisará tu solicitud y en unos minutos recibirás un correo de confirmación.
              </p>
            </div>
            <div
              className={`rounded-2xl border px-4 py-3 ${
                hasPendingRequest
                  ? 'border-amber-300 bg-linear-to-r from-amber-100 to-white'
                  : hasAppointments
                  ? 'border-(--orchird-green)/35 bg-linear-to-r from-(--orchird-green)/12 to-white'
                  : 'border-gray-300 bg-linear-to-r from-gray-100 to-white'
              }`}
            >
              <p
                className={`text-[11px] font-black uppercase tracking-[0.12em] ${
                  hasPendingRequest ? 'text-amber-700' : hasAppointments ? 'text-(--orchird-green-dark)' : 'text-gray-500'
                }`}
              >
                Estado
              </p>
              <p
                className={`mt-1 text-sm font-bold ${
                  hasPendingRequest ? 'text-amber-700' : hasAppointments ? 'text-[#2a7f45]' : 'text-gray-600'
                }`}
              >
                {hasPendingRequest ? 'Pendiente de revisión' : hasAppointments ? 'Preparando solicitud' : 'Sin citas agregadas'}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-7 grid gap-6 lg:grid-cols-[1.12fr_0.88fr]">
          <MotionDiv
            className="space-y-6"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.42 }}
          >
            <div className="rounded-3xl border border-(--orchird-lilac)/60 bg-white/92 p-5 shadow-[0_18px_40px_rgba(69,32,110,0.14)]">
              <h2 className={sectionTitleClass}>{reservationsPageContent.sections.choose}</h2>
              <p className="mt-2 text-sm text-(--orchird-black)/74">{reservationsPageContent.sections.chooseHelp}</p>

              <div className="mt-4 space-y-4">
                {Object.entries(groupedServices).map(([category, items]) => (
                  <div key={category} className="rounded-2xl border border-(--orchird-lilac)/55 bg-white p-4">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="text-sm font-black uppercase tracking-[0.14em] text-[#6d3ea2]">{category}</h3>
                      <span className="h-1 w-10 rounded-full bg-linear-to-r from-(--orchird-lavender) to-(--orchird-green)" />
                    </div>
                    <div className="mt-3 grid gap-3 sm:grid-cols-2">
                      {items.map((service) => (
                        <button
                          key={service.id}
                          type="button"
                          onClick={() => handleAddService(service)}
                          className={`group rounded-xl border border-(--orchird-lilac)/55 bg-linear-to-r ${
                            categoryStyles[category]?.surface ?? 'from-white to-(--orchird-lilac)/18'
                          } p-3 text-left transition hover:-translate-y-0.5 hover:border-(--orchird-green)/45 hover:shadow-[0_10px_22px_rgba(69,32,110,0.14)]`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <p className="text-sm font-black text-[#3f205f]">{service.name}</p>
                            <span
                              className={`rounded-full border px-2 py-0.5 text-[10px] font-black uppercase tracking-widest ${
                                categoryStyles[category]?.chip ?? 'border-(--orchird-lilac)/60 bg-white text-[#5f2f91]'
                              }`}
                            >
                              {categoryStyles[category]?.tag ?? category}
                            </span>
                          </div>
                          <p className="mt-1 text-xs text-(--orchird-black)/70">{formatMoney(service.price)} · {service.duration} min</p>
                          <span className="mt-2 inline-flex items-center gap-1 text-[11px] font-black uppercase tracking-[0.12em] text-(--orchird-green)">
                            <FaPlus />
                            Agregar
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </MotionDiv>

          <MotionDiv
            className="h-fit rounded-3xl border border-(--orchird-lilac)/60 bg-white/94 p-5 shadow-[0_18px_40px_rgba(69,32,110,0.14)] lg:sticky lg:top-24"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.08 }}
          >
            <h2 className={sectionTitleClass}>{reservationsPageContent.sections.added}</h2>
            <p className="mt-2 text-sm text-(--orchird-black)/72">{reservationsPageContent.sections.addedHelp}</p>

            <div className="mt-4 max-h-[52vh] space-y-4 overflow-y-auto pr-1">
              {appointments.length === 0 ? (
                <p className="rounded-xl border border-(--orchird-lilac)/55 bg-[#f8f2fc] px-4 py-3 text-sm text-(--orchird-black)/72">
                  Aún no has agregado servicios.
                </p>
              ) : (
                appointments.map((item) => {
                  const selectedService = reservationServices.find((service) => service.id === item.serviceId)
                  const availableStaff = reservationStaff.filter((person) => selectedService?.staffIds.includes(person.id))
                  const selectedDay = days.find((day) => day.id === item.dayId)
                  const slots = getAvailableSlots(item.serviceId, item.staffId, selectedDay)

                  return (
                    <div key={item.appointmentId} className="rounded-2xl border border-(--orchird-lilac)/58 bg-white p-4">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <span
                            className={`inline-flex rounded-full border px-2 py-0.5 text-[10px] font-black uppercase tracking-widest ${
                              categoryStyles[item.category]?.chip ?? 'border-(--orchird-lilac)/60 bg-white text-[#5f2f91]'
                            }`}
                          >
                            {categoryStyles[item.category]?.tag ?? item.category}
                          </span>
                          <h3 className="text-lg font-black text-[#3f205f]">{item.serviceName}</h3>
                          <p className="mt-1 text-sm text-(--orchird-black)/72">
                            {item.duration} min · {formatMoney(item.price)}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveAppointment(item.appointmentId)}
                          className="rounded-full bg-(--orchird-lilac)/28 px-3 py-1 text-[11px] font-black uppercase tracking-[0.12em] text-[#6d3ea2] transition hover:bg-(--orchird-lavender) hover:text-white"
                        >
                          Quitar
                        </button>
                      </div>

                      <div className="mt-4 grid gap-3 md:grid-cols-2">
                        <label className="space-y-1.5">
                          <span className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.12em] text-[#6d3ea2]">
                            <FaUserTie />
                            Especialista
                          </span>
                          <select
                            value={item.staffId}
                            onChange={(event) => handleAppointmentChange(item.appointmentId, 'staffId', event.target.value)}
                            className="h-11 w-full rounded-xl border border-(--orchird-lilac)/65 bg-white px-3 text-sm outline-none transition focus:border-(--orchird-green)"
                          >
                            {availableStaff.map((person) => (
                              <option key={person.id} value={person.id}>
                                {person.name} · {person.role}
                              </option>
                            ))}
                          </select>
                        </label>
                        <label className="space-y-1.5">
                          <span className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.12em] text-[#6d3ea2]">
                            <FaCalendarAlt />
                            Día
                          </span>
                          <select
                            value={item.dayId}
                            onChange={(event) => handleAppointmentChange(item.appointmentId, 'dayId', event.target.value)}
                            className="h-11 w-full rounded-xl border border-(--orchird-lilac)/65 bg-white px-3 text-sm outline-none transition focus:border-(--orchird-green)"
                          >
                            <option value="">Selecciona una fecha</option>
                            {days.map((day) => (
                              <option key={day.id} value={day.id}>
                                {day.dayLabel} · {day.dateLabel}
                              </option>
                            ))}
                          </select>
                        </label>
                      </div>

                      <div className="mt-4 rounded-xl border border-(--orchird-lilac)/55 bg-[#faf7fd] p-3">
                        {!item.dayId ? (
                          <p className="text-sm text-(--orchird-black)/70">Selecciona un día para ver las horas disponibles.</p>
                        ) : (
                          <div className="flex flex-wrap gap-2">
                            {slots.length === 0 ? (
                              <p className="text-sm text-(--orchird-black)/70">No hay cupos para esa fecha. Prueba otro día.</p>
                            ) : (
                              slots.map((slot) => (
                                <button
                                  key={`${item.appointmentId}-${slot}`}
                                  type="button"
                                  onClick={() => handleAppointmentChange(item.appointmentId, 'time', slot)}
                                  className={`rounded-lg border px-3 py-2 text-xs font-black uppercase tracking-[0.12em] transition ${
                                    item.time === slot
                                      ? 'border-(--orchird-green) bg-(--orchird-green) text-white shadow-[0_10px_20px_rgba(33,191,72,0.32)]'
                                      : 'border-(--orchird-lilac)/55 bg-white text-[#5f2f91] hover:bg-(--orchird-lilac)/28'
                                  }`}
                                >
                                  <FaClock className="mr-1 inline" />
                                  {slot}
                                </button>
                              ))
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })
              )}
            </div>

            <div className="mt-8 border-t border-(--orchird-lilac)/50 pt-6">
              <h2 className={sectionTitleClass}>{reservationsPageContent.sections.summary}</h2>
            </div>
            <p className="mt-2 text-sm text-(--orchird-black)/72">{reservationsPageContent.sections.summaryHelp}</p>

            <div className="mt-4 space-y-3">
              {appointments.length === 0 ? (
                <p className="rounded-xl border border-(--orchird-lilac)/55 bg-[#f8f2fc] px-4 py-3 text-sm text-(--orchird-black)/72">
                  Aún no has agregado servicios.
                </p>
              ) : (
                appointments.map((item) => (
                  <div key={`summary-${item.appointmentId}`} className="rounded-xl border border-(--orchird-lilac)/50 bg-white px-4 py-3 text-sm">
                    <p className="font-black text-[#3f205f]">{item.serviceName}</p>
                    <p className="mt-1 text-(--orchird-black)/70">
                      {staffMap.get(item.staffId)?.name ?? 'Sin especialista'} · {item.dayId || 'Sin fecha'} · {item.time || 'Sin hora'}
                    </p>
                  </div>
                ))
              )}
            </div>

            <div className="mt-4 rounded-xl border border-(--orchird-lilac)/55 bg-[#faf7fd] p-3">
              <p className="text-xs font-black uppercase tracking-[0.12em] text-[#6d3ea2]">Total estimado</p>
              <p className="mt-1 text-2xl font-black text-(--orchird-green-dark)">{formatMoney(totalAmount)}</p>
            </div>
            <p className="mt-2 rounded-xl border border-(--orchird-lilac)/50 bg-white px-3 py-2 text-xs font-semibold text-(--orchird-black)/74">
              * Los precios mostrados son precios base. El monto final se confirma en el salón según evaluación.
            </p>

            <label className="mt-4 block space-y-1.5">
              <span className="text-xs font-black uppercase tracking-[0.12em] text-[#6d3ea2]">Notas adicionales</span>
              <textarea
                rows={4}
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
                className="w-full rounded-xl border border-(--orchird-lilac)/65 bg-white px-3 py-2 text-sm outline-none transition focus:border-(--orchird-green)"
                placeholder="Ejemplo: prefiero atención en la tarde, alergia a algún producto, etc."
              />
            </label>

            {errors ? (
              <p className="mt-3 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm font-semibold text-red-700">{errors}</p>
            ) : null}
            {success ? (
              <p className="mt-3 rounded-xl border border-(--orchird-green)/35 bg-(--orchird-green)/12 px-3 py-2 text-sm font-semibold text-(--orchird-green-dark)">
                <FaCheckCircle className="mr-1 inline" />
                Solicitud enviada. En unos minutos te llegará un correo electrónico de confirmación de tu cita.
              </p>
            ) : null}

            <button
              type="button"
              onClick={handleSubmitRequest}
              className="mt-4 inline-flex h-12 w-full items-center justify-center rounded-xl bg-linear-to-r from-(--orchird-green) to-(--orchird-green-dark) text-sm font-black uppercase tracking-[0.14em] text-white shadow-[0_14px_30px_rgba(33,191,72,0.34)] transition hover:-translate-y-0.5 hover:brightness-105"
            >
              Enviar solicitud de cita
            </button>
          </MotionDiv>
        </div>
      </section>
    </div>
  )
}

export default Reservations














