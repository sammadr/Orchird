import orchirdLogo from '../assets/images/logos/l-c.png'

export const footerData = {
  brandName: 'Orchird Beauty House',
  logo: {
    src: orchirdLogo,
    alt: 'Logo Orchird',
  },
  socials: [
    {
      key: 'instagram',
      href: 'https://instagram.com/orchidbeauty.house',
      ariaLabel: 'Instagram de Orchird',
      baseBg: 'bg-[#f9ecff]',
      baseGlow: 'shadow-[0_10px_22px_rgba(138,74,188,0.28)]',
      hoverBg: 'hover:bg-[#8a4abc]',
      hoverGlow: 'hover:shadow-[0_0_26px_rgba(138,74,188,0.55)]',
      iconColor: 'text-[#8a4abc]',
    },
    {
      key: 'whatsapp',
      href: 'https://wa.me/18297923068',
      ariaLabel: 'WhatsApp de Orchird',
      baseBg: 'bg-[#eaf9ee]',
      baseGlow: 'shadow-[0_10px_22px_rgba(36,166,69,0.26)]',
      hoverBg: 'hover:bg-[#24a645]',
      hoverGlow: 'hover:shadow-[0_0_26px_rgba(36,166,69,0.55)]',
      iconColor: 'text-[#24a645]',
    },
    {
      key: 'tiktok',
      href: 'https://www.tiktok.com/@orchidbeauty.house',
      ariaLabel: 'TikTok de Orchird',
      baseBg: 'bg-[#f2e8fb]',
      baseGlow: 'shadow-[0_10px_22px_rgba(69,32,110,0.28)]',
      hoverBg: 'hover:bg-[#6f3ea5]',
      hoverGlow: 'hover:shadow-[0_0_26px_rgba(111,62,165,0.55)]',
      iconColor: 'text-[#6f3ea5]',
    },
  ],
  signature: {
    label: 'Diseñado por:',
    name: 'Samma',
    logoSrc: '/src/assets/images/samma.jpg',
    portfolioUrl: 'https://samma.dev',
  },
}
