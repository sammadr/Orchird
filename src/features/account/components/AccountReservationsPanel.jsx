import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  FaCalendarAlt,
  FaCheckCircle,
  FaClock,
  FaExclamationTriangle,
  FaFilter,
  FaListUl,
  FaTimes,
  FaTimesCircle,
  FaTrashAlt,
  FaUndo,
} from 'react-icons/fa'
import {
  normalizeReservationStatus,
  reservationFilters,
  reservationStatusConfig,
} from '../data/reservationStatus'

const MotionDiv = motion.div
const formatMoney = (value) => `RD$ ${Number(value ?? 0).toLocaleString('en-US')}`

const filterToneClass = {
  all: 'border-gray-300 bg-gray-100 text-gray-700 hover:bg-gray-200',
  pending: 'border-amber-300 bg-amber-100 text-amber-700 hover:bg-amber-200',
  approved: 'border-[#a8d7b5] bg-[#e9f7ef] text-[#2d7d46] hover:bg-[#daf0e4]',
  cancelled: 'border-red-300 bg-red-100 text-red-700 hover:bg-red-200',
  completed: 'border-[#c8a3ea] bg-[#f2e8fb] text-[#6d3ea2] hover:bg-[#ead8fa]',
}

const formatDate = (value) => {
  if (!value) return 'Sin fecha'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return 'Sin fecha'

  return new Intl.DateTimeFormat('es-DO', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date)
}

