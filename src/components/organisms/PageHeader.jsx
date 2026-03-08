import Title from '../atoms/Title'
import Text from '../atoms/Text'

function PageHeader({ title, description }) {
  return (
    <section className="section-pad">
      <div className="container-x">
        <Title as="h1">{title}</Title>
        <Text className="mt-3 max-w-2xl">{description}</Text>
      </div>
    </section>
  )
}

export default PageHeader
