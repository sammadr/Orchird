const variants = {
  primary: 'bg-[var(--orchird-green)] text-white hover:bg-[var(--orchird-green-dark)]',
  ghost: 'bg-white text-[var(--orchird-black)] border border-[var(--orchird-black)]/15 hover:bg-[var(--orchird-smoke)]',
}

function Button({ children, className = '', variant = 'primary', ...props }) {
  return (
    <button
      className={`inline-flex items-center justify-center rounded-xl px-5 py-2.5 text-sm font-semibold transition ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}

export default Button
