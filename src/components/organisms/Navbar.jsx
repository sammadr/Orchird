import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FaShoppingBag, FaChevronDown } from 'react-icons/fa'
import { HiOutlineMenuAlt3, HiOutlineX } from 'react-icons/hi'
import { NAV_LINKS } from '../../utils/constants'
import { getCurrentUserCartCount } from '../../utils/cartStorage'
import NavItem from '../molecules/NavItem'
import avatarFemale from '../../assets/images/avatar/avatar-femele.svg'
import avatarMale from '../../assets/images/avatar/avatar-male.svg'

const getSessionState = () => localStorage.getItem('orchirdSession') === 'active'
const getUserName = () => localStorage.getItem('orchirdUserName') ?? 'Usuario'
const getUserGender = () => localStorage.getItem('orchirdUserGender') ?? 'female'

function Navbar() {
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const [cartCount, setCartCount] = useState(() => getCurrentUserCartCount())
  const [isLogged, setIsLogged] = useState(() => getSessionState())
  const [userName, setUserName] = useState(() => getUserName())
  const [userGender, setUserGender] = useState(() => getUserGender())
  const [userMenuOpen, setUserMenuOpen] = useState(false)

  const visibleNavLinks = isLogged ? NAV_LINKS.filter((item) => item.path !== '/login') : NAV_LINKS

  const syncNavbarState = () => {
    setCartCount(getCurrentUserCartCount())
    setIsLogged(getSessionState())
    setUserName(getUserName())
    setUserGender(getUserGender())
  }

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

  const handleLogout = () => {
    localStorage.removeItem('orchirdSession')
    localStorage.removeItem('orchirdUserEmail')
    localStorage.removeItem('orchirdUserName')
    localStorage.removeItem('orchirdUserGender')
    localStorage.removeItem('orchirdUserRole')
    window.dispatchEvent(new Event('orchird-auth-updated'))
    setUserMenuOpen(false)
    navigate('/login')
  }

  return (
    <header className="sticky top-0 z-50 border-b border-(--orchird-black)/10 bg-white/95 backdrop-blur">
      <div className="container-x py-4 text-center">
        <a href="/" className="inline-block text-5xl font-black tracking-tight text-(--orchird-black) transition-transform duration-300 hover:scale-[1.02]">
          <span className="text-(--orchird-lavender)">O</span>rchid
        </a>
      </div>

      <nav className="container-x flex items-center justify-end gap-3 pb-4 md:justify-center">
        {isLogged ? (
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
        ) : null}

        <button
          onClick={() => setOpen((prev) => !prev)}
          className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-(--orchird-black)/15 md:hidden"
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
            <div className="relative">
              <button
                type="button"
                onClick={() => setUserMenuOpen((prev) => !prev)}
                className="inline-flex items-center gap-2 rounded-full border border-(--orchird-lilac)/70 bg-white px-3 py-2 text-[#4b2274] shadow-sm transition hover:bg-(--orchird-lilac)/24"
                aria-label="Abrir menú de usuario"
              >
                <img
                  src={userGender === 'male' ? avatarMale : avatarFemale}
                  alt="Avatar de usuario"
                  className="h-6 w-6 rounded-full border border-(--orchird-lilac)/55 bg-white object-cover"
                />
                <span className="max-w-44 truncate text-xs font-bold">{userName}</span>
                <FaChevronDown className={`text-xs transition ${userMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {userMenuOpen ? (
                <div className="absolute right-0 top-[calc(100%+10px)] z-40 w-56 overflow-hidden rounded-2xl border border-(--orchird-lilac)/55 bg-white shadow-[0_16px_36px_rgba(69,32,110,0.2)]">
                  <button type="button" className="block w-full px-4 py-3 text-left text-sm font-semibold text-[#45206e] transition hover:bg-(--orchird-lilac)/20">
                    Mi perfil
                  </button>
                  <button type="button" className="block w-full border-t border-(--orchird-lilac)/45 px-4 py-3 text-left text-sm font-semibold text-[#45206e] transition hover:bg-(--orchird-lilac)/20">
                    Ajustes
                  </button>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="block w-full border-t border-(--orchird-lilac)/45 px-4 py-3 text-left text-sm font-black text-[#2f9c4d] transition hover:bg-(--orchird-green)/12"
                  >
                    Cerrar sesión
                  </button>
                </div>
              ) : null}
            </div>
          ) : null}

          {isLogged ? (
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
          ) : null}
        </div>
      </nav>

      {open ? (
        <div className="container-x animate-[fadeUp_0.25s_ease] rounded-b-xl bg-white pb-5 md:hidden">
          <div className="flex flex-col gap-4 border-t border-(--orchird-black)/10 pt-4">
          {visibleNavLinks.map((item) => (
            <NavItem key={item.path} to={item.path} onClick={() => setOpen(false)}>
              {item.label}
            </NavItem>
          ))}
          {isLogged ? (
            <button
              type="button"
              onClick={handleLogout}
              className="text-left text-sm font-black uppercase tracking-[0.1em] text-[#2f9c4d]"
            >
              Cerrar sesión
            </button>
          ) : null}
          </div>
        </div>
      ) : null}
    </header>
  )
}

export default Navbar
