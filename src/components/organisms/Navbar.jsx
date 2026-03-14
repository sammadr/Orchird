import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useNavigate } from 'react-router-dom'
import { FaShoppingBag, FaChevronDown, FaMinus, FaPlus, FaTimes, FaTrashAlt, FaUser, FaCog, FaSignOutAlt } from 'react-icons/fa'
import { HiOutlineMenuAlt3, HiOutlineX } from 'react-icons/hi'
import { NAV_LINKS } from '../../utils/constants'
import { getCurrentUserCart, getCurrentUserCartCount, saveCurrentUserCart } from '../../utils/cartStorage'
import NavItem from '../molecules/NavItem'
import avatarFemale from '../../assets/images/avatar/avatar-femele.svg'
import avatarMale from '../../assets/images/avatar/avatar-male.svg'

const getSessionState = () => localStorage.getItem('orchirdSession') === 'active'
const getUserName = () => localStorage.getItem('orchirdUserName') ?? 'Usuario'
const getUserGender = () => localStorage.getItem('orchirdUserGender') ?? 'female'
const formatMoney = (value) => `RD$ ${Number(value ?? 0).toLocaleString('en-US')}`

function Navbar() {
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const [cartCount, setCartCount] = useState(() => getCurrentUserCartCount())
  const [cartItems, setCartItems] = useState(() => getCurrentUserCart())
  const [cartOpen, setCartOpen] = useState(false)
  const [isLogged, setIsLogged] = useState(() => getSessionState())
  const [userName, setUserName] = useState(() => getUserName())
  const [userGender, setUserGender] = useState(() => getUserGender())
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [mobileUserMenuOpen, setMobileUserMenuOpen] = useState(false)
  const desktopUserMenuRef = useRef(null)
  const mobileUserMenuRef = useRef(null)

  const visibleNavLinks = isLogged ? NAV_LINKS.filter((item) => item.path !== '/login') : NAV_LINKS

  const syncNavbarState = () => {
    setCartItems(getCurrentUserCart())
    setCartCount(getCurrentUserCartCount())
    setIsLogged(getSessionState())
    setUserName(getUserName())
    setUserGender(getUserGender())
  }

  const cartTotal = cartItems.reduce((sum, item) => sum + Number(item.unitPrice ?? 0) * Number(item.quantity ?? 0), 0)

  useEffect(() => {
    window.addEventListener('storage', syncNavbarState)
    window.addEventListener('orchird-cart-updated', syncNavbarState)
    window.addEventListener('orchird-auth-updated', syncNavbarState)

    return () => {
      window.removeEventListener('storage', syncNavbarState)
      window.removeEventListener('orchird-cart-updated', syncNavbarState)
      window.removeEventListener('orchird-auth-updated', syncNavbarState)
    }
  }, [])

  useEffect(() => {
    if (!cartOpen) return undefined

    const handleEscape = (event) => {
      if (event.key === 'Escape') setCartOpen(false)
    }

    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleEscape)

    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleEscape)
    }
  }, [cartOpen])

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        userMenuOpen &&
        desktopUserMenuRef.current &&
        !desktopUserMenuRef.current.contains(event.target)
      ) {
        setUserMenuOpen(false)
      }

      if (
        mobileUserMenuOpen &&
        mobileUserMenuRef.current &&
        !mobileUserMenuRef.current.contains(event.target)
      ) {
        setMobileUserMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handleOutsideClick)
    return () => document.removeEventListener('mousedown', handleOutsideClick)
  }, [userMenuOpen, mobileUserMenuOpen])

  const handleLogout = () => {
    localStorage.removeItem('orchirdSession')
    localStorage.removeItem('orchirdUserEmail')
    localStorage.removeItem('orchirdUserName')
    localStorage.removeItem('orchirdUserGender')
    localStorage.removeItem('orchirdUserRole')
    window.dispatchEvent(new Event('orchird-auth-updated'))
    setUserMenuOpen(false)
    setMobileUserMenuOpen(false)
    setOpen(false)
    navigate('/login')
  }

  const openCartDrawer = () => {
    setCartItems(getCurrentUserCart())
    setCartOpen(true)
    setUserMenuOpen(false)
    setMobileUserMenuOpen(false)
    setOpen(false)
  }

  const updateCartItemQuantity = (productId, delta) => {
    const nextItems = cartItems
      .map((item) =>
        item.id === productId
          ? { ...item, quantity: Math.max(1, Number(item.quantity ?? 1) + delta) }
          : item,
      )
      .filter((item) => Number(item.quantity ?? 0) > 0)

    setCartItems(nextItems)
    saveCurrentUserCart(nextItems)
    window.dispatchEvent(new Event('orchird-cart-updated'))
  }

  const removeCartItem = (productId) => {
    const nextItems = cartItems.filter((item) => item.id !== productId)
    setCartItems(nextItems)
    saveCurrentUserCart(nextItems)
    window.dispatchEvent(new Event('orchird-cart-updated'))
  }

  const cartDrawer =
    isLogged && typeof document !== 'undefined'
      ? createPortal(
          <>
            <div
              className={`fixed inset-0 z-[70] bg-[#1f1233]/32 backdrop-blur-[2px] transition ${cartOpen ? 'opacity-100' : 'pointer-events-none opacity-0'}`}
              onClick={() => setCartOpen(false)}
            />
            <aside
              className={`fixed right-0 top-0 z-[71] flex h-screen w-full max-w-lg flex-col border-l border-(--orchird-lilac)/50 bg-[#f8f5fb] shadow-[-18px_0_40px_rgba(49,23,74,0.28)] transition-transform duration-300 ${cartOpen ? 'translate-x-0' : 'translate-x-full'}`}
              aria-hidden={!cartOpen}
            >
              <header className="bg-linear-to-r from-(--orchird-lavender) to-[#8d53be] px-5 pb-5 pt-4 text-white">
                <div className="flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setCartOpen(false)}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/45 bg-white/15 transition hover:bg-white/25"
                    aria-label="Cerrar carrito"
                  >
                    <FaTimes />
                  </button>
                  <div className="text-right">
                    <p className="text-2xl font-black">Tu carrito</p>
                    <p className="text-sm font-bold text-white/90">{cartCount} productos</p>
                  </div>
                </div>
              </header>

              <div className="flex-1 overflow-y-auto px-4 py-4">
                {cartItems.length === 0 ? (
                  <div className="rounded-2xl border border-(--orchird-lilac)/45 bg-white p-5 text-center shadow-sm">
                    <p className="text-lg font-black text-[#4f2a78]">Tu carrito está vacío</p>
                    <p className="mt-2 text-sm text-(--orchird-black)/70">Agrega productos desde la tienda para continuar.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {cartItems.map((item) => (
                      <article
                        key={item.id}
                        className="rounded-2xl border border-(--orchird-lilac)/40 bg-white p-3 shadow-[0_12px_24px_rgba(69,32,110,0.1)]"
                      >
                        <div className="flex gap-3">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="h-20 w-20 rounded-xl border border-(--orchird-lilac)/35 object-cover"
                          />
                          <div className="flex min-w-0 flex-1 flex-col">
                            <div className="flex items-start justify-between gap-2">
                              <p className="line-clamp-2 text-sm font-black uppercase text-[#4f2a78]">{item.name}</p>
                              <p className="whitespace-nowrap text-sm font-black text-(--orchird-green-dark)">
                                {formatMoney(Number(item.unitPrice ?? 0) * Number(item.quantity ?? 0))}
                              </p>
                            </div>
                            <p className="mt-1 text-xs font-semibold text-(--orchird-black)/60">
                              Unitario: {formatMoney(item.unitPrice)}
                            </p>
                            <div className="mt-auto flex items-center justify-between pt-2">
                              <div className="inline-flex items-center gap-2 rounded-full border border-(--orchird-lilac)/55 bg-[#f9f2fc] px-2 py-1">
                                <button
                                  type="button"
                                  onClick={() => updateCartItemQuantity(item.id, -1)}
                                  className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-white text-[10px] text-[#6f3ea5] transition hover:bg-(--orchird-lilac)/25"
                                  aria-label={`Disminuir ${item.name}`}
                                >
                                  <FaMinus />
                                </button>
                                <span className="min-w-5 text-center text-xs font-black text-[#4f2a78]">{item.quantity}</span>
                                <button
                                  type="button"
                                  onClick={() => updateCartItemQuantity(item.id, 1)}
                                  className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-white text-[10px] text-[#6f3ea5] transition hover:bg-(--orchird-lilac)/25"
                                  aria-label={`Aumentar ${item.name}`}
                                >
                                  <FaPlus />
                                </button>
                              </div>

                              <button
                                type="button"
                                onClick={() => removeCartItem(item.id)}
                                className="inline-flex items-center gap-1 text-xs font-black uppercase tracking-[0.08em] text-[#b94b79] transition hover:text-[#a53162]"
                              >
                                <FaTrashAlt className="text-[11px]" />
                                Quitar
                              </button>
                            </div>
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                )}
              </div>

              <footer className="border-t border-(--orchird-lilac)/45 bg-white p-4">
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-lg font-black text-[#4f2a78]">Total</p>
                  <p className="text-2xl font-black text-(--orchird-green-dark)">{formatMoney(cartTotal)}</p>
                </div>
                <div className="grid gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setCartOpen(false)
                      navigate('/tienda')
                    }}
                    className="inline-flex h-11 items-center justify-center rounded-xl border border-(--orchird-lilac)/60 bg-[#f5eafa] text-sm font-black uppercase tracking-[0.1em] text-[#663996] transition hover:bg-(--orchird-lilac)/35"
                  >
                    Ver tienda
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setCartOpen(false)
                      navigate('/facturacion')
                    }}
                    disabled={cartItems.length === 0}
                    className={`inline-flex h-11 items-center justify-center rounded-xl text-sm font-black uppercase tracking-[0.1em] transition ${
                      cartItems.length > 0
                        ? 'bg-linear-to-r from-(--orchird-green) to-(--orchird-green-dark) text-white shadow-[0_12px_24px_rgba(33,191,72,0.3)] hover:brightness-105'
                        : 'cursor-not-allowed bg-[#e8e1ec] text-[#9f93a9]'
                    }`}
                  >
                    Ir a facturación
                  </button>
                </div>
              </footer>
            </aside>
          </>,
          document.body,
        )
      : null

  return (
    <header className="sticky top-0 z-50 border-b border-(--orchird-black)/10 bg-white/95 backdrop-blur">
      <div className="container-x py-4 text-center">
        <a href="/" className="inline-block text-5xl font-black tracking-tight text-(--orchird-black) transition-transform duration-300 hover:scale-[1.02]">
          <span className="text-(--orchird-lavender)">O</span>rchid
        </a>
      </div>

      <nav className="container-x flex items-center justify-end gap-3 pb-4 md:justify-center">
        {isLogged ? (
          <button
            type="button"
            onClick={openCartDrawer}
            className="relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-(--orchird-lilac)/70 bg-white text-[#7445a7] shadow-sm transition hover:-translate-y-0.5 hover:bg-(--orchird-lilac)/22 md:hidden"
            aria-label="Abrir carrito"
          >
            <FaShoppingBag className="text-sm" />
            {cartCount > 0 ? (
              <span className="absolute -right-1.5 -top-1.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-(--orchird-green) text-[10px] font-black leading-none text-white shadow-[0_4px_10px_rgba(33,191,72,0.45)]">
                {cartCount}
              </span>
            ) : null}
          </button>
        ) : null}

        {isLogged ? (
          <div ref={mobileUserMenuRef} className="relative md:hidden">
            <button
              type="button"
              onClick={() => {
                setMobileUserMenuOpen((prev) => !prev)
                setOpen(false)
              }}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-(--orchird-lilac)/70 bg-white shadow-sm transition hover:-translate-y-0.5 hover:bg-(--orchird-lilac)/22"
              aria-label="Abrir menú de usuario"
            >
              <img
                src={userGender === 'male' ? avatarMale : avatarFemale}
                alt="Avatar de usuario"
                className="h-7 w-7 rounded-full border border-(--orchird-lilac)/55 bg-white object-cover"
              />
            </button>

            <div
              className={`absolute right-0 top-[calc(100%+8px)] z-40 w-64 origin-top-right overflow-hidden rounded-2xl border border-(--orchird-lilac)/55 bg-white shadow-[0_18px_38px_rgba(69,32,110,0.22)] transition-all duration-200 ${
                mobileUserMenuOpen
                  ? 'visible translate-y-0 scale-100 opacity-100'
                  : 'invisible -translate-y-2 scale-95 opacity-0'
              }`}
            >
              <div className="border-b border-(--orchird-lilac)/45 bg-linear-to-r from-[#f7edfc] via-white to-[#eef9f1] px-4 py-3">
                <div className="flex items-center gap-2">
                  <img
                    src={userGender === 'male' ? avatarMale : avatarFemale}
                    alt="Avatar de usuario"
                    className="h-9 w-9 rounded-full border border-(--orchird-lilac)/55 bg-white object-cover"
                  />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-black text-[#45206e]">{userName}</p>
                    <p className="text-xs font-semibold text-[#6c5a80]">Cliente Orchid</p>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setUserMenuOpen(false)
                  setMobileUserMenuOpen(false)
                  navigate('/mi-cuenta')
                }}
                className="group flex w-full items-center gap-2 px-4 py-3 text-left text-sm font-semibold text-[#45206e] transition hover:bg-(--orchird-lilac)/18"
              >
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#f3e8fb] text-[#6d3ea2] transition group-hover:bg-(--orchird-lilac)/35">
                  <FaUser className="text-[12px]" />
                </span>
                Mi perfil
              </button>
              <button
                type="button"
                onClick={() => {
                  setUserMenuOpen(false)
                  setMobileUserMenuOpen(false)
                  navigate('/ajustes')
                }}
                className="group flex w-full items-center gap-2 border-t border-(--orchird-lilac)/45 px-4 py-3 text-left text-sm font-semibold text-[#45206e] transition hover:bg-(--orchird-lilac)/18"
              >
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#f3e8fb] text-[#6d3ea2] transition group-hover:bg-(--orchird-lilac)/35">
                  <FaCog className="text-[12px]" />
                </span>
                Ajustes
              </button>
              <button
                type="button"
                onClick={handleLogout}
                className="group flex w-full items-center gap-2 border-t border-(--orchird-lilac)/45 px-4 py-3 text-left text-sm font-black text-[#2f9c4d] transition hover:bg-(--orchird-green)/12"
              >
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-(--orchird-green)/15 text-[#2f9c4d] transition group-hover:bg-(--orchird-green)/25">
                  <FaSignOutAlt className="text-[12px]" />
                </span>
                Cerrar sesión
              </button>
            </div>
          </div>
        ) : null}

        <button
          onClick={() => {
            setOpen((prev) => !prev)
            setMobileUserMenuOpen(false)
          }}
          className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-(--orchird-lilac)/60 bg-white text-[#5f358c] shadow-sm transition hover:bg-[#f7edfc] md:hidden"
          aria-label="Abrir menu"
        >
          {open ? <HiOutlineX size={21} /> : <HiOutlineMenuAlt3 size={21} />}
        </button>

        <div className="hidden items-center gap-7 md:flex">
          {visibleNavLinks.map((item) => (
            <NavItem key={item.path} to={item.path}>
              {item.label}
            </NavItem>
          ))}

          {isLogged ? (
            <div ref={desktopUserMenuRef} className="relative">
              <button
                type="button"
                onClick={() => setUserMenuOpen((prev) => !prev)}
                className={`inline-flex items-center gap-2 rounded-full border px-3 py-2 text-[#4b2274] shadow-sm transition duration-200 hover:-translate-y-0.5 ${
                  userMenuOpen
                    ? 'border-(--orchird-lavender)/75 bg-[#f8efff] shadow-[0_10px_22px_rgba(69,32,110,0.18)]'
                    : 'border-(--orchird-lilac)/70 bg-white hover:bg-(--orchird-lilac)/24'
                }`}
                aria-label="Abrir menú de usuario"
              >
                <img
                  src={userGender === 'male' ? avatarMale : avatarFemale}
                  alt="Avatar de usuario"
                  className="h-6 w-6 rounded-full border border-(--orchird-lilac)/55 bg-white object-cover"
                />
                <span className="max-w-44 truncate text-xs font-bold">{userName}</span>
                <FaChevronDown className={`text-xs transition duration-300 ${userMenuOpen ? 'rotate-180 text-(--orchird-green-dark)' : ''}`} />
              </button>

              <div
                className={`absolute right-0 top-[calc(100%+10px)] z-40 w-64 origin-top-right overflow-hidden rounded-2xl border border-(--orchird-lilac)/55 bg-white shadow-[0_18px_38px_rgba(69,32,110,0.22)] transition-all duration-200 ${
                  userMenuOpen
                    ? 'visible translate-y-0 scale-100 opacity-100'
                    : 'invisible -translate-y-2 scale-95 opacity-0'
                }`}
              >
                <div className="border-b border-(--orchird-lilac)/45 bg-linear-to-r from-[#f7edfc] via-white to-[#eef9f1] px-4 py-3">
                  <div className="flex items-center gap-2">
                    <img
                      src={userGender === 'male' ? avatarMale : avatarFemale}
                      alt="Avatar de usuario"
                      className="h-9 w-9 rounded-full border border-(--orchird-lilac)/55 bg-white object-cover"
                    />
                    <div className="min-w-0">
                      <p className="truncate text-sm font-black text-[#45206e]">{userName}</p>
                      <p className="text-xs font-semibold text-[#6c5a80]">Cliente Orchid</p>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setUserMenuOpen(false)
                    setMobileUserMenuOpen(false)
                    navigate('/mi-cuenta')
                  }}
                  className="group flex w-full items-center gap-2 px-4 py-3 text-left text-sm font-semibold text-[#45206e] transition hover:bg-(--orchird-lilac)/18"
                >
                  <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#f3e8fb] text-[#6d3ea2] transition group-hover:bg-(--orchird-lilac)/35">
                    <FaUser className="text-[12px]" />
                  </span>
                  Mi perfil
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setUserMenuOpen(false)
                    setMobileUserMenuOpen(false)
                    navigate('/ajustes')
                  }}
                  className="group flex w-full items-center gap-2 border-t border-(--orchird-lilac)/45 px-4 py-3 text-left text-sm font-semibold text-[#45206e] transition hover:bg-(--orchird-lilac)/18"
                >
                  <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#f3e8fb] text-[#6d3ea2] transition group-hover:bg-(--orchird-lilac)/35">
                    <FaCog className="text-[12px]" />
                  </span>
                  Ajustes
                </button>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="group flex w-full items-center gap-2 border-t border-(--orchird-lilac)/45 px-4 py-3 text-left text-sm font-black text-[#2f9c4d] transition hover:bg-(--orchird-green)/12"
                >
                  <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-(--orchird-green)/15 text-[#2f9c4d] transition group-hover:bg-(--orchird-green)/25">
                    <FaSignOutAlt className="text-[12px]" />
                  </span>
                  Cerrar sesión
                </button>
              </div>
            </div>
          ) : null}

          {isLogged ? (
            <button
              type="button"
              onClick={openCartDrawer}
              className="relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-(--orchird-lilac)/70 bg-white text-[#7445a7] shadow-sm transition hover:-translate-y-0.5 hover:bg-(--orchird-lilac)/22"
              aria-label="Abrir carrito"
            >
              <FaShoppingBag className="text-sm" />
              {cartCount > 0 ? (
                <span className="absolute -right-1.5 -top-1.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-(--orchird-green) text-[10px] font-black leading-none text-white shadow-[0_4px_10px_rgba(33,191,72,0.45)]">
                  {cartCount}
                </span>
              ) : null}
            </button>
          ) : null}
        </div>
      </nav>

      {open ? (
        <div className="container-x animate-[fadeUp_0.28s_ease] rounded-b-2xl border-t border-(--orchird-lilac)/35 bg-linear-to-b from-white to-[#f7f0fc] pb-5 md:hidden">
          <div className="flex flex-col gap-2 pt-4">
            {visibleNavLinks.map((item) => (
              <NavItem key={item.path} to={item.path} onClick={() => setOpen(false)}>
                {item.label}
              </NavItem>
            ))}
          </div>
        </div>
      ) : null}

      {cartDrawer}
    </header>
  )
}

export default Navbar
