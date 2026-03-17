import { useEffect, useState } from 'react'
import {
  FaBell,
  FaCheckCircle,
  FaEnvelope,
  FaLock,
  FaPhoneAlt,
  FaShieldAlt,
  FaUser,
  FaUserCog,
} from 'react-icons/fa'
import AccountPageLayout from '../components/AccountPageLayout'

const SETTINGS_KEY = 'orchirdAccountSettings'

const sectionIcons = {
  cuenta: FaUserCog,
  seguridad: FaLock,
  notificaciones: FaBell,
}

const initialSettings = {
  account: {
    name: '',
    phone: '',
  },
  security: {
    currentPassword: '',
    nextPassword: '',
    confirmPassword: '',
  },
  notifications: {
    reservations: true,
    purchases: true,
    waitlist: true,
    promotions: false,
  },
}

function AccountSettingsPage() {
  const userName = localStorage.getItem('orchirdUserName') ?? 'Cliente'
  const userEmail = localStorage.getItem('orchirdUserEmail') ?? ''
  const [activeSection, setActiveSection] = useState('cuenta')
  const [toast, setToast] = useState('')
  const [settings, setSettings] = useState(() => {
    const saved = JSON.parse(localStorage.getItem(SETTINGS_KEY) ?? 'null')
    if (!saved) {
      return {
        ...initialSettings,
        account: {
          name: userName,
          phone: '',
        },
      }
    }
    return {
      ...initialSettings,
      ...saved,
      account: {
        ...initialSettings.account,
        ...saved.account,
        name: saved.account?.name || userName,
      },
      notifications: {
        ...initialSettings.notifications,
        ...saved.notifications,
      },
    }
  })

  useEffect(() => {
    if (!toast) return undefined
    const timeout = setTimeout(() => setToast(''), 2800)
    return () => clearTimeout(timeout)
  }, [toast])

  const updateAccountField = (field, value) => {
    setSettings((prev) => ({
      ...prev,
      account: {
        ...prev.account,
        [field]: value,
      },
    }))
  }

  const updateSecurityField = (field, value) => {
    setSettings((prev) => ({
      ...prev,
      security: {
        ...prev.security,
        [field]: value,
      },
    }))
  }

  const toggleNotification = (field) => {
    setSettings((prev) => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [field]: !prev.notifications[field],
      },
    }))
  }

  const saveAccount = () => {
    if (!settings.account.name.trim()) {
      setToast('El nombre es obligatorio para guardar tu perfil.')
      return
    }

    const next = {
      ...settings,
      account: {
        ...settings.account,
        name: settings.account.name.trim(),
      },
      security: {
        ...settings.security,
        currentPassword: '',
        nextPassword: '',
        confirmPassword: '',
      },
    }

    setSettings(next)
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(next))
    localStorage.setItem('orchirdUserName', next.account.name)
    setToast('Ajustes guardados correctamente.')
  }

  const saveSecurity = () => {
    const { currentPassword, nextPassword, confirmPassword } = settings.security
    if (!currentPassword || !nextPassword || !confirmPassword) {
      setToast('Completa todos los campos de seguridad.')
      return
    }

    if (nextPassword.length < 6) {
      setToast('La nueva contraseña debe tener al menos 6 caracteres.')
      return
    }

    if (nextPassword !== confirmPassword) {
      setToast('La confirmación no coincide con la nueva contraseña.')
      return
    }

    localStorage.setItem(
      SETTINGS_KEY,
      JSON.stringify({
        ...settings,
        security: {
          currentPassword: '',
          nextPassword: '',
          confirmPassword: '',
        },
      }),
    )

    setSettings((prev) => ({
      ...prev,
      security: {
        currentPassword: '',
        nextPassword: '',
        confirmPassword: '',
      },
    }))
    setToast('Contraseña actualizada (modo demo local).')
  }

  const saveNotifications = () => {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings))
    setToast('Preferencias de notificación actualizadas.')
  }

  return (
    <AccountPageLayout
      eyebrow="Área de cliente"
      title="Ajustes"
      subtitle="Gestiona tu perfil, seguridad y notificaciones en un flujo claro y rápido."
    >
      {toast ? (
        <div className="mb-4 rounded-2xl border border-(--orchird-green)/35 bg-(--orchird-green)/12 px-4 py-3 text-sm font-semibold text-(--orchird-green-dark)">
          <span className="inline-flex items-center gap-2">
            <FaCheckCircle className="text-xs" />
            {toast}
          </span>
        </div>
      ) : null}

      <div className="grid gap-4 md:grid-cols-3">
        {Object.keys(sectionIcons).map((id) => {
          const Icon = sectionIcons[id]
          const isActive = activeSection === id

          return (
            <button
              key={id}
              type="button"
              onClick={() => setActiveSection(id)}
              className={`rounded-2xl border p-4 text-left transition duration-200 ${
                isActive
                  ? 'border-(--orchird-lavender) bg-[#f3e7fb] shadow-[0_14px_28px_rgba(69,32,110,0.14)]'
                  : 'border-(--orchird-lilac)/50 bg-[#fbf7ff] hover:-translate-y-0.5 hover:shadow-[0_14px_28px_rgba(69,32,110,0.14)]'
              }`}
            >
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-linear-to-br from-(--orchird-lilac) to-(--orchird-lavender) text-white shadow-[0_10px_18px_rgba(143,99,188,0.32)]">
                <Icon className="text-sm" />
              </span>
              <p className="mt-3 text-lg font-black text-[#45206e]">
                {id === 'cuenta' ? 'Datos de la cuenta' : id === 'seguridad' ? 'Seguridad' : 'Notificaciones'}
              </p>
            </button>
          )
        })}
      </div>

      <div className="mt-5 rounded-3xl border border-(--orchird-lilac)/55 bg-white p-5 shadow-[0_16px_34px_rgba(69,32,110,0.12)] md:p-6">
        {activeSection === 'cuenta' ? (
          <div>
            <h2 className="text-2xl font-black text-[#45206e]">Datos de la cuenta</h2>
            <p className="mt-1 text-sm text-(--orchird-black)/72">Tu información principal para reservas y compras.</p>

            <div className="mt-4 grid gap-3 md:grid-cols-2">
              <label className="space-y-1.5">
                <span className="text-xs font-black uppercase tracking-[0.1em] text-[#7a49af]">Nombre</span>
                <div className="relative">
                  <FaUser className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#7a49af]" />
                  <input
                    type="text"
                    value={settings.account.name}
                    onChange={(event) => updateAccountField('name', event.target.value)}
                    className="h-11 w-full rounded-xl border border-(--orchird-lilac)/55 bg-white pl-10 pr-3 text-sm text-(--orchird-black)/85 outline-none transition focus:border-(--orchird-lavender)"
                  />
                </div>
              </label>

              <label className="space-y-1.5">
                <span className="text-xs font-black uppercase tracking-[0.1em] text-[#7a49af]">Correo</span>
                <div className="relative">
                  <FaEnvelope className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#7a49af]" />
                  <input
                    type="email"
                    value={userEmail}
                    disabled
                    className="h-11 w-full cursor-not-allowed rounded-xl border border-(--orchird-lilac)/55 bg-[#f8f3fb] pl-10 pr-3 text-sm text-(--orchird-black)/75"
                  />
                </div>
              </label>

              <label className="space-y-1.5 md:col-span-2">
                <span className="text-xs font-black uppercase tracking-[0.1em] text-[#7a49af]">Teléfono</span>
                <div className="relative">
                  <FaPhoneAlt className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#7a49af]" />
                  <input
                    type="text"
                    value={settings.account.phone}
                    onChange={(event) => updateAccountField('phone', event.target.value)}
                    placeholder="Ej: +1 829 000 0000"
                    className="h-11 w-full rounded-xl border border-(--orchird-lilac)/55 bg-white pl-10 pr-3 text-sm text-(--orchird-black)/85 outline-none transition focus:border-(--orchird-lavender)"
                  />
                </div>
              </label>
            </div>

            <button
              type="button"
              onClick={saveAccount}
              className="mt-5 inline-flex h-11 items-center justify-center rounded-xl bg-linear-to-r from-(--orchird-green) to-(--orchird-green-dark) px-5 text-xs font-black uppercase tracking-[0.12em] text-white transition hover:-translate-y-0.5 hover:brightness-105"
            >
              Guardar datos
            </button>
          </div>
        ) : null}

        {activeSection === 'seguridad' ? (
          <div>
            <h2 className="text-2xl font-black text-[#45206e]">Seguridad</h2>
            <p className="mt-1 text-sm text-(--orchird-black)/72">Actualiza tu contraseña y protege tu acceso.</p>

            <div className="mt-4 grid gap-3 md:grid-cols-3">
              <label className="space-y-1.5">
                <span className="text-xs font-black uppercase tracking-[0.1em] text-[#7a49af]">Actual</span>
                <div className="relative">
                  <FaShieldAlt className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#7a49af]" />
                  <input
                    type="password"
                    value={settings.security.currentPassword}
                    onChange={(event) => updateSecurityField('currentPassword', event.target.value)}
                    className="h-11 w-full rounded-xl border border-(--orchird-lilac)/55 bg-white pl-10 pr-3 text-sm text-(--orchird-black)/85 outline-none transition focus:border-(--orchird-lavender)"
                  />
                </div>
              </label>

              <label className="space-y-1.5">
                <span className="text-xs font-black uppercase tracking-[0.1em] text-[#7a49af]">Nueva</span>
                <input
                  type="password"
                  value={settings.security.nextPassword}
                  onChange={(event) => updateSecurityField('nextPassword', event.target.value)}
                  className="h-11 w-full rounded-xl border border-(--orchird-lilac)/55 bg-white px-3 text-sm text-(--orchird-black)/85 outline-none transition focus:border-(--orchird-lavender)"
                />
              </label>

              <label className="space-y-1.5">
                <span className="text-xs font-black uppercase tracking-[0.1em] text-[#7a49af]">Confirmar</span>
                <input
                  type="password"
                  value={settings.security.confirmPassword}
                  onChange={(event) => updateSecurityField('confirmPassword', event.target.value)}
                  className="h-11 w-full rounded-xl border border-(--orchird-lilac)/55 bg-white px-3 text-sm text-(--orchird-black)/85 outline-none transition focus:border-(--orchird-lavender)"
                />
              </label>
            </div>

            <button
              type="button"
              onClick={saveSecurity}
              className="mt-5 inline-flex h-11 items-center justify-center rounded-xl bg-linear-to-r from-(--orchird-lavender) to-[#9c65ca] px-5 text-xs font-black uppercase tracking-[0.12em] text-white transition hover:-translate-y-0.5 hover:brightness-105"
            >
              Actualizar contraseña
            </button>
          </div>
        ) : null}

        {activeSection === 'notificaciones' ? (
          <div>
            <h2 className="text-2xl font-black text-[#45206e]">Notificaciones</h2>
            <p className="mt-1 text-sm text-(--orchird-black)/72">Controla qué avisos quieres recibir por correo electrónico (modo demo local por ahora).</p>

            <div className="mt-4 space-y-3">
              {[
                { key: 'reservations', label: 'Reservas (confirmación y cambios)' },
                { key: 'purchases', label: 'Compras y facturación' },
                { key: 'waitlist', label: 'Lista de espera de productos' },
                { key: 'promotions', label: 'Promociones y novedades' },
              ].map((item) => (
                <label
                  key={item.key}
                  className="flex items-center justify-between rounded-xl border border-(--orchird-lilac)/50 bg-[#faf5fd] px-4 py-3"
                >
                  <span className="text-sm font-semibold text-(--orchird-black)/82">{item.label}</span>
                  <button
                    type="button"
                    onClick={() => toggleNotification(item.key)}
                    className={`inline-flex h-7 w-12 items-center rounded-full p-1 transition ${
                      settings.notifications[item.key]
                        ? 'bg-(--orchird-green) justify-end'
                        : 'bg-[#d8c7e5] justify-start'
                    }`}
                    aria-label={`Toggle ${item.label}`}
                  >
                    <span className="h-5 w-5 rounded-full bg-white shadow" />
                  </button>
                </label>
              ))}
            </div>

            <button
              type="button"
              onClick={saveNotifications}
              className="mt-5 inline-flex h-11 items-center justify-center rounded-xl border border-(--orchird-lilac)/60 bg-[#f6eefa] px-5 text-xs font-black uppercase tracking-[0.12em] text-[#6d3ea2] transition hover:-translate-y-0.5 hover:bg-(--orchird-lilac)/28"
            >
              Guardar preferencias
            </button>
          </div>
        ) : null}
      </div>
    </AccountPageLayout>
  )
}

export default AccountSettingsPage

