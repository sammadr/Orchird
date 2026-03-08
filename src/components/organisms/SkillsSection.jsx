import Title from '../atoms/Title'
import SkillItem from '../molecules/SkillItem'
import { skills } from '../../data/skills'

function SkillsSection() {
  return (
    <section className="section-pad">
      <div className="container-x">
        <Title>Servicios Destacados</Title>
        <ul className="mt-7 grid gap-3 sm:grid-cols-2 md:grid-cols-3">
          {skills.map((skill) => (
            <SkillItem key={skill} skill={skill} />
          ))}
        </ul>
      </div>
    </section>
  )
}

export default SkillsSection
