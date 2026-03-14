import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { FaCheckCircle, FaClock, FaExclamationTriangle } from 'react-icons/fa'

const PURCHASE_HISTORY_KEY = 'orchirdPurchaseOrders'
const formatMoney = (value) => `RD$ ${Number(value ?? 0).toLocaleString('en-US')}`

const paymentStates = {
  pending: {
    label: 'Pendiente',
    description: 'Estamos validando el pago con la pasarela.',
    badge: 'border-amber-300 bg-amber-50 text-amber-700',
    icon: FaClock,
  },
  approved: {
    label: 'Aprobado',
    description: 'Pago confirmado correctamente.',
    badge: 'border-(--orchird-green)/35 bg-(--orchird-green)/12 text-(--orchird-green-dark)',
    icon: FaCheckCircle,
  },
  failed: {
    label: 'Fallido',
    description: 'El pago fue rechazado. Intenta con otro método.',
    badge: 'border-red-300 bg-red-50 text-red-700',
    icon: FaExclamationTriangle,
  },
}

const readPurchaseHistory = () => {
  const raw = JSON.parse(localStorage.getItem(PURCHASE_HISTORY_KEY) ?? '[]')
  return Array.isArray(raw) ? raw : []
}

const savePurchaseHistory = (list) => {
  localStorage.setItem(PURCHASE_HISTORY_KEY, JSON.stringify(list))
  window.dispatchEvent(new Event('orchird-purchases-updated'))
}

function BillingConfirmation() {
  const [draft, setDraft] = useState(() => JSON.parse(localStorage.getItem('orchirdInvoiceDraft') ?? 'null'))
  const [paymentStatus, setPaymentStatus] = useState(() => draft?.paymentStatus ?? 'pending')

  const statusConfig = paymentStates[paymentStatus] ?? paymentStates.pending
  const StatusIcon = statusConfig.icon

  useEffect(() => {
    if (!draft?.id) return

    const userEmail = localStorage.getItem('orchirdUserEmail') ?? ''
    const userName = localStorage.getItem('orchirdUserName') ?? 'Cliente'
    const history = readPurchaseHistory()
    const index = history.findIndex((order) => order.id === draft.id)

    const normalizedOrder = {
      ...draft,
      userEmail,
      userName,
      paymentStatus,
      createdAt: draft.generatedAt ?? new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    if (index >= 0) {
      history[index] = {
        ...history[index],
        ...normalizedOrder,
        createdAt: history[index].createdAt ?? normalizedOrder.createdAt,
      }
    } else {
      history.push(normalizedOrder)
    }

    savePurchaseHistory(history)
  }, [draft, paymentStatus])

  const updatePaymentStatus = (nextStatus) => {
    setPaymentStatus(nextStatus)
    if (!draft) return

    const nextDraft = { ...draft, paymentStatus: nextStatus }
    setDraft(nextDraft)
    localStorage.setItem('orchirdInvoiceDraft', JSON.stringify(nextDraft))
  }

  return (
    <section className="container-x py-6 md:py-8">
      <div className="mx-auto max-w-4xl rounded-3xl border border-(--orchird-lilac)/55 bg-white p-6 shadow-[0_20px_44px_rgba(69,32,110,0.16)] md:p-8">
        <div className="text-center">
          <span className={`mx-auto inline-flex h-14 w-14 items-center justify-center rounded-full border ${statusConfig.badge}`}>
            <StatusIcon className="text-2xl" />
          </span>
          <h1 className="mt-4 text-3xl font-black text-[#4f2a78] md:text-5xl">Estado del pago: {statusConfig.label}</h1>
          <p className="mt-3 text-sm text-(--orchird-black)/75 md:text-lg">{statusConfig.description}</p>
        </div>

        <div className="mt-5 flex flex-wrap justify-center gap-2">
          <button
            type="button"
            onClick={() => updatePaymentStatus('pending')}
            className={`rounded-full px-4 py-2 text-xs font-black uppercase tracking-[0.08em] transition ${paymentStatus === 'pending' ? 'bg-amber-100 text-amber-700' : 'bg-[#f5f1f8] text-[#6d3ea2]'}`}
          >
            Marcar pendiente
          </button>
          <button
            type="button"
            onClick={() => updatePaymentStatus('approved')}
            className={`rounded-full px-4 py-2 text-xs font-black uppercase tracking-[0.08em] transition ${paymentStatus === 'approved' ? 'bg-(--orchird-green) text-white' : 'bg-[#f5f1f8] text-[#6d3ea2]'}`}
          >
            Marcar aprobado
          </button>
          <button
            type="button"
            onClick={() => updatePaymentStatus('failed')}
            className={`rounded-full px-4 py-2 text-xs font-black uppercase tracking-[0.08em] transition ${paymentStatus === 'failed' ? 'bg-red-100 text-red-700' : 'bg-[#f5f1f8] text-[#6d3ea2]'}`}
          >
            Marcar fallido
          </button>
        </div>

        {draft ? (
          <div className="mt-6 rounded-2xl border border-(--orchird-lilac)/50 bg-[#faf5fd] p-5">
            <h2 className="text-2xl font-black text-[#4f2a78]">Resumen de factura</h2>
            <div className="mt-4 grid gap-2 text-sm">
              <div className="flex items-center justify-between">
                <span>Factura</span>
                <span className="font-bold">{draft.id ?? 'N/A'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Productos</span>
                <span className="font-bold">{draft.items?.length ?? 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Reservas revisadas</span>
                <span className="font-bold">{draft.reviewedReservations?.length ?? 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Envío</span>
                <span className="font-bold">{draft.shippingMethod?.title ?? 'N/A'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Total</span>
                <span className="text-xl font-black text-(--orchird-green-dark)">{formatMoney(draft.totals?.grandTotal)}</span>
              </div>
            </div>
          </div>
        ) : (
          <p className="mt-6 rounded-xl border border-(--orchird-lilac)/45 bg-[#faf5fd] px-4 py-3 text-sm font-semibold text-(--orchird-black)/72">
            No hay una factura activa para mostrar en este momento.
          </p>
        )}

        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link
            to="/facturacion"
            className="inline-flex h-11 items-center justify-center rounded-full border border-(--orchird-lilac)/60 bg-[#f6eefa] px-6 text-sm font-black uppercase tracking-[0.1em] text-[#6d3ea2] transition hover:bg-(--orchird-lilac)/28"
          >
            Volver a facturación
          </Link>
          <Link
            to="/"
            className="inline-flex h-11 items-center justify-center rounded-full bg-linear-to-r from-(--orchird-green) to-(--orchird-green-dark) px-6 text-sm font-black uppercase tracking-[0.1em] text-white transition hover:brightness-105"
          >
            Ir al inicio
          </Link>
        </div>
      </div>
    </section>
  )
}

export default BillingConfirmation
