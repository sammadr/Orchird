import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import PageHeader from '../components/organisms/PageHeader'
import Button from '../components/atoms/Button'

function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const redirectTo = location.state?.redirectTo ?? '/'

  const handleSubmit = (event) => {
    event.preventDefault()

    if (!email.trim() || !password.trim()) return

    localStorage.setItem('orchirdSession', 'active')
    localStorage.setItem('orchirdUserEmail', email.trim())
    navigate(redirectTo)
  }

  return (
    <>
      <PageHeader title="Login" description="Accede para reservar, comprar y gestionar tu cuenta." />
      <section className="container-x pb-16">
        <form onSubmit={handleSubmit} className="mx-auto max-w-md space-y-4 rounded-2xl bg-white p-6 shadow-sm">
          <div>
            <label htmlFor="email" className="mb-1 block text-sm font-semibold">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full rounded-xl border border-(--orchird-black)/15 px-3 py-2 text-sm outline-none focus:border-(--orchird-green)"
            />
          </div>
          <div>
            <label htmlFor="password" className="mb-1 block text-sm font-semibold">Contrasena</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-xl border border-(--orchird-black)/15 px-3 py-2 text-sm outline-none focus:border-(--orchird-green)"
            />
          </div>
          <Button type="submit" className="w-full">Entrar</Button>
        </form>
      </section>
    </>
  )
}

export default Login
