import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FaBell, FaCheckCircle, FaMinus, FaPlus, FaShoppingCart } from 'react-icons/fa'
import { products } from '../data/products'
import { getCurrentUserCart, saveCurrentUserCart } from '../utils/cartStorage'
import { addProductToWaitlist, getCurrentUserWaitlist } from '../utils/waitlistStorage'

const productsPerPage = 6
const statusStyles = {
  Disponible: 'bg-(--orchird-green) text-white',
  'Próximamente': 'bg-(--orchird-lavender) text-white',
  Agotado: 'bg-[#6b7280] text-white',
}

const parsePrice = (rawPrice) => Number(rawPrice.replace(/[^\d]/g, '')) || 0
const formatPrice = (amount) => `RD$ ${amount.toLocaleString('en-US')}`
const MotionP = motion.p
const MotionH1 = motion.h1
const MotionDiv = motion.div
const MotionArticle = motion.article

function Store() {
  const navigate = useNavigate()
  const [currentPage, setCurrentPage] = useState(() => {
    const savedPage = Number(localStorage.getItem('storeCurrentPage') ?? 1)
    return Number.isFinite(savedPage) && savedPage > 0 ? savedPage : 1
  })
  const [quantities, setQuantities] = useState(() =>
    Object.fromEntries(products.map((product) => [product.id, 1])),
  )
  const [toast, setToast] = useState('')
  const [waitlistRefreshTick, setWaitlistRefreshTick] = useState(0)

  const totalPages = Math.ceil(products.length / productsPerPage)
  const safePage = Math.min(currentPage, Math.max(totalPages, 1))

  const userIsLogged = localStorage.getItem('orchirdSession') === 'active'

  const waitlistProductIds = useMemo(() => {
    // Dependemos de este tick para refrescar visualmente despues de activar aviso.
    void waitlistRefreshTick
    if (!userIsLogged) return new Set()
    return new Set(getCurrentUserWaitlist().map((item) => Number(item.productId)))
  }, [userIsLogged, waitlistRefreshTick])

  useEffect(() => {
    localStorage.setItem('storeCurrentPage', String(safePage))
  }, [safePage])

  useEffect(() => {
    if (!toast) return undefined
    const timerId = setTimeout(() => setToast(''), 2800)
    return () => clearTimeout(timerId)
  }, [toast])

  const visibleProducts = useMemo(() => {
    const start = (safePage - 1) * productsPerPage
    return products.slice(start, start + productsPerPage)
  }, [safePage])

  const updateQuantity = (productId, delta) => {
    setQuantities((prev) => {
      const next = Math.max(1, (prev[productId] ?? 1) + delta)
      return { ...prev, [productId]: next }
    })
  }

  const requireLogin = () => {
    navigate('/login', { state: { redirectTo: '/tienda' } })
  }

  const handleAddToCart = (product) => {
    if (!userIsLogged) {
      requireLogin()
      return
    }

    const quantity = quantities[product.id] ?? 1
    const currentCart = getCurrentUserCart()
    const existingItem = currentCart.find((item) => item.id === product.id)

    if (existingItem) {
      existingItem.quantity += quantity
    } else {
      currentCart.push({
        id: product.id,
        name: product.name,
        unitPrice: parsePrice(product.price),
        quantity,
        image: product.image,
      })
    }

    saveCurrentUserCart(currentCart)
    window.dispatchEvent(new Event('orchird-cart-updated'))
    setToast(`${product.name} agregado al carrito.`)
  }

  const handleBuyNow = (product) => {
    if (!userIsLogged) {
      requireLogin()
      return
    }

    const quantity = quantities[product.id] ?? 1
    localStorage.setItem(
      'orchirdCheckoutDraft',
      JSON.stringify({
        productId: product.id,
        quantity,
        unitPrice: parsePrice(product.price),
        total: parsePrice(product.price) * quantity,
      }),
    )

    navigate('/facturacion')
  }

  const handleJoinWaitlist = (product) => {
    if (!userIsLogged) {
      requireLogin()
      return
    }

    const result = addProductToWaitlist(product)

    if (!result.ok && result.reason === 'already-exists') {
      setToast(`Ya estás en lista de espera para ${product.name}.`)
      return
    }

    if (!result.ok) {
      setToast('No pudimos activar el aviso ahora.')
      return
    }

    setToast(`Te avisaremos cuando ${product.name} esté disponible.`)
    setWaitlistRefreshTick((prev) => prev + 1)
  }

  return (
    <div className="relative overflow-hidden pb-20">
      <div className="pointer-events-none absolute -left-24 top-28 h-72 w-72 rounded-full bg-(--orchird-lilac)/32 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 top-[36%] h-80 w-80 rounded-full bg-(--orchird-green)/14 blur-3xl" />

      <section className="bg-linear-to-r from-[#b57ed4] via-(--orchird-lavender) to-[#aa73cf] py-14 text-center md:py-20">
        <MotionP
          className="text-xs font-black uppercase tracking-[0.26em] text-white/90"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
        >
          Orchid Shop
        </MotionP>
        <MotionH1
          className="mt-4 text-5xl font-black uppercase tracking-tight text-white md:text-7xl"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.05 }}
        >
          Hair Care
        </MotionH1>
      </section>

      <section className="container-x pt-14 md:pt-16">
        {toast ? (
          <div className="mb-5 rounded-2xl border border-(--orchird-green)/35 bg-(--orchird-green)/12 px-4 py-3 text-sm font-semibold text-(--orchird-green-dark)">
            <span className="inline-flex items-center gap-2">
              <FaCheckCircle className="text-xs" />
              {toast}
            </span>
          </div>
        ) : null}

        <MotionP
          className="inline-flex items-center gap-3 rounded-full border border-(--orchird-lilac)/70 bg-white px-6 py-3 text-sm font-black uppercase tracking-[0.14em] text-[#6d3da2] shadow-sm md:text-base"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
        >
          <span className="h-2.5 w-2.5 rounded-full bg-(--orchird-green)" />
          Mostrando {visibleProducts.length} resultados
        </MotionP>

        <MotionDiv
          className="mt-8 grid gap-6 sm:grid-cols-2 xl:grid-cols-3"
          initial="hidden"
          animate="show"
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: 0.08 } },
          }}
          key={safePage}
        >
          {visibleProducts.map((product) => {
            const isAvailable = product.status === 'Disponible'
            const isInWaitlist = waitlistProductIds.has(Number(product.id))

            return (
              <MotionArticle
                key={product.id}
                className="overflow-hidden rounded-3xl border border-(--orchird-lilac)/50 bg-[#e4d7e8] shadow-[0_20px_42px_rgba(69,32,110,0.14)] transition hover:-translate-y-1.5 hover:shadow-[0_28px_58px_rgba(69,32,110,0.22)]"
                variants={{
                  hidden: { opacity: 0, y: 18 },
                  show: { opacity: 1, y: 0, transition: { duration: 0.42, ease: 'easeOut' } },
                }}
              >
                <div className="relative p-4">
                  <span
                    className={`inline-flex rounded-full px-4 py-2 text-xs font-black uppercase tracking-widest ${
                      statusStyles[product.status] ?? 'bg-[#b47ad4] text-white'
                    }`}
                  >
                    {product.status}
                  </span>

                  <button
                    type="button"
                    onClick={() => handleAddToCart(product)}
                    disabled={!isAvailable}
                    className={`absolute right-5 top-5 inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/70 shadow-[0_10px_22px_rgba(69,32,110,0.2)] transition ${
                      isAvailable
                        ? 'bg-linear-to-br from-white via-[#f3ebfa] to-[#e5f7ea] text-(--orchird-green-dark) hover:scale-105 hover:from-(--orchird-lilac) hover:to-white'
                        : 'cursor-not-allowed bg-[#ece7ef] text-[#a39aac] opacity-75'
                    }`}
                    aria-label={`Agregar ${product.name} al carrito`}
                  >
                    <FaShoppingCart className="text-xs" />
                  </button>
                </div>

                <div className="px-4">
                  <div
                    className="flex h-90 items-center justify-center overflow-hidden rounded-2xl"
                    style={{ backgroundColor: product.imageBg }}
                  >
                    <img src={product.image} alt={product.name} className="h-full w-full object-cover" loading="lazy" />
                  </div>
                </div>

                <div className="p-5">
                  <h2 className="text-3xl font-black uppercase text-(--orchird-green)">{product.name}</h2>
                  <p className="mt-2 text-2xl font-black text-[#111]">
                    {formatPrice(parsePrice(product.price) * (quantities[product.id] ?? 1))}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-(--orchird-black)/72">{product.description}</p>

                  {!isAvailable ? (
                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      <p className="text-xs font-black uppercase tracking-[0.12em] text-[#8a6aa5]">
                        No disponible para compra por ahora.
                      </p>
                      <button
                        type="button"
                        onClick={() => handleJoinWaitlist(product)}
                        className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-[11px] font-black uppercase tracking-[0.1em] transition ${
                          isInWaitlist
                            ? 'border-(--orchird-lilac)/55 bg-[#ede3f7] text-[#7a49af]'
                            : 'border-(--orchird-green)/40 bg-(--orchird-green)/12 text-(--orchird-green-dark) hover:bg-(--orchird-green)/20'
                        }`}
                      >
                        <FaBell className="text-[10px]" />
                        {isInWaitlist ? 'En lista de espera' : 'Avisarme cuando llegue'}
                      </button>
                    </div>
                  ) : null}

                  <div className="mt-5 flex items-center justify-between gap-3">
                    <div className="inline-flex items-center gap-2 rounded-full border border-(--orchird-lilac)/70 bg-white/85 px-2 py-1.5 shadow-[0_8px_18px_rgba(69,32,110,0.12)]">
                      <button
                        type="button"
                        onClick={() => updateQuantity(product.id, -1)}
                        className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-linear-to-br from-(--orchird-lavender) to-[#9e63cd] text-[11px] text-white transition hover:scale-105 hover:brightness-105"
                        aria-label={`Disminuir cantidad de ${product.name}`}
                      >
                        <FaMinus />
                      </button>
                      <span className="inline-flex h-7 min-w-10 items-center justify-center rounded-full bg-linear-to-r from-white to-(--orchird-lilac)/35 px-2 text-xs font-black text-[#6b3a9e]">
                        {quantities[product.id]}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(product.id, 1)}
                        className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-linear-to-br from-(--orchird-lavender) to-[#9e63cd] text-[11px] text-white transition hover:scale-105 hover:brightness-105"
                        aria-label={`Aumentar cantidad de ${product.name}`}
                      >
                        <FaPlus />
                      </button>
                    </div>

                    <button
                      type="button"
                      disabled={!isAvailable}
                      onClick={() => handleBuyNow(product)}
                      className={`inline-flex min-w-28 items-center justify-center rounded-full px-4 py-1.5 text-base font-black uppercase tracking-[0.06em] transition ${
                        isAvailable
                          ? 'bg-white text-(--orchird-green) hover:bg-(--orchird-green) hover:text-white'
                          : 'cursor-not-allowed bg-[#ede8ef] text-[#a39aac]'
                      }`}
                    >
                      Comprar
                    </button>
                  </div>
                </div>
              </MotionArticle>
            )
          })}
        </MotionDiv>

        <div className="mt-12 flex justify-end gap-3">
          {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
            <button
              key={page}
              type="button"
              onClick={() => setCurrentPage(page)}
              className={`inline-flex h-14 w-14 items-center justify-center rounded-full border text-lg font-black transition ${
                safePage === page
                  ? 'border-(--orchird-green) bg-(--orchird-green) text-white shadow-[0_10px_24px_rgba(33,191,72,0.35)]'
                  : 'border-(--orchird-lilac)/55 bg-white text-[#7643a9] hover:-translate-y-0.5 hover:bg-(--orchird-lilac)/22'
              }`}
              aria-label={`Ir a la pagina ${page} de la tienda`}
            >
              {page}
            </button>
          ))}
        </div>
      </section>
    </div>
  )
}

export default Store

