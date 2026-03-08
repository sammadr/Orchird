import PageHeader from '../components/organisms/PageHeader'

function Contact() {
  return (
    <>
      <PageHeader title="Contacto" description="Escribenos para consultas, colaboraciones o soporte." />
      <section className="container-x pb-16">
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <p className="text-sm">Email: hola@orchirdstudio.com</p>
          <p className="mt-2 text-sm">WhatsApp: +1 (809) 000-0000</p>
        </div>
      </section>
    </>
  )
}

export default Contact
