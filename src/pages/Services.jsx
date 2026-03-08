import PageHeader from '../components/organisms/PageHeader'
import { skills } from '../data/skills'

function Services() {
  return (
    <>
      <PageHeader title="Servicios" description="Conoce nuestros servicios especializados para rizos y ondas." />
      <section className="container-x pb-16">
        <ul className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
          {skills.map((item) => (
            <li key={item} className="rounded-xl bg-white p-4 shadow-sm">{item}</li>
          ))}
        </ul>
      </section>
    </>
  )
}

export default Services
