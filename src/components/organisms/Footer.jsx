import { BRAND } from '../../utils/constants'
import { socials } from '../../data/socials'
import SocialLinks from '../molecules/SocialLinks'

function Footer() {
  return (
    <footer className="mt-8 border-t border-[var(--orchird-black)]/10 bg-white">
      <div className="container-x flex flex-col items-start justify-between gap-5 py-8 md:flex-row md:items-center">
        <div>
          <p className="text-lg font-bold">{BRAND.name}</p>
          <p className="text-sm text-[var(--orchird-black)]/65">Santo Domingo, Republica Dominicana</p>
        </div>
        <SocialLinks socials={socials} />
      </div>
    </footer>
  )
}

export default Footer
