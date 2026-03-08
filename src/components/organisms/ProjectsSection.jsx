import Title from '../atoms/Title'
import ProjectCard from '../molecules/ProjectCard'
import { projects } from '../../data/projects'

function ProjectsSection() {
  return (
    <section className="section-pad" id="nuestro-trabajo">
      <div className="container-x">
        <Title>Nuestro Trabajo</Title>
        <div className="mt-7 grid gap-4 md:grid-cols-3">
          {projects.map((item) => (
            <ProjectCard key={item.id} item={item} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default ProjectsSection
