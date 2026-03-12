import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FaEnvelope, FaEye, FaEyeSlash, FaLock, FaPhoneAlt, FaUser } from 'react-icons/fa'
import Button from '../../../components/atoms/Button'
import AuthInput from '../components/AuthInput'
import AuthLayout from '../components/AuthLayout'
import { authPageContent } from '../data/authPages'
import { ensureUsersSeeded, getUsers, saveUsers } from '../utils/userStorage'

function RegisterPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: '',
    gender: 'female',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const onFieldChange = (field) => (event) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    if (!form.name.trim() || !form.email.trim() || !form.password.trim()) return
    if (form.password !== form.confirmPassword) return

    ensureUsersSeeded()
    const users = getUsers()
    const nextUsers = users.filter((user) => user.email !== form.email.trim())

    const nextIdNumber = nextUsers.length + 1

    nextUsers.push({
      id: `u${nextIdNumber}`,
      name: form.name.trim(),
      phone: form.phone.trim(),
      email: form.email.trim(),
      password: form.password,
      role: 'cliente',
      status: 'active',
      gender: form.gender,
    })

    saveUsers(nextUsers)
    localStorage.setItem('orchirdSession', 'active')
    localStorage.setItem('orchirdUserEmail', form.email.trim())
    localStorage.setItem('orchirdUserName', form.name.trim())
    localStorage.setItem('orchirdUserGender', form.gender)
    localStorage.setItem('orchirdUserRole', 'cliente')
    window.dispatchEvent(new Event('orchird-auth-updated'))
    navigate('/')
  }

  return (
    <AuthLayout
      content={authPageContent.register}
      footer={
        <p className="text-sm text-(--orchird-black)/70">
          ¿Ya tienes cuenta?{' '}
          <Link
            to="/login"
            className="inline-flex items-center font-black text-[#6a39a0] transition duration-300 hover:-translate-y-0.5 hover:text-(--orchird-green)"
          >
            Inicia sesión
          </Link>
        </p>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <AuthInput
          id="register-name"
          label="Nombre completo"
          value={form.name}
          onChange={onFieldChange('name')}
          placeholder="Tu nombre"
          autoComplete="name"
          icon={FaUser}
        />

        <AuthInput
          id="register-phone"
          label="Teléfono"
          type="tel"
          value={form.phone}
          onChange={onFieldChange('phone')}
          placeholder="809-000-0000"
          autoComplete="tel"
          icon={FaPhoneAlt}
        />

        <AuthInput
          id="register-email"
          label="Correo"
          type="email"
          value={form.email}
          onChange={onFieldChange('email')}
          placeholder="tuemail@correo.com"
          autoComplete="email"
          icon={FaEnvelope}
        />

        <label htmlFor="register-gender" className="block space-y-1.5">
          <span className="text-xs font-black uppercase tracking-[0.14em] text-[#5d2e8f]">Género</span>
          <select
            id="register-gender"
            value={form.gender}
            onChange={onFieldChange('gender')}
            className="h-12 w-full rounded-xl border border-(--orchird-lilac)/70 bg-white/90 px-3 text-sm text-(--orchird-black) shadow-[0_8px_18px_rgba(69,32,110,0.08)] outline-none transition focus:border-(--orchird-green) focus:shadow-[0_0_0_4px_rgba(33,191,72,0.16)]"
          >
            <option value="female">Mujer</option>
            <option value="male">Hombre</option>
          </select>
        </label>

        <AuthInput
          id="register-password"
          label="Contraseña"
          type={showPassword ? 'text' : 'password'}
          value={form.password}
          onChange={onFieldChange('password')}
          placeholder="Crea tu contraseña"
          autoComplete="new-password"
          icon={FaLock}
          rightSlot={
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="inline-flex h-8 w-8 items-center justify-center rounded-full text-[#7f4ab4] transition hover:bg-(--orchird-lilac)/35"
              aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          }
        />

        <AuthInput
          id="register-confirm-password"
          label="Confirmar contraseña"
          type={showConfirmPassword ? 'text' : 'password'}
          value={form.confirmPassword}
          onChange={onFieldChange('confirmPassword')}
          placeholder="Repite tu contraseña"
          autoComplete="new-password"
          icon={FaLock}
          rightSlot={
            <button
              type="button"
              onClick={() => setShowConfirmPassword((prev) => !prev)}
              className="inline-flex h-8 w-8 items-center justify-center rounded-full text-[#7f4ab4] transition hover:bg-(--orchird-lilac)/35"
              aria-label={showConfirmPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
            >
              {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          }
        />

        <Button
          type="submit"
          className="h-12 w-full rounded-xl bg-linear-to-r from-(--orchird-green) to-(--orchird-green-dark) text-sm font-black uppercase tracking-[0.14em] shadow-[0_14px_30px_rgba(33,191,72,0.33)]"
        >
          Crear cuenta
        </Button>
      </form>
    </AuthLayout>
  )
}

export default RegisterPage
