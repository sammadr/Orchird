function Text({ children, className = '' }) {
  return <p className={`text-[15px] leading-7 text-[var(--orchird-black)]/75 ${className}`}>{children}</p>
}

export default Text
