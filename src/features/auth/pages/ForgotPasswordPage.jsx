import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FaEnvelope } from 'react-icons/fa'
import Button from '../../../components/atoms/Button'
import AuthInput from '../components/AuthInput'
import AuthLayout from '../components/AuthLayout'
import AuthStepper from '../components/AuthStepper'
import { authPageContent } from '../data/authPages'

function ForgotPasswordPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault()
    if (!email.trim()) return

    localStorage.setItem('orchirdRecoveryEmail', email.trim())
    navigate('/cambiar-password', { state: { email: email.trim() } })
  }

  return (
    <AuthLayout
      content={authPageContent.forgot}
      footer={
        <p className="text-sm text-(--orchird-black)/70">
          ¿Recordaste tu clave?{' '}
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
        <AuthStepper currentStep={1} />
        <p className="text-center text-sm text-(--orchird-black)/75">Ingresa tu email para encontrar tu cuenta.</p>

        <AuthInput
          id="forgot-email"
          label="Correo de la cuenta"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="tuemail@correo.com"
          autoComplete="email"
          icon={FaEnvelope}
        />

        <Button
          type="submit"
          className="h-12 w-full rounded-xl bg-linear-to-r from-(--orchird-green) to-(--orchird-green-dark) text-sm font-black uppercase tracking-[0.14em] shadow-[0_14px_30px_rgba(33,191,72,0.33)]"
        >
          Enviar enlace
        </Button>

        <p className="text-center text-xs font-black uppercase tracking-[0.12em] text-[#7b49ae]">
          ¿Aún no tienes cuenta?{' '}
          <Link
            to="/registro"
            className="inline-flex items-center transition duration-300 hover:-translate-y-0.5 hover:text-(--orchird-green)"
          >
            Regístrate
          </Link>
        </p>
      </form>
    </AuthLayout>
  )
}

export default ForgotPasswordPage
