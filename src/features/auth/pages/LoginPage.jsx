import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { FaEnvelope, FaEye, FaEyeSlash, FaSignInAlt } from 'react-icons/fa'
import Button from '../../../components/atoms/Button'
import AuthInput from '../components/AuthInput'
import AuthLayout from '../components/AuthLayout'
import { authPageContent } from '../data/authPages'
import { ensureUsersSeeded, findUserByEmail } from '../utils/userStorage'

function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')

  const redirectTo = location.state?.redirectTo ?? '/'
  const showResetDone = Boolean(location.state?.resetDone)

  const handleSubmit = (event) => {
    event.preventDefault()
    setError('')

    if (!email.trim() || !password.trim()) return

    ensureUsersSeeded()
    const matchedUser = findUserByEmail(email.trim())

    if (!matchedUser || matchedUser.password !== password || matchedUser.status !== 'active') {
      setError('Credenciales inválidas o cuenta inactiva.')
      return
    }

    const fallbackName = email.trim().split('@')[0] || 'Usuario'

    localStorage.setItem('orchirdSession', 'active')
    localStorage.setItem('orchirdUserEmail', matchedUser.email)
    localStorage.setItem('orchirdUserName', matchedUser?.name ?? fallbackName)
    localStorage.setItem('orchirdUserGender', matchedUser?.gender ?? 'female')
    localStorage.setItem('orchirdUserRole', matchedUser?.role ?? 'cliente')
    window.dispatchEvent(new Event('orchird-auth-updated'))
    navigate(redirectTo)
  }

  return (
    <AuthLayout
      content={authPageContent.login}
      footer={
        <p className="text-sm text-(--orchird-black)/70">
          ¿Aún no tienes cuenta?{' '}
          <Link
            to="/registro"
            className="inline-flex items-center font-black text-[#6a39a0] transition duration-300 hover:-translate-y-0.5 hover:text-(--orchird-green)"
          >
            Regístrate
          </Link>
        </p>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {showResetDone ? (
          <p className="rounded-xl border border-(--orchird-green)/35 bg-(--orchird-green)/12 px-4 py-3 text-sm font-semibold text-(--orchird-green-dark)">
            Contraseña actualizada correctamente. Ya puedes iniciar sesión.
          </p>
        ) : null}
        {error ? (
          <p className="rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{error}</p>
        ) : null}

        <AuthInput
          id="login-email"
          label="Correo"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="tuemail@correo.com"
          autoComplete="email"
          icon={FaEnvelope}
        />

        <AuthInput
          id="login-password"
          label="Contraseña"
          type={showPassword ? 'text' : 'password'}
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Tu contraseña"
          autoComplete="current-password"
          icon={FaSignInAlt}
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

        <Button
          type="submit"
          className="h-12 w-full rounded-xl bg-linear-to-r from-(--orchird-green) to-(--orchird-green-dark) text-sm font-black uppercase tracking-[0.14em] shadow-[0_14px_30px_rgba(33,191,72,0.33)]"
        >
          Iniciar sesión
        </Button>

        <div className="pt-1 text-center">
          <Link
            to="/recuperar-password"
            className="inline-flex items-center text-xs font-black uppercase tracking-[0.12em] text-[#7b49ae] transition duration-300 hover:-translate-y-0.5 hover:text-(--orchird-green)"
          >
            ¿Olvidaste contraseña?
          </Link>
        </div>
      </form>
    </AuthLayout>
  )
}

export default LoginPage
