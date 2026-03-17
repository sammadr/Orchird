import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FaCheckCircle, FaChevronDown, FaClock, FaFilter, FaReceipt, FaSearch, FaShoppingBag } from 'react-icons/fa'
import { getCurrentUserCart, saveCurrentUserCart } from '../../../utils/cartStorage'
import { getCurrentUserWaitlist } from '../../../utils/waitlistStorage'
import {
  normalizePurchaseStatus,
  purchaseFilters,
  purchaseStatusConfig,
} from '../data/purchaseStatus'

const PURCHASE_HISTORY_KEY = 'orchirdPurchaseOrders'
const formatMoney = (value) => `RD$ ${Number(value ?? 0).toLocaleString('en-US')}`

const filterToneClass = {
  all: 'border-gray-300 bg-gray-100 text-gray-700 hover:bg-gray-200',
  pending: 'border-amber-300 bg-amber-100 text-amber-700 hover:bg-amber-200',
  approved: 'border-[#a8d7b5] bg-[#e9f7ef] text-[#2d7d46] hover:bg-[#daf0e4]',
  failed: 'border-red-300 bg-red-100 text-red-700 hover:bg-red-200',
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

const formatFilterDate = (value) => {
  if (!value) return '--/--'
  const [year, month, day] = String(value).split('-')
  if (!year || !month || !day) return '--/--'
  return `${day}/${month}`
}

const getDateFromOrder = (order) => {
  const source = order.createdAt ?? order.generatedAt
  const date = new Date(source)
  return Number.isNaN(date.getTime()) ? null : date
}

const toDayStart = (dateValue) => {
  const date = new Date(dateValue)
  return Number.isNaN(date.getTime()) ? null : new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0, 0)
}

const toDayEnd = (dateValue) => {
  const date = new Date(dateValue)
  return Number.isNaN(date.getTime()) ? null : new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59, 999)
}

