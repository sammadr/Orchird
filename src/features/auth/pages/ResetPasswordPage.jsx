import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { FaEye, FaEyeSlash, FaLock } from 'react-icons/fa'
import Button from '../../../components/atoms/Button'
import AuthInput from '../components/AuthInput'
import AuthLayout from '../components/AuthLayout'
import AuthStepper from '../components/AuthStepper'
import { authPageContent } from '../data/authPages'
import { ensureUsersSeeded, getUsers, saveUsers } from '../utils/userStorage'

function ResetPasswordPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const recoveryEmail = location.state?.email ?? localStorage.getItem('orchirdRecoveryEmail') ?? ''

  const handleSubmit = (event) => {
    event.preventDefault()
    if (!newPassword.trim() || newPassword !== confirmPassword) return

    ensureUsersSeeded()
    const users = getUsers()

    if (recoveryEmail) {
      const nextUsers = users.map((user) =>
        user.email === recoveryEmail ? { ...user, password: newPassword } : user,
      )
      saveUsers(nextUsers)
    }

    localStorage.removeItem('orchirdRecoveryEmail')
    navigate('/login', { state: { resetDone: true } })
  }

  return (
    <AuthLayout
      content={authPageContent.reset}
      footer={
        <p className="text-sm text-(--orchird-black)/70">
          Volver a{' '}
          <Link
            to="/login"
            className="inline-flex items-center font-black text-[#6a39a0] transition duration-300 hover:-translate-y-0.5 hover:text-(--orchird-green)"
          >
            iniciar sesión
          </Link>
        </p>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <AuthStepper currentStep={2} />
        <p className="text-center text-sm text-(--orchird-black)/75">Crea tu nueva contraseña para terminar el proceso.</p>

        {recoveryEmail ? (
          <p className="rounded-xl border border-(--orchird-lilac)/55 bg-(--orchird-lilac)/20 px-4 py-3 text-sm leading-6 text-(--orchird-black)/75">
            Cuenta a actualizar: <span className="font-black">{recoveryEmail}</span>
          </p>
        ) : null}

        <AuthInput
          id="reset-password"
          label="Nueva contraseña"
          type={showNewPassword ? 'text' : 'password'}
          value={newPassword}
          onChange={(event) => setNewPassword(event.target.value)}
          placeholder="Nueva contraseña"
          autoComplete="new-password"
          icon={FaLock}
          rightSlot={
            <button
              type="button"
              onClick={() => setShowNewPassword((prev) => !prev)}
              className="inline-flex h-8 w-8 items-center justify-center rounded-full text-[#7f4ab4] transition hover:bg-(--orchird-lilac)/35"
              aria-label={showNewPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
            >
              {showNewPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          }
        />

        <AuthInput
          id="reset-confirm-password"
          label="Confirmar contraseña"
          type={showConfirmPassword ? 'text' : 'password'}
          value={confirmPassword}
          onChange={(event) => setConfirmPassword(event.target.value)}
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
          Guardar nueva contraseña
        </Button>
      </form>
    </AuthLayout>
  )
}

export default ResetPasswordPage
