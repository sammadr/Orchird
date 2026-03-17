import { useEffect, useMemo, useState } from 'react'
import {
  FaBell,
  FaCheckCircle,
  FaEnvelope,
  FaFilter,
  FaShoppingBag,
  FaTrashAlt,
} from 'react-icons/fa'
import {
  clearCurrentUserNotifications,
  getCurrentUserNotifications,
  markAllNotificationsAsRead,
  markNotificationAsRead,
} from '../../../utils/notificationsStorage'

const typeIconMap = {
  purchase: FaShoppingBag,
  waitlist: FaBell,
  reservation: FaCheckCircle,
  promo: FaEnvelope,
}

const resolveIcon = (type) => {
  const normalizedType = String(type ?? '').toLowerCase()
  if (normalizedType.startsWith('purchase')) return typeIconMap.purchase
  if (normalizedType.startsWith('waitlist')) return typeIconMap.waitlist
  if (normalizedType.startsWith('reservation')) return typeIconMap.reservation
  return typeIconMap.promo
}

const formatDate = (value) => {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return 'Sin fecha'
  return new Intl.DateTimeFormat('es-DO', { dateStyle: 'medium', timeStyle: 'short' }).format(date)
}

function AccountNotificationsPanel() {
  const [notifications, setNotifications] = useState([])
  const [activeFilter, setActiveFilter] = useState('all')
  const [toast, setToast] = useState('')

  useEffect(() => {
    const sync = () => setNotifications(getCurrentUserNotifications())

    sync()
    window.addEventListener('storage', sync)
    window.addEventListener('orchird-notifications-updated', sync)

    return () => {
      window.removeEventListener('storage', sync)
      window.removeEventListener('orchird-notifications-updated', sync)
    }
  }, [])

  useEffect(() => {
    if (!toast) return undefined
    const timeout = setTimeout(() => setToast(''), 2200)
    return () => clearTimeout(timeout)
  }, [toast])

  const counters = useMemo(() => {
    const unread = notifications.filter((item) => !item.read).length
    return {
      all: notifications.length,
      unread,
      read: notifications.length - unread,
    }
  }, [notifications])

  const visible = useMemo(() => {
    if (activeFilter === 'all') return notifications
    if (activeFilter === 'unread') return notifications.filter((item) => !item.read)
    return notifications.filter((item) => item.read)
  }, [notifications, activeFilter])

  const handleMarkAsRead = (id) => {
    markNotificationAsRead(id)
    setToast('Notificación marcada como leída.')
  }

  const handleMarkAllAsRead = () => {
    markAllNotificationsAsRead()
    setToast('Todas las notificaciones fueron marcadas como leídas.')
  }

  const handleClearAll = () => {
    clearCurrentUserNotifications()
    setToast('Bandeja limpiada.')
  }

  return (
    <div className="space-y-6 md:space-y-7">
      {toast ? (
        <div className="rounded-2xl border border-(--orchird-green)/35 bg-(--orchird-green)/12 px-4 py-3 text-sm font-semibold text-(--orchird-green-dark)">
          <span className="inline-flex items-center gap-2">
            <FaCheckCircle className="text-xs" />
            {toast}
          </span>
        </div>
      ) : null}

      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-(--orchird-lilac)/45 bg-[#fcf9ff] p-4 md:p-5">
        <div className="flex items-center gap-3">
          <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-linear-to-br from-(--orchird-lilac) to-(--orchird-lavender) text-white shadow-[0_10px_20px_rgba(143,99,188,0.34)]">
            <FaEnvelope />
          </span>
          <div>
            <p className="text-xs font-black uppercase tracking-[0.14em] text-[#7a49af]">Bandeja interna</p>
            <h2 className="mt-1 text-2xl font-black text-[#45206e] md:text-3xl">Mis notificaciones</h2>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleMarkAllAsRead}
            className="inline-flex items-center rounded-full border border-(--orchird-green)/35 bg-(--orchird-green)/12 px-3 py-1.5 text-xs font-black uppercase tracking-[0.1em] text-(--orchird-green-dark) transition hover:bg-(--orchird-green)/22"
          >
            Marcar todo leído
          </button>
          <button
            type="button"
            onClick={handleClearAll}
            className="inline-flex items-center gap-1 rounded-full border border-red-300 bg-red-50 px-3 py-1.5 text-xs font-black uppercase tracking-[0.1em] text-red-700 transition hover:bg-red-100"
          >
            <FaTrashAlt className="text-[10px]" />
            Limpiar
          </button>
        </div>
      </div>

      <div className="rounded-2xl border border-(--orchird-lilac)/50 bg-[#fbf7ff] p-4 md:p-5">
        <p className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.12em] text-[#6d3ea2]">
          <FaFilter className="text-[11px]" />
          Filtrar bandeja
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {[
            { id: 'all', label: 'Todas', count: counters.all },
            { id: 'unread', label: 'No leídas', count: counters.unread },
            { id: 'read', label: 'Leídas', count: counters.read },
          ].map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveFilter(item.id)}
              className={`rounded-full border px-3 py-1.5 text-xs font-black uppercase tracking-[0.1em] transition ${
                activeFilter === item.id
                  ? 'border-(--orchird-lavender) bg-(--orchird-lavender) text-white'
                  : 'border-(--orchird-lilac)/60 bg-white text-[#6d3ea2] hover:bg-(--orchird-lilac)/20'
              }`}
            >
              {item.label} ({item.count})
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {visible.length === 0 ? (
          <div className="rounded-2xl border border-(--orchird-lilac)/55 bg-[#f8f2fc] px-4 py-6 text-sm text-(--orchird-black)/74 md:px-5">
            No tienes notificaciones con ese filtro.
          </div>
        ) : (
          visible.map((notification) => {
            const Icon = resolveIcon(notification.type)

            return (
              <article
                key={notification.id}
                className={`rounded-2xl border p-4 shadow-[0_10px_22px_rgba(69,32,110,0.1)] transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_16px_32px_rgba(69,32,110,0.14)] md:p-5 ${
                  notification.read
                    ? 'border-(--orchird-lilac)/50 bg-white/90'
                    : 'border-(--orchird-green)/35 bg-(--orchird-green)/8'
                }`}
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#f1e4fb] text-[#6d3ea2]">
                        <Icon className="text-xs" />
                      </span>
                      <p className="text-sm font-black uppercase tracking-[0.1em] text-[#4f2a78]">{notification.title}</p>
                      {!notification.read ? (
                        <span className="rounded-full border border-(--orchird-green)/35 bg-(--orchird-green)/12 px-2 py-0.5 text-[10px] font-black uppercase tracking-[0.1em] text-(--orchird-green-dark)">
                          Nuevo
                        </span>
                      ) : null}
                    </div>
                    <p className="mt-2 text-sm leading-7 text-(--orchird-black)/78">{notification.message}</p>
                    <p className="mt-2 text-xs font-semibold text-(--orchird-black)/62">{formatDate(notification.createdAt)}</p>
                  </div>

                  {!notification.read ? (
                    <button
                      type="button"
                      onClick={() => handleMarkAsRead(notification.id)}
                      className="inline-flex items-center rounded-full border border-(--orchird-lilac)/55 bg-white px-3 py-1 text-[11px] font-black uppercase tracking-[0.1em] text-[#6d3ea2] transition hover:bg-(--orchird-lilac)/20"
                    >
                      Marcar leída
                    </button>
                  ) : null}
                </div>
              </article>
            )
          })
        )}
      </div>
    </div>
  )
}

export default AccountNotificationsPanel
