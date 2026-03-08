import { NavLink } from 'react-router-dom'

function NavItem({ to, children, onClick }) {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        `text-sm font-medium transition hover:text-[var(--orchird-green)] ${isActive ? 'text-[var(--orchird-green)]' : 'text-[var(--orchird-black)]/80'}`
      }
    >
      {children}
    </NavLink>
  )
}

export default NavItem
