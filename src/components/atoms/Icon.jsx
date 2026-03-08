function Icon({ icon: IconComponent, className = '' }) {
  if (!IconComponent) return null
  return <IconComponent className={className} aria-hidden="true" />
}

export default Icon
