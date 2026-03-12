import { NavLink } from 'react-router-dom'

function NavItem({ to, children, onClick }) {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        `relative inline-flex items-center px-1 py-1 text-sm font-medium tracking-tight transition-colors duration-300 ${
          isActive
            ? 'text-(--orchird-green) after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-full after:scale-x-100 after:bg-(--orchird-green) after:transition-transform after:duration-300'
            : 'text-(--orchird-lilac) after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-full after:origin-left after:scale-x-0 after:bg-(--orchird-green) after:transition-transform after:duration-300 hover:text-(--orchird-green) hover:after:scale-x-100'
        }`
      }
    >
      {children}
    </NavLink>
  )
}

export default NavItem
