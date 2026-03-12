import Title from '../atoms/Title'
import Text from '../atoms/Text'

function AboutSection() {
  return (
    <section className="section-pad">
      <div className="container-x rounded-3xl border border-(--orchird-black)/10 bg-white p-8 md:p-12">
        <Title>Sobre Nosotros</Title>
        <Text className="mt-4 max-w-3xl">
          En Orchird combinamos tecnica, experiencia y educacion para ayudarte a cuidar tu cabello rizado con confianza.
          Nuestro enfoque es realista, personalizado y enfocado en resultados sostenibles.
        </Text>
      </div>
    </section>
  )
}

export default AboutSection
