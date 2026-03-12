function AuthInput({
  id,
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  icon: Icon,
  autoComplete,
  rightSlot = null,
}) {
  return (
    <label htmlFor={id} className="block space-y-1.5">
      <span className="text-xs font-black uppercase tracking-[0.14em] text-[#5d2e8f]">{label}</span>
      <span className="relative block">
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#8750bc]">
          {Icon ? <Icon /> : null}
        </span>
        <input
          id={id}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          autoComplete={autoComplete}
          className="h-12 w-full rounded-xl border border-(--orchird-lilac)/70 bg-white/90 pl-10 pr-12 text-sm text-(--orchird-black) shadow-[0_8px_18px_rgba(69,32,110,0.08)] outline-none transition focus:border-(--orchird-green) focus:shadow-[0_0_0_4px_rgba(33,191,72,0.16)]"
        />
        {rightSlot ? <span className="absolute right-2 top-1/2 -translate-y-1/2">{rightSlot}</span> : null}
      </span>
    </label>
  )
}

export default AuthInput
