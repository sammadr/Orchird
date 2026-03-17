import { useState } from 'react'
import { FaBell, FaCalendarCheck, FaClock, FaShoppingBag, FaStar } from 'react-icons/fa'
import AccountPageLayout from '../components/AccountPageLayout'
import AccountNotificationsPanel from '../components/AccountNotificationsPanel'
import AccountPurchasesPanel from '../components/AccountPurchasesPanel'
import AccountReservationsPanel from '../components/AccountReservationsPanel'
import AccountTestimonialsPanel from '../components/AccountTestimonialsPanel'
import AccountWaitlistPanel from '../components/AccountWaitlistPanel'
import { accountSections } from '../data/accountSections'

const sectionIcons = {
  reservas: FaCalendarCheck,
  compras: FaShoppingBag,
  testimonios: FaStar,
  'lista-espera': FaClock,
  notificaciones: FaBell,
}

const enabledSections = new Set(['reservas', 'compras', 'testimonios', 'lista-espera', 'notificaciones'])

function AccountOverviewPage() {
  const userName = localStorage.getItem('orchirdUserName') ?? 'Cliente'
  const [activeSection, setActiveSection] = useState('reservas')

  return (
    <AccountPageLayout
      eyebrow="Área de cliente"
      title="Mi cuenta"
      subtitle={`Hola, ${userName}. Desde aquí podrás gestionar tu actividad completa en Orchid.`}
    >
      <div className="flex flex-wrap gap-2.5 md:gap-3">
        {accountSections.map((section) => {
          const Icon = sectionIcons[section.id] ?? FaStar
          const enabled = enabledSections.has(section.id)
          const isActive = activeSection === section.id

          return (
            <button
              key={section.id}
              type="button"
              onClick={() => setActiveSection(section.id)}
              className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-black uppercase tracking-[0.11em] transition duration-200 ${
                isActive
                  ? 'border-(--orchird-lavender) bg-(--orchird-lavender) text-white shadow-[0_10px_22px_rgba(143,99,188,0.34)]'
                  : enabled
                  ? 'border-(--orchird-lilac)/60 bg-[#f8efff] text-[#6d3ea2] hover:-translate-y-0.5 hover:bg-(--orchird-lilac)/35'
                  : 'border-(--orchird-lilac)/50 bg-white text-[#8b7a9b] hover:bg-[#f7f2fa]'
              }`}
            >
              <span
                className={`inline-flex h-6 w-6 items-center justify-center rounded-full ${
                  isActive
                    ? 'bg-white/20 text-white'
                    : enabled
                    ? 'bg-[#ead7fb] text-[#6d3ea2]'
                    : 'bg-[#f0e9f5] text-[#8b7a9b]'
                }`}
              >
                <Icon className="text-[11px]" />
              </span>
              {section.title}
              {!enabled ? (
                <span className="rounded-full border border-(--orchird-lilac)/55 bg-white px-2 py-0.5 text-[9px] text-[#8b7a9b]">
                  Próximamente
                </span>
              ) : null}
            </button>
          )
        })}
      </div>

      <div className="mt-6 md:mt-7">
        {activeSection === 'reservas' ? <AccountReservationsPanel /> : null}
        {activeSection === 'compras' ? <AccountPurchasesPanel /> : null}
        {activeSection === 'testimonios' ? <AccountTestimonialsPanel /> : null}
        {activeSection === 'lista-espera' ? <AccountWaitlistPanel /> : null}
        {activeSection === 'notificaciones' ? <AccountNotificationsPanel /> : null}

        {!enabledSections.has(activeSection) ? (
          <div className="rounded-2xl border border-(--orchird-lilac)/55 bg-[#fbf7ff] px-4 py-6 md:px-5">
            <p className="text-lg font-black text-[#45206e]">{accountSections.find((item) => item.id === activeSection)?.title}</p>
            <p className="mt-2 text-sm leading-7 text-(--orchird-black)/75">
              Esta sección se implementará en el siguiente bloque de trabajo.
            </p>
          </div>
        ) : null}
      </div>
    </AccountPageLayout>
  )
}

export default AccountOverviewPage
