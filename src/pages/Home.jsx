import HomeBannerCarousel from '../components/organisms/HomeBannerCarousel'
import FeaturedWorkSection from '../components/organisms/FeaturedWorkSection'
import TestimonialsSection from '../components/organisms/TestimonialsSection'
import FeaturedBlogSection from '../components/organisms/FeaturedBlogSection'

function Home() {
  return (
    <>
      <HomeBannerCarousel />
      <FeaturedWorkSection />
      <TestimonialsSection />
      <FeaturedBlogSection />
    </>
  )
}

export default Home
