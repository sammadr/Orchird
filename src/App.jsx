import { Navigate, Route, Routes } from 'react-router-dom'
import MainLayout from './layouts/MainLayout'
import Home from './pages/Home'
import Services from './pages/Services'
import About from './pages/About'
import Blog from './pages/Blog'
import BlogDetail from './pages/BlogDetail'
import Work from './pages/Work'
import Store from './pages/Store'
import Reservations from './pages/Reservations'
import Contact from './pages/Contact'
import Login from './pages/Login'
import Billing from './pages/Billing'
import NotFound from './pages/NotFound'

function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/inicio" element={<Navigate to="/" replace />} />
        <Route path="/servicios" element={<Services />} />
        <Route path="/sobre-nosotros" element={<About />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:id" element={<BlogDetail />} />
        <Route path="/nuestro-trabajo" element={<Work />} />
        <Route path="/tienda" element={<Store />} />
        <Route path="/reservas" element={<Reservations />} />
        <Route path="/contacto" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/facturacion" element={<Billing />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default App
