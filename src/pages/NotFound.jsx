import { Link } from 'react-router-dom'
import Button from '../components/atoms/Button'

function NotFound() {
  return (
    <section className="section-pad">
      <div className="container-x rounded-2xl bg-white p-8 text-center shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-(--orchird-green-dark)">404</p>
        <h1 className="mt-3 text-3xl font-bold">Pagina no encontrada</h1>
        <p className="mt-2 text-sm text-(--orchird-black)/70">La ruta que buscas no existe o aun no esta disponible.</p>
        <Link to="/" className="mt-5 inline-block">
          <Button>Volver al inicio</Button>
        </Link>
      </div>
    </section>
  )
}

export default NotFound
