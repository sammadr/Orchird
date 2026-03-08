import PageHeader from '../components/organisms/PageHeader'
import Button from '../components/atoms/Button'

function Login() {
  return (
    <>
      <PageHeader title="Login" description="Accede para reservar, comprar y gestionar tu cuenta." />
      <section className="container-x pb-16">
        <form className="mx-auto max-w-md space-y-4 rounded-2xl bg-white p-6 shadow-sm">
          <div>
            <label htmlFor="email" className="mb-1 block text-sm font-semibold">Email</label>
            <input id="email" type="email" className="w-full rounded-xl border border-[var(--orchird-black)]/15 px-3 py-2 text-sm outline-none focus:border-[var(--orchird-green)]" />
          </div>
          <div>
            <label htmlFor="password" className="mb-1 block text-sm font-semibold">Contrasena</label>
            <input id="password" type="password" className="w-full rounded-xl border border-[var(--orchird-black)]/15 px-3 py-2 text-sm outline-none focus:border-[var(--orchird-green)]" />
          </div>
          <Button type="submit" className="w-full">Entrar</Button>
        </form>
      </section>
    </>
  )
}

export default Login