function AccountPurchasesPanel() {
  const navigate = useNavigate()
  const userEmail = localStorage.getItem('orchirdUserEmail') ?? ''
  const [activeFilter, setActiveFilter] = useState('all')
  const [expandedOrder, setExpandedOrder] = useState(null)
  const [orders, setOrders] = useState([])
  const [invoiceSearch, setInvoiceSearch] = useState('')
  const [dateFromInput, setDateFromInput] = useState('')
  const [dateToInput, setDateToInput] = useState('')
  const [appliedDateFrom, setAppliedDateFrom] = useState('')
  const [appliedDateTo, setAppliedDateTo] = useState('')
  const [repeatToast, setRepeatToast] = useState({ message: '', allowCart: false })
  const [waitlistProductIds, setWaitlistProductIds] = useState(() =>
    new Set(getCurrentUserWaitlist().map((item) => Number(item.productId))),
  )

  useEffect(() => {
    const syncOrders = () => {
      const saved = JSON.parse(localStorage.getItem(PURCHASE_HISTORY_KEY) ?? '[]')
      const safeList = Array.isArray(saved) ? saved : []
      const mine = safeList
        .filter((item) => String(item.userEmail ?? '').toLowerCase() === userEmail.toLowerCase())
        .sort((a, b) => new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime())

      setOrders(mine)
    }

    syncOrders()
    window.addEventListener('storage', syncOrders)
    window.addEventListener('orchird-purchases-updated', syncOrders)

    return () => {
      window.removeEventListener('storage', syncOrders)
      window.removeEventListener('orchird-purchases-updated', syncOrders)
    }
  }, [userEmail])

  useEffect(() => {
    const syncWaitlist = () => {
      setWaitlistProductIds(new Set(getCurrentUserWaitlist().map((item) => Number(item.productId))))
    }

    window.addEventListener('storage', syncWaitlist)
    window.addEventListener('orchird-waitlist-updated', syncWaitlist)

    return () => {
      window.removeEventListener('storage', syncWaitlist)
      window.removeEventListener('orchird-waitlist-updated', syncWaitlist)
    }
  }, [])

  useEffect(() => {
    if (!repeatToast.message) return undefined
    const timerId = setTimeout(() => setRepeatToast({ message: '', allowCart: false }), 3200)
    return () => clearTimeout(timerId)
  }, [repeatToast])

  const counters = useMemo(() => {
    const initial = { all: orders.length, pending: 0, approved: 0, failed: 0 }

    for (const order of orders) {
      const key = normalizePurchaseStatus(order.paymentStatus)
      if (typeof initial[key] === 'number') initial[key] += 1
    }

    return initial
  }, [orders])

  const visibleOrders = useMemo(() => {
    const normalizedSearch = invoiceSearch.trim().toLowerCase()
    const fromDate = appliedDateFrom ? toDayStart(appliedDateFrom) : null
    const toDate = appliedDateTo ? toDayEnd(appliedDateTo) : null

    return orders.filter((order) => {
      const statusMatches =
        activeFilter === 'all' || normalizePurchaseStatus(order.paymentStatus) === activeFilter

      if (!statusMatches) return false

      const invoiceMatches =
        normalizedSearch.length === 0 || String(order.id ?? '').toLowerCase().includes(normalizedSearch)

      if (!invoiceMatches) return false

      const orderDate = getDateFromOrder(order)
      if (!orderDate) return !fromDate && !toDate

      if (fromDate && orderDate < fromDate) return false
      if (toDate && orderDate > toDate) return false

      return true
    })
  }, [activeFilter, orders, invoiceSearch, appliedDateFrom, appliedDateTo])

  const appliedDateLabel = useMemo(() => {
    if (!appliedDateFrom && !appliedDateTo) return ''
    return `Aplicado: ${formatFilterDate(appliedDateFrom)} - ${formatFilterDate(appliedDateTo)}`
  }, [appliedDateFrom, appliedDateTo])

  const handleApplyDateFilter = () => {
    setAppliedDateFrom(dateFromInput)
    setAppliedDateTo(dateToInput)
  }

  const handleRepeatPurchase = (order) => {
    const products = Array.isArray(order.items) ? order.items : []
    if (products.length === 0) {
      setRepeatToast({ message: 'Esta factura no tiene productos para repetir.', allowCart: false })
      return
    }

    const currentCart = getCurrentUserCart()
    const nextCart = [...currentCart]

    for (const item of products) {
      const existing = nextCart.find((cartItem) => Number(cartItem.id) === Number(item.id))

      if (existing) {
        existing.quantity = Number(existing.quantity ?? 0) + Number(item.quantity ?? 0)
      } else {
        nextCart.push({
          id: item.id,
          name: item.name,
          unitPrice: Number(item.unitPrice ?? 0),
          quantity: Number(item.quantity ?? 1),
          image: item.image ?? '',
        })
      }
    }

    saveCurrentUserCart(nextCart)
    window.dispatchEvent(new Event('orchird-cart-updated'))
    setRepeatToast({ message: 'Productos agregados al carrito correctamente.', allowCart: true })
  }

  return (
    <div className="space-y-6 md:space-y-7">
      {repeatToast.message ? (
        <div className="rounded-2xl border border-(--orchird-green)/35 bg-(--orchird-green)/12 px-4 py-3 text-sm font-semibold text-(--orchird-green-dark)">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="inline-flex items-center gap-2">
              <FaCheckCircle className="text-xs" />
              {repeatToast.message}
            </span>
            {repeatToast.allowCart ? (
              <button
                type="button"
                onClick={() => navigate('/facturacion')}
                className="inline-flex items-center rounded-full border border-(--orchird-green)/45 bg-white px-3 py-1 text-[11px] font-black uppercase tracking-[0.11em] text-(--orchird-green-dark) transition hover:bg-(--orchird-green)/12"
              >
                Ir al carrito
              </button>
            ) : null}
          </div>
        </div>
      ) : null}

      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-(--orchird-lilac)/45 bg-[#fcf9ff] p-4 md:p-5">
        <div className="flex items-center gap-3">
          <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-linear-to-br from-(--orchird-lilac) to-(--orchird-lavender) text-white shadow-[0_10px_20px_rgba(143,99,188,0.34)]">
            <FaShoppingBag />
          </span>
          <div>
            <p className="text-xs font-black uppercase tracking-[0.14em] text-[#7a49af]">Compras del cliente</p>
            <h2 className="mt-1 text-2xl font-black text-[#45206e] md:text-3xl">Mis compras</h2>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-2 rounded-full border border-(--orchird-lilac)/55 bg-[#f8efff] px-3 py-1.5 text-xs font-black uppercase tracking-[0.1em] text-[#6d3ea2]">
            <FaReceipt className="text-[11px]" />
            {orders.length} facturas
          </span>
          <span className="inline-flex items-center gap-2 rounded-full border border-(--orchird-green)/35 bg-(--orchird-green)/12 px-3 py-1.5 text-xs font-black uppercase tracking-[0.1em] text-(--orchird-green-dark)">
            <FaClock className="text-[11px]" />
            {waitlistProductIds.size} en lista de espera
          </span>
        </div>
      </div>

      <div className="rounded-2xl border border-(--orchird-lilac)/50 bg-[#fbf7ff] p-4 md:p-5">
        <p className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.12em] text-[#6d3ea2]">
          <FaFilter className="text-[11px]" />
          Filtrar por estado de pago
        </p>
        <div className="mt-3 flex flex-wrap gap-2 md:gap-3">
          {purchaseFilters.map((filter) => {
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

      <div className="rounded-2xl border border-(--orchird-lilac)/50 bg-white p-4 md:p-5">
        <p className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.12em] text-[#6d3ea2]">
          <FaSearch className="text-[11px]" />
          Buscar y filtrar por fecha
        </p>
        <div className="mt-3 grid gap-3 md:grid-cols-3">
          <label className="space-y-1.5">
            <span className="text-[11px] font-black uppercase tracking-[0.1em] text-[#7a49af]">N. factura</span>
            <input
              type="text"
              value={invoiceSearch}
              onChange={(event) => setInvoiceSearch(event.target.value)}
              placeholder="Ej: INV-"
              className="h-11 w-full rounded-xl border border-(--orchird-lilac)/55 bg-white px-3 text-sm text-(--orchird-black)/85 outline-none transition focus:border-(--orchird-lavender)"
            />
          </label>

          <label className="space-y-1.5">
            <span className="text-[11px] font-black uppercase tracking-[0.1em] text-[#7a49af]">Desde</span>
            <input
              type="date"
              value={dateFromInput}
              onChange={(event) => setDateFromInput(event.target.value)}
              className="h-11 w-full rounded-xl border border-(--orchird-lilac)/55 bg-white px-3 text-sm text-(--orchird-black)/85 outline-none transition focus:border-(--orchird-lavender)"
            />
          </label>

          <label className="space-y-1.5">
            <span className="text-[11px] font-black uppercase tracking-[0.1em] text-[#7a49af]">Hasta</span>
            <input
              type="date"
              value={dateToInput}
              onChange={(event) => setDateToInput(event.target.value)}
              className="h-11 w-full rounded-xl border border-(--orchird-lilac)/55 bg-white px-3 text-sm text-(--orchird-black)/85 outline-none transition focus:border-(--orchird-lavender)"
            />
          </label>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleApplyDateFilter}
            className="inline-flex h-10 items-center justify-center rounded-xl bg-linear-to-r from-(--orchird-lavender) to-[#9c65ca] px-4 text-xs font-black uppercase tracking-[0.12em] text-white transition hover:-translate-y-0.5 hover:brightness-105"
          >
            Filtrar por fecha
          </button>
          {(appliedDateFrom || appliedDateTo) ? (
            <button
              type="button"
              onClick={() => {
                setDateFromInput('')
                setDateToInput('')
                setAppliedDateFrom('')
                setAppliedDateTo('')
              }}
              className="inline-flex h-10 items-center justify-center rounded-xl border border-(--orchird-lilac)/55 bg-white px-4 text-xs font-black uppercase tracking-[0.12em] text-[#6d3ea2] transition hover:bg-(--orchird-lilac)/20"
            >
              Limpiar fechas
            </button>
          ) : null}
          {appliedDateLabel ? (
            <span className="inline-flex h-10 items-center rounded-xl border border-(--orchird-lilac)/55 bg-[#f8efff] px-3 text-xs font-black uppercase tracking-[0.1em] text-[#6d3ea2]">
              {appliedDateLabel}
            </span>
          ) : null}
        </div>
      </div>

      <div className="space-y-4 md:space-y-5">
        {visibleOrders.length === 0 ? (
          <div className="rounded-2xl border border-(--orchird-lilac)/55 bg-[#f8f2fc] px-4 py-6 text-sm text-(--orchird-black)/74 md:px-5">
            No se encontraron compras con esos filtros.
          </div>
        ) : (
          visibleOrders.map((order) => {
            const normalized = normalizePurchaseStatus(order.paymentStatus)
            const statusConfig = purchaseStatusConfig[normalized] ?? purchaseStatusConfig.pending
            const products = Array.isArray(order.items) ? order.items : []
            const reservations = Array.isArray(order.reviewedReservations) ? order.reviewedReservations : []
            const isOpen = expandedOrder === order.id

            return (
              <article
                key={order.id}
                className="rounded-2xl border border-(--orchird-lilac)/55 bg-white p-4 shadow-[0_10px_22px_rgba(69,32,110,0.1)] transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_16px_32px_rgba(69,32,110,0.14)] md:p-5"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.12em] text-[#7a49af]">Factura {order.id}</p>
                    <p className="mt-1 text-sm font-semibold text-(--orchird-black)/75">{formatDate(order.createdAt ?? order.generatedAt)}</p>
                    <p className="mt-1 text-xs font-semibold text-(--orchird-black)/65">
                      {products.length} producto(s) · {reservations.length} reserva(s)
                    </p>
                  </div>

                  <div className="text-right">
                    <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-black uppercase tracking-[0.1em] ${statusConfig.badgeClass}`}>
                      {statusConfig.label}
                    </span>
                    <p className="mt-2 text-xl font-black text-(--orchird-green-dark)">{formatMoney(order.totals?.grandTotal)}</p>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-(--orchird-lilac)/45 bg-[#fbf7ff] px-3 py-2 md:px-4">
                  <p className="text-xs font-semibold text-(--orchird-black)/72">
                    Subtotal: {formatMoney(order.totals?.productsSubtotal)} · Envío: {formatMoney(order.totals?.shippingFee)} · Impuestos: {formatMoney(order.totals?.taxes)}
                  </p>
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleRepeatPurchase(order)}
                      className="inline-flex items-center rounded-full border border-(--orchird-green)/35 bg-(--orchird-green)/12 px-3 py-1 text-xs font-black uppercase tracking-[0.1em] text-(--orchird-green-dark) transition hover:bg-(--orchird-green)/22"
                    >
                      Repetir compra
                    </button>
                    <button
                      type="button"
                      onClick={() => setExpandedOrder((prev) => (prev === order.id ? null : order.id))}
                      className="inline-flex items-center gap-2 rounded-full border border-(--orchird-lilac)/55 bg-white px-3 py-1 text-xs font-black uppercase tracking-[0.1em] text-[#6d3ea2] transition hover:bg-(--orchird-lilac)/20"
                    >
                      Ver detalle
                      <FaChevronDown className={`text-[10px] transition ${isOpen ? 'rotate-180' : ''}`} />
                    </button>
                  </div>
                </div>

                {isOpen ? (
                  <div className="mt-4 grid gap-4 md:grid-cols-2">
                    <div className="rounded-xl border border-(--orchird-lilac)/45 bg-[#faf5fd] p-3">
                      <p className="text-xs font-black uppercase tracking-[0.12em] text-[#6d3ea2]">Productos</p>
                      {products.length === 0 ? (
                        <p className="mt-2 text-sm text-(--orchird-black)/72">Sin productos.</p>
                      ) : (
                        <ul className="mt-2 space-y-2 text-sm text-(--orchird-black)/78">
                          {products.map((item, index) => (
                            <li key={`${order.id}-prod-${index}`} className="flex items-center justify-between gap-2">
                              <div className="flex min-w-0 items-center gap-2">
                                <span className="truncate">{item.name} x{item.quantity}</span>
                                {waitlistProductIds.has(Number(item.id)) ? (
                                  <span className="relative inline-flex items-center gap-1 overflow-hidden rounded-full border border-amber-300 bg-linear-to-r from-amber-100 to-yellow-100 px-2 py-0.5 text-[10px] font-black uppercase tracking-[0.1em] text-amber-700 shadow-[0_0_0_1px_rgba(251,191,36,0.18)] transition hover:brightness-105">
                                    <span className="inline-flex h-1.5 w-1.5 animate-pulse rounded-full bg-amber-500" />
                                    En lista de espera
                                  </span>
                                ) : null}
                              </div>
                              <span className="font-bold">{formatMoney(Number(item.unitPrice ?? 0) * Number(item.quantity ?? 0))}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>

                    <div className="rounded-xl border border-(--orchird-lilac)/45 bg-[#faf5fd] p-3">
                      <p className="text-xs font-black uppercase tracking-[0.12em] text-[#6d3ea2]">Reservas facturadas</p>
                      {reservations.length === 0 ? (
                        <p className="mt-2 text-sm text-(--orchird-black)/72">Sin reservas.</p>
                      ) : (
                        <ul className="mt-2 space-y-2 text-sm text-(--orchird-black)/78">
                          {reservations.map((item, index) => (
                            <li key={`${order.id}-res-${index}`} className="flex items-center justify-between gap-2">
                              <span className="truncate">{item.serviceName}</span>
                              <span className="font-bold">{formatMoney(item.amount)}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                ) : null}
              </article>
            )
          })
        )}
      </div>
    </div>
  )
}

export default AccountPurchasesPanel

