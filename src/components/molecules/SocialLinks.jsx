import { FaInstagram, FaWhatsapp, FaFacebookF } from 'react-icons/fa'

const map = {
  instagram: FaInstagram,
  whatsapp: FaWhatsapp,
  facebook: FaFacebookF,
}

function SocialLinks({ socials }) {
  return (
    <ul className="flex items-center gap-3">
      {socials.map((item) => {
        const Icon = map[item.type]
        return (
          <li key={item.type}>
            <a
              href={item.href}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[var(--orchird-black)] text-white transition hover:bg-[var(--orchird-green)]"
              aria-label={item.label}
            >
              {Icon ? <Icon /> : null}
            </a>
          </li>
        )
      })}
    </ul>
  )
}

export default SocialLinks
