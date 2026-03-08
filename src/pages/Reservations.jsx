import PageHeader from '../components/organisms/PageHeader'
import Button from '../components/atoms/Button'

function Reservations() {
  return (
    <>
      <PageHeader title="Reservas" description="Agenda tu cita y vive la experiencia Orchird." />
      <section className="container-x pb-16">
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <p className="text-sm text-[var(--orchird-black)]/70">Proximamente integraremos el flujo completo de reservas conectado al backend.</p>
          <Button className="mt-4">Comenzar reserva</Button>
        </div>
      </section>
    </>
  )
}

export default Reservations
