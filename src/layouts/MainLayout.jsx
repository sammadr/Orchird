import { Outlet } from 'react-router-dom'
import Navbar from '../components/organisms/Navbar'
import Footer from '../components/organisms/Footer'

function MainLayout() {
  return (
    <>
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  )
}

export default MainLayout
