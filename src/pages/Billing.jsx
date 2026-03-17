import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  FaCalendarCheck,
  FaCheckCircle,
  FaExclamationCircle,
  FaGift,
  FaMinus,
  FaPlus,
  FaShoppingBag,
  FaTrashAlt,
} from 'react-icons/fa'
import { getCurrentUserCart, saveCurrentUserCart } from '../utils/cartStorage'
import { products } from '../data/products'

const shippingOptions = [
  {
    id: 'delivery',
    title: 'Delivery',
    description: 'Recíbelo en la dirección que elijas.',
    fee: 250,
  },
  {
    id: 'pickup',
    title: 'Pick up',
    description: 'Retiro en el salón sin costo de envío.',
    fee: 0,
  },
]

const promoExamples = [
  { code: 'ORCHID10', label: '10% en productos', kind: 'products_percent', value: 0.1 },
  { code: 'ORCHID20', label: '20% en productos', kind: 'products_percent', value: 0.2 },
  { code: 'ENVIOGRATIS', label: 'Envío gratis', kind: 'free_shipping', value: 1 },
  { code: 'RESERVA15', label: '15% en reservas', kind: 'reservations_percent', value: 0.15 },
]

const reviewedStatuses = new Set(['reviewed', 'approved', 'confirmed'])
const taxRate = 0.18

const formatMoney = (value) => `RD$ ${Number(value ?? 0).toLocaleString('en-US')}`
const getProductMeta = (productId) => products.find((item) => item.id === Number(productId))

