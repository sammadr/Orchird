import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { FaShoppingBag } from 'react-icons/fa'
import { HiOutlineMenuAlt3, HiOutlineX } from 'react-icons/hi'
import { NAV_LINKS } from '../../utils/constants'
import NavItem from '../molecules/NavItem'

const getCartCount = () => {
  const cart = JSON.parse(localStorage.getItem('orchirdCart') ?? '[]')
  return cart.reduce((total, item) => total + Number(item.quantity ?? 0), 0)
}

function Navbar() {
  const [open, setOpen] = useState(false)
  const [cartCount, setCartCount] = useState(() => getCartCount())

  useEffect(() => {
    const syncCart = () => setCartCount(getCartCount())
    window.addEventListener('storage', syncCart)
    window.addEventListener('orchird-cart-updated', syncCart)

    return () => {
      window.removeEventListener('storage', syncCart)
      window.removeEventListener('orchird-cart-updated', syncCart)
    }
  }, [])

  return (
    <header className="sticky top-0 z-50 border-b border-(--orchird-black)/10 bg-white/95 backdrop-blur">
      <div className="container-x py-4 text-center">
        <a href="/" className="inline-block text-5xl font-black tracking-tight text-(--orchird-black) transition-transform duration-300 hover:scale-[1.02]">
          <span className="text-(--orchird-lavender)">O</span>rchid
        </a>
      </div>

      <nav className="container-x flex items-center justify-end gap-3 pb-4 md:justify-center">
        <Link
          to="/tienda"
          className="relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-(--orchird-lilac)/70 bg-white text-[#7445a7] shadow-sm transition hover:-translate-y-0.5 hover:bg-(--orchird-lilac)/22 md:hidden"
          aria-label="Ir al carrito"
        >
          <FaShoppingBag className="text-sm" />
          {cartCount > 0 ? (
            <span className="absolute -right-1 -top-1 inline-flex min-w-5 items-center justify-center rounded-full bg-(--orchird-green) px-1.5 text-[10px] font-black text-white">
              {cartCount}
            </span>
          ) : null}
        </Link>

        <button
          onClick={() => setOpen((prev) => !prev)}
          className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-(--orchird-black)/15 md:hidden"
          aria-label="Abrir menu"
        >
          {open ? <HiOutlineX size={21} /> : <HiOutlineMenuAlt3 size={21} />}
        </button>

        <div className="hidden items-center gap-7 md:flex">
          {NAV_LINKS.map((item) => (
            <NavItem key={item.path} to={item.path}>
              {item.label}
            </NavItem>
          ))}

          <Link
            to="/tienda"
            className="relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-(--orchird-lilac)/70 bg-white text-[#7445a7] shadow-sm transition hover:-translate-y-0.5 hover:bg-(--orchird-lilac)/22"
            aria-label="Ir al carrito"
          >
            <FaShoppingBag className="text-sm" />
            {cartCount > 0 ? (
              <span className="absolute -right-1 -top-1 inline-flex min-w-5 items-center justify-center rounded-full bg-(--orchird-green) px-1.5 text-[10px] font-black text-white">
                {cartCount}
              </span>
            ) : null}
          </Link>
        </div>
      </nav>

      {open ? (
        <div className="container-x animate-[fadeUp_0.25s_ease] rounded-b-xl bg-white pb-5 md:hidden">
          <div className="flex flex-col gap-4 border-t border-(--orchird-black)/10 pt-4">
          {NAV_LINKS.map((item) => (
            <NavItem key={item.path} to={item.path} onClick={() => setOpen(false)}>
              {item.label}
            </NavItem>
          ))}
          </div>
        </div>
      ) : null}
    </header>
  )
}

export default Navbar
