import { useState } from 'react'
import { HiOutlineMenuAlt3, HiOutlineX } from 'react-icons/hi'
import { NAV_LINKS } from '../../utils/constants'
import NavItem from '../molecules/NavItem'

function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--orchird-black)]/10 bg-white/90 backdrop-blur">
      <nav className="container-x flex h-16 items-center justify-between gap-4">
        <a href="/" className="text-xl font-black tracking-tight">Orchird</a>

        <button
          onClick={() => setOpen((prev) => !prev)}
          className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-[var(--orchird-black)]/15 md:hidden"
          aria-label="Abrir menu"
        >
          {open ? <HiOutlineX size={21} /> : <HiOutlineMenuAlt3 size={21} />}
        </button>

        <div className="hidden items-center gap-5 md:flex">
          {NAV_LINKS.map((item) => (
            <NavItem key={item.path} to={item.path}>
              {item.label}
            </NavItem>
          ))}
        </div>
      </nav>

      {open ? (
        <div className="container-x flex flex-col gap-4 pb-5 md:hidden">
          {NAV_LINKS.map((item) => (
            <NavItem key={item.path} to={item.path} onClick={() => setOpen(false)}>
              {item.label}
            </NavItem>
          ))}
        </div>
      ) : null}
    </header>
  )
}

export default Navbar