function AccountReservationsPanel() {
  const userEmail = localStorage.getItem('orchirdUserEmail') ?? ''
  const [activeFilter, setActiveFilter] = useState('all')
  const [requests, setRequests] = useState([])
  const [deleteRequestId, setDeleteRequestId] = useState(null)

  useEffect(() => {
    const syncReservations = () => {
      const saved = JSON.parse(localStorage.getItem('orchirdReservations') ?? '[]')
      const safeList = Array.isArray(saved) ? saved : []
      const mine = safeList
        .filter((item) => String(item.userEmail ?? '').toLowerCase() === userEmail.toLowerCase())
        .sort((a, b) => new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime())

      setRequests(mine)
    }

    syncReservations()
    window.addEventListener('storage', syncReservations)
    window.addEventListener('orchird-reservations-updated', syncReservations)

    return () => {
      window.removeEventListener('storage', syncReservations)
      window.removeEventListener('orchird-reservations-updated', syncReservations)
    }
  }, [userEmail])

  useEffect(() => {
    if (!deleteRequestId) return undefined

    const onEsc = (event) => {
      if (event.key === 'Escape') setDeleteRequestId(null)
    }

    window.addEventListener('keydown', onEsc)
    return () => window.removeEventListener('keydown', onEsc)
  }, [deleteRequestId])

  const counters = useMemo(() => {
    const initial = { all: requests.length, pending: 0, approved: 0, cancelled: 0, completed: 0 }

    for (const item of requests) {
      const key = normalizeReservationStatus(item.status)
      if (typeof initial[key] === 'number') initial[key] += 1
    }

    return initial
  }, [requests])

  const visibleRequests = useMemo(() => {
    if (activeFilter === 'all') return requests
    return requests.filter((item) => normalizeReservationStatus(item.status) === activeFilter)
  }, [activeFilter, requests])

  const updateRequestsInStorage = (nextList) => {
    localStorage.setItem('orchirdReservations', JSON.stringify(nextList))
    window.dispatchEvent(new Event('orchird-reservations-updated'))
    setRequests(
      nextList
        .filter((item) => String(item.userEmail ?? '').toLowerCase() === userEmail.toLowerCase())
        .sort((a, b) => new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime()),
    )
  }

  const handleCancelRequest = (requestId) => {
    const saved = JSON.parse(localStorage.getItem('orchirdReservations') ?? '[]')
    const safeList = Array.isArray(saved) ? saved : []

    const nextList = safeList.map((item) =>
      item.id === requestId ? { ...item, status: 'cancelled', cancelledAt: new Date().toISOString() } : item,
    )

    updateRequestsInStorage(nextList)
  }

  const handleRestoreRequest = (requestId) => {
    const saved = JSON.parse(localStorage.getItem('orchirdReservations') ?? '[]')
    const safeList = Array.isArray(saved) ? saved : []

    const nextList = safeList.map((item) => {
      if (item.id !== requestId) return item
      const next = { ...item, status: 'pending' }
      delete next.cancelledAt
      return next
    })

    updateRequestsInStorage(nextList)
  }

  const handleConfirmDelete = () => {
    if (!deleteRequestId) return

    const saved = JSON.parse(localStorage.getItem('orchirdReservations') ?? '[]')
    const safeList = Array.isArray(saved) ? saved : []
    const nextList = safeList.filter((item) => item.id !== deleteRequestId)

    updateRequestsInStorage(nextList)
    setDeleteRequestId(null)
  }

  return (
    <div className="space-y-6 md:space-y-7">
      <AnimatePresence>
        {deleteRequestId ? (
          <>
            <MotionDiv
              className="fixed inset-0 z-[90] bg-[#150b22]/45 backdrop-blur-[2px]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDeleteRequestId(null)}
            />
            <MotionDiv
              className="fixed inset-0 z-[91] grid place-items-center p-4"
              initial={{ opacity: 0, scale: 0.95, y: 14 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 12 }}
              transition={{ duration: 0.2 }}
            >
              <div className="w-full max-w-md rounded-3xl border border-red-300 bg-white p-5 shadow-[0_24px_48px_rgba(125,25,25,0.28)] md:p-6">
                <div className="flex items-start justify-between gap-3">
                  <div className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-red-100 text-red-700">
                    <FaExclamationTriangle />
                  </div>
                  <button
                    type="button"
                    onClick={() => setDeleteRequestId(null)}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-red-200 text-red-600 transition hover:bg-red-50"
                    aria-label="Cerrar modal"
                  >
                    <FaTimes className="text-xs" />
                  </button>
                </div>

                <h3 className="mt-4 text-2xl font-black text-[#6f1f31]">¿Eliminar solicitud?</h3>
                <p className="mt-2 text-sm leading-7 text-(--orchird-black)/75">
                  Esta acción eliminará la solicitud seleccionada de forma permanente.
                </p>

                <div className="mt-5 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => setDeleteRequestId(null)}
                    className="inline-flex h-11 flex-1 items-center justify-center rounded-xl border border-red-200 bg-white px-4 text-xs font-black uppercase tracking-[0.12em] text-[#9f3b53] transition hover:bg-red-50"
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    onClick={handleConfirmDelete}
                    className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-linear-to-r from-red-500 to-[#c63054] px-4 text-xs font-black uppercase tracking-[0.12em] text-white shadow-[0_14px_28px_rgba(198,48,84,0.34)] transition hover:-translate-y-0.5 hover:brightness-105"
                  >
                    <FaTrashAlt className="text-[11px]" />
                    Sí, eliminar
                  </button>
                </div>
              </div>
            </MotionDiv>
          </>
        ) : null}
      </AnimatePresence>

      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-(--orchird-lilac)/45 bg-[#fcf9ff] p-4 md:p-5">
        <div className="flex items-center gap-3">
          <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-linear-to-br from-(--orchird-lilac) to-(--orchird-lavender) text-white shadow-[0_10px_20px_rgba(143,99,188,0.34)]">
            <FaCalendarAlt />
          </span>
          <div>
            <p className="text-xs font-black uppercase tracking-[0.14em] text-[#7a49af]">Reservas del cliente</p>
            <h2 className="mt-1 text-2xl font-black text-[#45206e] md:text-3xl">Mis reservas</h2>
          </div>
        </div>
        <span className="inline-flex items-center gap-2 rounded-full border border-(--orchird-lilac)/55 bg-[#f8efff] px-3 py-1.5 text-xs font-black uppercase tracking-[0.1em] text-[#6d3ea2]">
          <FaListUl className="text-[11px]" />
          {requests.length} registradas
        </span>
      </div>

      <div className="rounded-2xl border border-(--orchird-lilac)/50 bg-[#fbf7ff] p-4 md:p-5">
        <p className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.12em] text-[#6d3ea2]">
          <FaFilter className="text-[11px]" />
          Filtrar por estado
        </p>
        <div className="mt-3 flex flex-wrap gap-2 md:gap-3">
          {reservationFilters.map((filter) => {
            const isActive = activeFilter === filter.id

            return (
              <button
                key={filter.id}
                type="button"
                onClick={() => setActiveFilter(filter.id)}
                className={`rounded-full border px-3 py-1.5 text-xs font-black uppercase tracking-[0.1em] transition duration-200 hover:-translate-y-0.5 ${
                  isActive
                    ? 'border-(--orchird-lavender) bg-(--orchird-lavender) text-white shadow-[0_10px_22px_rgba(143,99,188,0.34)]'
                    : filterToneClass[filter.id] ?? filterToneClass.all
                }`}
              >
                {filter.label} ({counters[filter.id] ?? 0})
              </button>
            )
          })}
        </div>
      </div>

      <div className="space-y-4 md:space-y-5">
        {visibleRequests.length === 0 ? (
          <div className="rounded-2xl border border-(--orchird-lilac)/55 bg-[#f8f2fc] px-4 py-6 text-sm text-(--orchird-black)/74 md:px-5">
            Aún no tienes reservas en este estado.
          </div>
        ) : (
          visibleRequests.map((request) => {
            const normalized = normalizeReservationStatus(request.status)
            const isCancelled = normalized === 'cancelled'
            const statusConfig = reservationStatusConfig[normalized] ?? reservationStatusConfig.pending
            const appointments = Array.isArray(request.appointments) ? request.appointments : []
            const total = appointments.reduce((sum, item) => sum + Number(item.price ?? 0), 0)

            return (
              <article
                key={request.id}
                className={`rounded-2xl border p-4 shadow-[0_10px_22px_rgba(69,32,110,0.1)] transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_16px_32px_rgba(69,32,110,0.14)] md:p-5 ${
                  isCancelled
                    ? 'border-gray-300 bg-gray-50'
                    : 'border-(--orchird-lilac)/55 bg-white'
                }`}
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className={`text-xs font-black uppercase tracking-[0.12em] ${isCancelled ? 'text-gray-500' : 'text-[#7a49af]'}`}>
                      Solicitud {request.id}
                    </p>
                    <p className={`mt-1 inline-flex items-center gap-2 text-sm font-semibold ${isCancelled ? 'text-gray-500' : 'text-(--orchird-black)/75'}`}>
                      <FaCalendarAlt className={isCancelled ? 'text-gray-500' : 'text-[#7a49af]'} />
                      {formatDate(request.createdAt)}
                    </p>
                  </div>
                  <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-black uppercase tracking-[0.1em] ${statusConfig.badgeClass}`}>
                    {normalized === 'completed' ? <FaCheckCircle className="mr-1" /> : <FaClock className="mr-1" />}
                    {statusConfig.label}
                  </span>
                </div>

                <div className={`mt-4 rounded-xl border px-3 py-3 md:px-4 ${isCancelled ? 'border-gray-300 bg-gray-100' : 'border-(--orchird-lilac)/45 bg-[#fbf7ff]'}`}>
                  <p className={`text-xs font-black uppercase tracking-[0.12em] ${isCancelled ? 'text-gray-500' : 'text-[#6d3ea2]'}`}>
                    Servicios ({appointments.length})
                  </p>
                  <ul className={`mt-2 space-y-2 text-sm ${isCancelled ? 'text-gray-500' : 'text-(--orchird-black)/78'}`}>
                    {appointments.slice(0, 3).map((item, index) => (
                      <li key={`${request.id}-${index}`} className="flex items-center justify-between gap-3">
                        <span className="truncate">{item.serviceName}</span>
                        <span className={`font-bold ${isCancelled ? 'text-gray-500' : 'text-[#3b8f54]'}`}>{formatMoney(item.price)}</span>
                      </li>
                    ))}
                  </ul>
                  {appointments.length > 3 ? (
                    <p className={`mt-2 text-xs font-semibold ${isCancelled ? 'text-gray-500' : 'text-(--orchird-black)/65'}`}>
                      +{appointments.length - 3} servicio(s) adicional(es)
                    </p>
                  ) : null}
                </div>

                <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className={`text-sm font-semibold ${isCancelled ? 'text-gray-500' : 'text-(--orchird-black)/75'}`}>Total base estimado</p>
                    <p className={`text-xl font-black ${isCancelled ? 'text-gray-500' : 'text-(--orchird-green-dark)'}`}>{formatMoney(total)}</p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {normalized === 'pending' ? (
                      <button
                        type="button"
                        onClick={() => handleCancelRequest(request.id)}
                        className="inline-flex items-center gap-1 rounded-full border border-amber-300 bg-amber-50 px-3 py-1.5 text-xs font-black uppercase tracking-[0.1em] text-amber-700 transition hover:bg-amber-100"
                      >
                        <FaTimesCircle className="text-[11px]" />
                        Cancelar solicitud
                      </button>
                    ) : null}

                    {isCancelled ? (
                      <button
                        type="button"
                        onClick={() => handleRestoreRequest(request.id)}
                        className="inline-flex items-center gap-1 rounded-full border border-gray-300 bg-white px-3 py-1.5 text-xs font-black uppercase tracking-[0.1em] text-gray-700 transition hover:bg-gray-100"
                      >
                        <FaUndo className="text-[11px]" />
                        Revertir cancelación
                      </button>
                    ) : null}

                    <button
                      type="button"
                      onClick={() => setDeleteRequestId(request.id)}
                      className="inline-flex items-center gap-1 rounded-full border border-red-300 bg-red-50 px-3 py-1.5 text-xs font-black uppercase tracking-[0.1em] text-red-700 transition hover:bg-red-100"
                    >
                      <FaTrashAlt className="text-[11px]" />
                      Eliminar
                    </button>
                  </div>
                </div>
              </article>
            )
          })
        )}
      </div>
    </div>
  )
}

export default AccountReservationsPanel