function Billing() {
  const navigate = useNavigate()
  const isLogged = localStorage.getItem('orchirdSession') === 'active'

  const [cartItems, setCartItems] = useState(() => {
    const currentCart = getCurrentUserCart()
    const checkoutDraft = JSON.parse(localStorage.getItem('orchirdCheckoutDraft') ?? 'null')

    if (!checkoutDraft?.productId || !checkoutDraft?.quantity) return currentCart

    const draftQuantity = Math.max(1, Number(checkoutDraft.quantity) || 1)
    const draftUnitPrice = Number(checkoutDraft.unitPrice ?? 0)
    const meta = getProductMeta(checkoutDraft.productId)

    const nextCart = [...currentCart]
    const existing = nextCart.find((item) => Number(item.id) === Number(checkoutDraft.productId))

    if (existing) {
      existing.quantity = Number(existing.quantity ?? 0) + draftQuantity
    } else {
      nextCart.push({
        id: checkoutDraft.productId,
        name: meta?.name ?? `Producto ${checkoutDraft.productId}`,
        unitPrice: draftUnitPrice,
        quantity: draftQuantity,
        image: meta?.image ?? '',
      })
    }

    return nextCart
  })

  const [shippingMethod, setShippingMethod] = useState(shippingOptions[0].id)
  const [promoCode, setPromoCode] = useState('')
  const [promoAppliedList, setPromoAppliedList] = useState([])
  const [alert, setAlert] = useState({ message: '', type: 'success' })

  const [reviewedReservations] = useState(() => {
    const savedRequests = JSON.parse(localStorage.getItem('orchirdReservations') ?? '[]')
    if (!Array.isArray(savedRequests)) return []

    return savedRequests
      .filter((request) => reviewedStatuses.has(String(request.status ?? '').toLowerCase()))
      .flatMap((request) =>
        (request.appointments ?? []).map((item, index) => ({
          key: `${request.id}-${index}`,
          requestId: request.id,
          serviceName: item.serviceName,
          amount: Number(item.price ?? 0),
        })),
      )
  })

  const productsSubtotal = useMemo(
    () => cartItems.reduce((sum, item) => sum + Number(item.unitPrice ?? 0) * Number(item.quantity ?? 0), 0),
    [cartItems],
  )

  const reservationsSubtotal = useMemo(
    () => reviewedReservations.reduce((sum, item) => sum + Number(item.amount ?? 0), 0),
    [reviewedReservations],
  )

  const selectedShipping = shippingOptions.find((option) => option.id === shippingMethod) ?? shippingOptions[0]

  const productsDiscountRaw = promoAppliedList
    .filter((promo) => promo.kind === 'products_percent')
    .reduce((sum, promo) => sum + productsSubtotal * Number(promo.value ?? 0), 0)
  const reservationsDiscountRaw = promoAppliedList
    .filter((promo) => promo.kind === 'reservations_percent')
    .reduce((sum, promo) => sum + reservationsSubtotal * Number(promo.value ?? 0), 0)
  const shippingDiscountRaw = promoAppliedList.some((promo) => promo.kind === 'free_shipping') ? selectedShipping.fee : 0

  const productsDiscount = Math.min(productsSubtotal, productsDiscountRaw)
  const reservationsDiscount = Math.min(reservationsSubtotal, reservationsDiscountRaw)
  const shippingDiscount = Math.min(selectedShipping.fee, shippingDiscountRaw)

  const safeProducts = Math.max(0, productsSubtotal - productsDiscount)
  const safeReservations = Math.max(0, reservationsSubtotal - reservationsDiscount)
  const safeShipping = Math.max(0, selectedShipping.fee - shippingDiscount)

  const taxableBase = safeProducts + safeReservations
  const taxes = taxableBase * taxRate
  const grandTotal = taxableBase + taxes + safeShipping

  useEffect(() => {
    saveCurrentUserCart(cartItems)
    window.dispatchEvent(new Event('orchird-cart-updated'))
  }, [cartItems])

  useEffect(() => {
    if (!alert.message) return undefined
    const timeoutId = setTimeout(() => setAlert({ message: '', type: 'success' }), 2600)
    return () => clearTimeout(timeoutId)
  }, [alert])

  useEffect(() => {
    localStorage.removeItem('orchirdCheckoutDraft')
  }, [])

  const updateCartQuantity = (productId, delta) => {
    setCartItems((prev) =>
      prev
        .map((item) =>
          Number(item.id) === Number(productId)
            ? { ...item, quantity: Math.max(1, Number(item.quantity ?? 1) + delta) }
            : item,
        )
        .filter((item) => Number(item.quantity ?? 0) > 0),
    )
  }

  const removeCartItem = (productId) => {
    setCartItems((prev) => prev.filter((item) => Number(item.id) !== Number(productId)))
  }

  const clearCart = () => {
    setCartItems([])
    setPromoAppliedList([])
    setPromoCode('')
    setAlert({ message: 'Carrito vaciado correctamente.', type: 'success' })
  }

  const applyPromoCode = () => {
    const normalized = promoCode.trim().toUpperCase()

    if (!normalized) {
      setAlert({ message: 'Ingresa un código promocional.', type: 'error' })
      return
    }

    const promo = promoExamples.find((item) => item.code === normalized)

    if (!promo) {
      setAlert({ message: 'Código no válido por ahora.', type: 'error' })
      return
    }

    const alreadyApplied = promoAppliedList.some((item) => item.code === promo.code)
    if (alreadyApplied) {
      setAlert({ message: `El código ${promo.code} ya está aplicado.`, type: 'error' })
      return
    }

    setPromoAppliedList((prev) => [...prev, promo])
    setPromoCode('')
    setAlert({ message: `Código aplicado: ${promo.code} (${promo.label}).`, type: 'success' })
  }

  const removePromoCode = (code) => {
    setPromoAppliedList((prev) => prev.filter((promo) => promo.code !== code))
    setAlert({ message: `Código removido: ${code}.`, type: 'success' })
  }

  const proceedToPayment = () => {
    if (grandTotal <= 0) {
      setAlert({ message: 'Agrega productos o reservas revisadas para facturar.', type: 'error' })
      return
    }

    const invoiceDraft = {
      id: `INV-${Date.now()}`,
      generatedAt: new Date().toISOString(),
      paymentStatus: 'pending',
      items: cartItems,
      reviewedReservations,
      shippingMethod: selectedShipping,
      promoApplied: promoAppliedList,
      totals: {
        productsSubtotal,
        productsDiscount,
        reservationsSubtotal,
        reservationsDiscount,
        shippingFee: safeShipping,
        taxes,
        grandTotal,
      },
    }

    localStorage.setItem('orchirdInvoiceDraft', JSON.stringify(invoiceDraft))
    navigate('/facturacion/confirmacion')
  }

  const alertClass =
    alert.type === 'error'
      ? 'border-red-300 bg-red-50 text-red-700'
      : 'border-(--orchird-green)/35 bg-(--orchird-green)/12 text-(--orchird-green-dark)'

  if (!isLogged) {
    return (
      <section className="container-x py-16">
        <div className="mx-auto max-w-3xl rounded-3xl border border-(--orchird-lilac)/65 bg-white/92 p-8 text-center shadow-[0_22px_50px_rgba(69,32,110,0.16)]">
          <h1 className="text-3xl font-black text-[#4b2274] md:text-5xl">Facturación solo para clientes registrados</h1>
          <p className="mt-4 text-base leading-8 text-(--orchird-black)/75">
            Inicia sesión para revisar y pagar tus productos o reservas aprobadas.
          </p>
          <div className="mt-6 flex justify-center">
            <Link
              to="/login"
              state={{ redirectTo: '/facturacion' }}
              className="inline-flex h-11 items-center justify-center rounded-full bg-(--orchird-green) px-6 text-sm font-black uppercase tracking-[0.12em] text-white transition hover:bg-(--orchird-green-dark)"
            >
              Iniciar sesión
            </Link>
          </div>
        </div>
      </section>
    )
  }

  return (
    <div className="relative overflow-hidden pb-20">
      {alert.message ? (
        <div className={`fixed bottom-5 right-5 z-50 max-w-[calc(100vw-1.5rem)] rounded-2xl border px-4 py-3 text-sm font-bold shadow-[0_14px_30px_rgba(69,32,110,0.22)] ${alertClass}`}>
          <span className="inline-flex items-center gap-2">
            {alert.type === 'error' ? <FaExclamationCircle /> : <FaCheckCircle />}
            {alert.message}
          </span>
        </div>
      ) : null}

      <div className="pointer-events-none absolute -left-24 top-24 h-72 w-72 rounded-full bg-(--orchird-lilac)/30 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 top-[38%] h-80 w-80 rounded-full bg-(--orchird-green)/14 blur-3xl" />

      <section className="container-x pt-6 md:pt-10">
        <div className="rounded-3xl bg-linear-to-r from-(--orchird-lavender) via-[#b57ed4] to-(--orchird-lavender) p-5 text-white shadow-[0_20px_42px_rgba(69,32,110,0.2)] md:p-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/40 bg-white/15 md:h-12 md:w-12">
                <FaShoppingBag />
              </span>
              <div>
                <h1 className="text-3xl font-black md:text-5xl">Facturación</h1>
                <p className="text-xs font-semibold text-white/90 md:text-base">
                  Revisa productos y reservas aprobadas antes de pagar.
                </p>
              </div>
            </div>
            <span className="inline-flex rounded-full border border-white/45 bg-white/12 px-3 py-1.5 text-xs font-black uppercase tracking-[0.12em] md:px-4 md:py-2 md:text-sm">
              {cartItems.length} productos
            </span>
          </div>
        </div>

        <div className="mt-6 grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
          <div className="space-y-6">
            <section className="overflow-hidden rounded-3xl border border-(--orchird-lilac)/55 bg-white shadow-[0_16px_36px_rgba(69,32,110,0.14)]">
              <div className="hidden grid-cols-[1.3fr_0.7fr_0.7fr_0.7fr_0.5fr] gap-3 bg-[#f0d6ff] px-5 py-4 text-sm font-black uppercase tracking-[0.08em] text-[#4f2a78] md:grid">
                <span>Producto</span>
                <span className="text-center">Cantidad</span>
                <span className="text-center">Precio</span>
                <span className="text-center">Total</span>
                <span className="text-center">Acción</span>
              </div>

              {cartItems.length === 0 ? (
                <div className="px-5 py-8 text-center text-sm font-semibold text-(--orchird-black)/72">
                  No hay productos en carrito por ahora.
                </div>
              ) : (
                <div>
                  {cartItems.map((item) => (
                    <article key={item.id} className="border-t border-(--orchird-lilac)/40 px-4 py-4 md:px-5">
                      <div className="md:hidden">
                        <div className="flex items-start gap-3">
                          {item.image ? (
                            <img src={item.image} alt={item.name} className="h-14 w-14 rounded-xl border border-(--orchird-lilac)/35 object-cover" />
                          ) : null}
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-black uppercase text-[#4f2a78]">{item.name}</p>
                            <p className="mt-1 text-xs text-(--orchird-black)/65">Unitario: {formatMoney(item.unitPrice)}</p>
                            <p className="mt-1 text-lg font-black text-(--orchird-green-dark)">{formatMoney(Number(item.unitPrice ?? 0) * Number(item.quantity ?? 0))}</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeCartItem(item.id)}
                            className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-[#f0b2d1] text-[#c13f79] transition duration-200 hover:-translate-y-0.5 hover:bg-[#fff0f7] hover:shadow-[0_8px_16px_rgba(193,63,121,0.22)] active:scale-95"
                            aria-label={`Quitar ${item.name}`}
                          >
                            <FaTrashAlt className="text-[10px]" />
                          </button>
                        </div>
                        <div className="mt-3 flex items-center justify-center gap-2">
                          <button type="button" onClick={() => updateCartQuantity(item.id, -1)} className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-(--orchird-lilac)/60 text-[#6d3ea2] transition duration-200 hover:-translate-y-0.5 hover:border-(--orchird-lavender) hover:bg-(--orchird-lilac)/20 active:scale-95">
                            <FaMinus className="text-[10px]" />
                          </button>
                          <span className="min-w-8 text-center text-lg font-black text-[#351f4e]">{item.quantity}</span>
                          <button type="button" onClick={() => updateCartQuantity(item.id, 1)} className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-(--orchird-lilac)/60 text-[#6d3ea2] transition duration-200 hover:-translate-y-0.5 hover:border-(--orchird-lavender) hover:bg-(--orchird-lilac)/20 active:scale-95">
                            <FaPlus className="text-[10px]" />
                          </button>
                        </div>
                      </div>

                      <div className="hidden grid-cols-[1.3fr_0.7fr_0.7fr_0.7fr_0.5fr] items-center gap-3 md:grid">
                        <div className="flex items-center gap-3">
                          {item.image ? <img src={item.image} alt={item.name} className="h-16 w-16 rounded-xl border border-(--orchird-lilac)/35 object-cover" /> : null}
                          <p className="text-sm font-black uppercase text-[#4f2a78]">{item.name}</p>
                        </div>
                        <div className="flex items-center justify-center gap-1">
                          <button type="button" onClick={() => updateCartQuantity(item.id, -1)} className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-(--orchird-lilac)/60 text-[#6d3ea2] transition duration-200 hover:-translate-y-0.5 hover:border-(--orchird-lavender) hover:bg-(--orchird-lilac)/20 active:scale-95"><FaMinus className="text-[10px]" /></button>
                          <span className="min-w-8 text-center text-lg font-black text-[#351f4e]">{item.quantity}</span>
                          <button type="button" onClick={() => updateCartQuantity(item.id, 1)} className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-(--orchird-lilac)/60 text-[#6d3ea2] transition duration-200 hover:-translate-y-0.5 hover:border-(--orchird-lavender) hover:bg-(--orchird-lilac)/20 active:scale-95"><FaPlus className="text-[10px]" /></button>
                        </div>
                        <p className="text-center text-base font-bold text-(--orchird-black)/78">{formatMoney(item.unitPrice)}</p>
                        <p className="text-center text-xl font-black text-(--orchird-green-dark)">{formatMoney(Number(item.unitPrice ?? 0) * Number(item.quantity ?? 0))}</p>
                        <div className="flex justify-center">
                          <button type="button" onClick={() => removeCartItem(item.id)} className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#f0b2d1] text-[#c13f79] transition duration-200 hover:-translate-y-0.5 hover:bg-[#fff0f7] hover:shadow-[0_8px_16px_rgba(193,63,121,0.22)] active:scale-95" aria-label={`Quitar ${item.name}`}>
                            <FaTrashAlt className="text-[11px]" />
                          </button>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </section>

            <section className="rounded-3xl border border-(--orchird-lilac)/55 bg-white p-5 shadow-[0_16px_34px_rgba(69,32,110,0.12)]">
              <div className="flex items-center gap-2">
                <FaCalendarCheck className="text-(--orchird-green-dark)" />
                <h2 className="text-2xl font-black text-[#4f2a78]">Reservas revisadas</h2>
              </div>
              <p className="mt-2 text-sm text-(--orchird-black)/72">Solo se facturan reservas con estado aprobado/revisado.</p>

              {reviewedReservations.length === 0 ? (
                <p className="mt-4 rounded-xl border border-(--orchird-lilac)/45 bg-[#faf5fd] px-4 py-3 text-sm font-semibold text-(--orchird-black)/72">No hay reservas revisadas pendientes de facturación.</p>
              ) : (
                <div className="mt-4 space-y-3">
                  {reviewedReservations.map((item) => (
                    <div key={item.key} className="flex items-center justify-between rounded-xl border border-(--orchird-lilac)/45 bg-[#faf5fd] px-4 py-3 transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_10px_20px_rgba(69,32,110,0.12)]">
                      <div>
                        <p className="text-sm font-black uppercase text-[#4f2a78]">{item.serviceName}</p>
                        <p className="text-xs font-semibold text-(--orchird-black)/65">Solicitud: {item.requestId}</p>
                      </div>
                      <p className="text-lg font-black text-(--orchird-green-dark)">{formatMoney(item.amount)}</p>
                    </div>
                  ))}
                </div>
              )}
            </section>

            <section className="rounded-3xl border border-(--orchird-lilac)/55 bg-white p-5 shadow-[0_16px_34px_rgba(69,32,110,0.12)]">
              <h3 className="text-xl font-black text-[#4f2a78]">Opciones de envío</h3>
              <div className="mt-3 space-y-3">
                {shippingOptions.map((option) => (
                  <label key={option.id} className={`flex cursor-pointer items-center justify-between rounded-2xl border px-4 py-3 transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_10px_20px_rgba(69,32,110,0.12)] ${shippingMethod === option.id ? 'border-(--orchird-green)/45 bg-(--orchird-green)/10' : 'border-(--orchird-lilac)/45 bg-white'}`}>
                    <div className="flex items-start gap-3">
                      <input type="radio" name="shipping-method" checked={shippingMethod === option.id} onChange={() => setShippingMethod(option.id)} className="mt-1" />
                      <div>
                        <p className="text-sm font-black text-[#4f2a78]">{option.title}</p>
                        <p className="text-xs text-(--orchird-black)/72">{option.description}</p>
                      </div>
                    </div>
                    <p className="text-lg font-black text-(--orchird-green-dark)">{formatMoney(option.fee)}</p>
                  </label>
                ))}
              </div>
            </section>

            <section className="rounded-3xl border border-(--orchird-lilac)/55 bg-white p-5 shadow-[0_16px_34px_rgba(69,32,110,0.12)]">
              <div className="flex items-center gap-2">
                <FaGift className="text-(--orchird-lavender)" />
                <h3 className="text-xl font-black text-[#4f2a78]">Código promocional</h3>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                <input value={promoCode} onChange={(event) => setPromoCode(event.target.value)} placeholder="Ingresa tu código" className="h-11 min-w-52 flex-1 rounded-xl border border-(--orchird-lilac)/55 px-3 text-sm outline-none transition focus:border-(--orchird-green)" />
                <button type="button" onClick={applyPromoCode} className="inline-flex h-11 items-center justify-center rounded-xl bg-linear-to-r from-(--orchird-lavender) to-[#9c65ca] px-5 text-sm font-black uppercase tracking-[0.08em] text-white transition duration-200 hover:-translate-y-0.5 hover:brightness-110 hover:shadow-[0_10px_20px_rgba(139,79,194,0.34)] active:scale-[0.98]">Aplicar descuento</button>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {promoExamples.map((promo) => (
                  <button key={promo.code} type="button" onClick={() => setPromoCode(promo.code)} className="rounded-full border border-(--orchird-lilac)/60 bg-[#faf3ff] px-3 py-1 text-xs font-black uppercase tracking-[0.08em] text-[#6d3ea2] transition duration-200 hover:-translate-y-0.5 hover:bg-(--orchird-lilac)/25 hover:shadow-[0_8px_16px_rgba(109,62,162,0.2)]">{promo.code}</button>
                ))}
              </div>
              {promoAppliedList.length > 0 ? (
                <div className="mt-3 flex flex-wrap gap-2">
                  {promoAppliedList.map((promo) => (
                    <button
                      key={promo.code}
                      type="button"
                      onClick={() => removePromoCode(promo.code)}
                      className="inline-flex items-center gap-1 rounded-full border border-(--orchird-green)/40 bg-(--orchird-green)/12 px-3 py-1 text-xs font-black uppercase tracking-[0.08em] text-(--orchird-green-dark) transition hover:bg-(--orchird-green)/20"
                    >
                      {promo.code}
                      <span className="text-[10px]">×</span>
                    </button>
                  ))}
                </div>
              ) : null}
              <p className="mt-2 text-xs text-(--orchird-black)/65">Cupones de ejemplo: {promoExamples.map((item) => `${item.code} (${item.label})`).join(' · ')}</p>
            </section>
          </div>

          <aside className="h-fit rounded-3xl border border-(--orchird-lilac)/55 bg-[#fbf7ff] p-5 shadow-[0_16px_34px_rgba(69,32,110,0.12)] xl:sticky xl:top-24">
            <h2 className="text-3xl font-black text-[#4f2a78]">Resumen</h2>
            <div className="mt-4 space-y-2 text-sm">
              <div className="flex items-center justify-between text-(--orchird-black)/80"><span>Subtotal productos</span><span className="font-bold">{formatMoney(productsSubtotal)}</span></div>
              <div className="flex items-center justify-between text-(--orchird-black)/80"><span>Descuento productos</span><span className="font-bold text-[#8b4fc2]">- {formatMoney(productsDiscount)}</span></div>
              <div className="flex items-center justify-between text-(--orchird-black)/80"><span>Reservas revisadas</span><span className="font-bold">{formatMoney(reservationsSubtotal)}</span></div>
              <div className="flex items-center justify-between text-(--orchird-black)/80"><span>Descuento reservas</span><span className="font-bold text-[#8b4fc2]">- {formatMoney(reservationsDiscount)}</span></div>
              <div className="flex items-center justify-between text-(--orchird-black)/80"><span>Envío</span><span className="font-bold">{formatMoney(safeShipping)}</span></div>
              <div className="flex items-center justify-between text-(--orchird-black)/80"><span>Impuestos (18%)</span><span className="font-bold">{formatMoney(taxes)}</span></div>
            </div>
            <div className="mt-4 border-t border-(--orchird-lilac)/45 pt-4">
              <div className="flex items-center justify-between">
                <span className="text-2xl font-black text-[#4f2a78]">Total</span>
                <span className="text-3xl font-black text-(--orchird-green-dark)">{formatMoney(grandTotal)}</span>
              </div>
            </div>
            <button type="button" disabled={grandTotal <= 0} onClick={proceedToPayment} className={`mt-4 inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl text-sm font-black uppercase tracking-[0.1em] transition ${grandTotal > 0 ? 'bg-linear-to-r from-(--orchird-green) to-(--orchird-green-dark) text-white shadow-[0_14px_30px_rgba(33,191,72,0.34)] hover:-translate-y-0.5 hover:brightness-110 hover:shadow-[0_16px_34px_rgba(33,191,72,0.4)] active:scale-[0.99]' : 'cursor-not-allowed bg-[#e7dfea] text-[#9d90a9]'}`}>
              <FaCheckCircle />Proceder al pago
            </button>
            <button type="button" onClick={clearCart} className="mt-3 inline-flex h-11 w-full items-center justify-center rounded-xl border border-[#f2bfd5] bg-[#fff2f8] text-sm font-black uppercase tracking-[0.08em] text-[#c13f79] transition duration-200 hover:-translate-y-0.5 hover:bg-[#ffe8f4] hover:shadow-[0_10px_22px_rgba(193,63,121,0.22)] active:scale-[0.99]">Vaciar carrito</button>
            <Link to="/tienda" className="mt-3 inline-flex h-10 w-full items-center justify-center text-sm font-bold text-[#6d3ea2] underline-offset-4 transition duration-200 hover:-translate-y-0.5 hover:text-(--orchird-green-dark) hover:underline">Continuar comprando</Link>
          </aside>
        </div>
      </section>
    </div>
  )
}

export default Billing







