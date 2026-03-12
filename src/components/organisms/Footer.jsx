import { FaInstagram, FaTiktok, FaWhatsapp } from 'react-icons/fa'
import BrandSignature from '../molecules/BrandSignature'
import { footerData } from '../../data/footerData'

const socialIcons = {
  instagram: FaInstagram,
  whatsapp: FaWhatsapp,
  tiktok: FaTiktok,
}

function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="bg-linear-to-r from-(--orchird-lilac) via-[#c69ce1] to-(--orchird-lilac) py-10 md:py-12">
      <div className="container-x grid gap-8 md:grid-cols-3 md:items-center">
        <div className="flex items-center gap-4 md:justify-start">
          <div className="relative h-20 w-20 shrink-0">
            <span className="absolute -inset-3 rounded-full bg-(--orchird-green)/20 blur-md animate-pulse" />
            <span className="absolute inset-0 rounded-full border border-white/75 animate-[spin_12s_linear_infinite]" />
            <span className="absolute -inset-1 rounded-full border border-[#ffffffa8] animate-[spin_8s_linear_infinite_reverse]" />
            <span className="absolute -inset-2 rounded-full border border-[#ffffff66] animate-[spin_16s_linear_infinite]" />
            <span className="absolute -inset-2 rounded-full border border-(--orchird-green)/35 animate-ping [animation-duration:2.8s]" />
            <img
              src={footerData.logo.src}
              alt={footerData.logo.alt}
              className="relative h-20 w-20 rounded-full bg-white object-contain shadow-[0_10px_24px_rgba(69,32,110,0.2),0_0_18px_rgba(36,166,69,0.42)]"
            />
          </div>
          <p className="text-sm font-bold uppercase tracking-wide text-white drop-shadow">
            {footerData.brandName} © {year}
          </p>
        </div>

        <div className="flex items-center justify-center gap-3 md:gap-4">
          {footerData.socials.map((social) => {
            const Icon = socialIcons[social.key]

            return (
              <a
                key={social.key}
                href={social.href}
                target="_blank"
                rel="noreferrer"
                className={`group inline-flex h-12 w-12 items-center justify-center rounded-full transition hover:-translate-y-1 hover:scale-105 ${social.baseBg} ${social.baseGlow} ${social.hoverBg} ${social.hoverGlow}`}
                aria-label={social.ariaLabel}
              >
                <Icon className={`text-lg transition-colors ${social.iconColor} group-hover:text-white`} />
              </a>
            )
          })}
        </div>

        <div className="flex flex-col items-center gap-2 md:items-end">
          <p className="text-xs font-black uppercase tracking-[0.14em] text-white/90">{footerData.signature.label}</p>
          <a
            href={footerData.signature.portfolioUrl}
            target="_blank"
            rel="noreferrer"
            className="rounded-full bg-black/12 px-3 py-2 backdrop-blur-sm transition hover:-translate-y-0.5 hover:bg-black/18"
            aria-label="Ir al portafolio de Samma"
          >
            <BrandSignature
              name={footerData.signature.name}
              logoSrc={footerData.signature.logoSrc}
              textClassName="text-white"
              badgeClassName="text-[#9ef8cb]"
            />
          </a>
        </div>
      </div>
    </footer>
  )
}

export default Footer
