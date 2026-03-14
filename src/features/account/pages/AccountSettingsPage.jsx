import { FaBell, FaLock, FaUserCog } from 'react-icons/fa'
import AccountPageLayout from '../components/AccountPageLayout'
import { settingsSections } from '../data/accountSections'

const sectionIcons = {
  cuenta: FaUserCog,
  seguridad: FaLock,
  notificaciones: FaBell,
}

function AccountSettingsPage() {
  return (
    <AccountPageLayout
      eyebrow="Area de cliente"
      title="Ajustes"
      subtitle="Configura tu perfil, seguridad y preferencias de notificaciones desde un solo lugar."
    >
      <div className="grid gap-4 md:grid-cols-3">
        {settingsSections.map((section) => {
          const Icon = sectionIcons[section.id] ?? FaUserCog

          return (
            <article
              key={section.id}
              className="rounded-2xl border border-(--orchird-lilac)/50 bg-[#fbf7ff] p-4 transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_14px_28px_rgba(69,32,110,0.14)]"
            >
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-linear-to-br from-(--orchird-lilac) to-(--orchird-lavender) text-white shadow-[0_10px_18px_rgba(143,99,188,0.32)]">
                <Icon className="text-sm" />
              </span>
              <h2 className="mt-3 text-xl font-black text-[#45206e]">{section.title}</h2>
              <p className="mt-2 text-sm leading-6 text-(--orchird-black)/75">{section.description}</p>
            </article>
          )
        })}
      </div>
    </AccountPageLayout>
  )
}

export default AccountSettingsPage
