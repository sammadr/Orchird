import { useState } from 'react'
import { FaCheckCircle } from 'react-icons/fa'

function BrandSignature({
  name = 'Samma',
  logoSrc = '/src/assets/images/samma.jpg',
  showVerified = true,
  className = '',
  textClassName = 'text-white',
  badgeClassName = 'text-[#8df5c0]',
}) {
  const [imgError, setImgError] = useState(false)

  return (
    <div className={`select-none ${className}`}>
      <div className="flex items-center gap-2">
        {imgError ? (
          <div className="grid h-10 w-10 place-items-center rounded-full bg-white/25 text-sm font-bold text-white ring-1 ring-white/30">
            {name?.[0]?.toUpperCase() ?? 'S'}
          </div>
        ) : (
          <img
            src={logoSrc}
            alt={`${name} logo`}
            className="h-10 w-10 rounded-full object-cover ring-1 ring-white/35"
            onError={() => setImgError(true)}
          />
        )}

        <span className={`text-sm font-semibold tracking-wide ${textClassName}`} style={{ fontFamily: '"Mochiy Pop One", cursive' }}>
          {name}
        </span>

        {showVerified ? <FaCheckCircle size={16} className={badgeClassName} /> : null}
      </div>
    </div>
  )
}

export default BrandSignature
