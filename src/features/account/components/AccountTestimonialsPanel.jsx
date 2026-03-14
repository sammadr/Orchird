import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  FaEdit,
  FaExclamationTriangle,
  FaStar,
  FaTimes,
  FaTrashAlt,
} from 'react-icons/fa'

const MotionDiv = motion.div
const USER_TESTIMONIALS_KEY = 'orchirdUserTestimonials'
const MAX_COMMENT_LENGTH = 420

const readTestimonials = () => {
  const raw = JSON.parse(localStorage.getItem(USER_TESTIMONIALS_KEY) ?? '[]')
  return Array.isArray(raw) ? raw : []
}

const saveTestimonials = (list) => {
  localStorage.setItem(USER_TESTIMONIALS_KEY, JSON.stringify(list))
  window.dispatchEvent(new Event('orchird-testimonials-updated'))
}

const formatDate = (value) => {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return 'Sin fecha'
  return new Intl.DateTimeFormat('es-DO', { dateStyle: 'medium' }).format(date)
}

function AccountTestimonialsPanel() {
  const userEmail = localStorage.getItem('orchirdUserEmail') ?? ''
  const userName = localStorage.getItem('orchirdUserName') ?? 'Cliente'

  const [service, setService] = useState('')
  const [comment, setComment] = useState('')
  const [rating, setRating] = useState(5)
  const [hoverRating, setHoverRating] = useState(0)
  const [editId, setEditId] = useState(null)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [myTestimonials, setMyTestimonials] = useState([])
  const [deleteId, setDeleteId] = useState(null)

  useEffect(() => {
    const syncTestimonials = () => {
      const all = readTestimonials()
      const mine = all
        .filter((item) => String(item.userEmail ?? '').toLowerCase() === userEmail.toLowerCase())
        .sort((a, b) => new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime())

      setMyTestimonials(mine)
    }

    syncTestimonials()
    window.addEventListener('storage', syncTestimonials)
    window.addEventListener('orchird-testimonials-updated', syncTestimonials)

    return () => {
      window.removeEventListener('storage', syncTestimonials)
      window.removeEventListener('orchird-testimonials-updated', syncTestimonials)
    }
  }, [userEmail])

  useEffect(() => {
    if (!success && !error) return undefined
    const timerId = setTimeout(() => {
      setSuccess('')
      setError('')
    }, 3200)

    return () => clearTimeout(timerId)
  }, [success, error])

  useEffect(() => {
    if (!deleteId) return undefined

    const onEsc = (event) => {
      if (event.key === 'Escape') setDeleteId(null)
    }

    window.addEventListener('keydown', onEsc)
    return () => window.removeEventListener('keydown', onEsc)
  }, [deleteId])

  const clearForm = () => {
    setService('')
    setComment('')
    setRating(5)
    setHoverRating(0)
    setEditId(null)
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    setError('')
    setSuccess('')

    if (!service.trim() || !comment.trim()) {
      setError('Completa el servicio y tu comentario.')
      return
    }

    if (comment.trim().length < 20) {
      setError('El comentario debe tener al menos 20 caracteres.')
      return
    }

    const all = readTestimonials()

    if (editId) {
      const next = all.map((item) =>
        item.id === editId
          ? {
              ...item,
              service: service.trim(),
              text: comment.trim(),
              rating,
              updatedAt: new Date().toISOString(),
            }
          : item,
      )
      saveTestimonials(next)
      setSuccess('Testimonio actualizado correctamente.')
    } else {
      const next = [
        ...all,
        {
          id: `t-${Date.now()}`,
          userEmail,
          name: userName,
          role: 'Cliente verificada',
          service: service.trim(),
          rating,
          text: comment.trim(),
          createdAt: new Date().toISOString(),
        },
      ]
      saveTestimonials(next)
      setSuccess('Testimonio publicado correctamente.')
    }

    clearForm()
  }

  const handleEdit = (item) => {
    setService(item.service ?? '')
    setComment(item.text ?? '')
    setRating(Number(item.rating ?? 5))
    setHoverRating(0)
    setEditId(item.id)
    setError('')
    setSuccess('Editando testimonio seleccionado.')
  }

  const handleConfirmDelete = () => {
    if (!deleteId) return

    const all = readTestimonials()
    const next = all.filter((item) => item.id !== deleteId)
    saveTestimonials(next)

    setDeleteId(null)
    setSuccess('Testimonio eliminado.')

    if (editId === deleteId) clearForm()
  }

  const displayRating = hoverRating > 0 ? hoverRating : rating

  return (
    <div className="space-y-6 md:space-y-7">
      <AnimatePresence>
        {deleteId ? (
          <>
            <MotionDiv
              className="fixed inset-0 z-[90] bg-[#150b22]/45 backdrop-blur-[2px]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDeleteId(null)}
            />
            <MotionDiv
              className="fixed inset-0 z-[91] grid place-items-center p-4"
              initial={{ opacity: 0, scale: 0.95, y: 14 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 12 }}
              transition={{ duration: 0.2 }}
            >
              <div className="w-full max-w-md rounded-3xl border border-red-300 bg-white p-5 shadow-[0_24px_48px_rgba(125,25,25,0.28)] md:p-6">
                <div className="flex items-start justify-between gap-3">
                  <div className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-red-100 text-red-700">
                    <FaExclamationTriangle />
                  </div>
                  <button
                    type="button"
                    onClick={() => setDeleteId(null)}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-red-200 text-red-600 transition hover:bg-red-50"
                    aria-label="Cerrar modal"
                  >
                    <FaTimes className="text-xs" />
                  </button>
                </div>

                <h3 className="mt-4 text-2xl font-black text-[#6f1f31]">¿Eliminar testimonio?</h3>
                <p className="mt-2 text-sm leading-7 text-(--orchird-black)/75">
                  Esta acción eliminará tu testimonio de forma permanente.
                </p>

                <div className="mt-5 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => setDeleteId(null)}
                    className="inline-flex h-11 flex-1 items-center justify-center rounded-xl border border-red-200 bg-white px-4 text-xs font-black uppercase tracking-[0.12em] text-[#9f3b53] transition hover:bg-red-50"
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    onClick={handleConfirmDelete}
                    className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-linear-to-r from-red-500 to-[#c63054] px-4 text-xs font-black uppercase tracking-[0.12em] text-white shadow-[0_14px_28px_rgba(198,48,84,0.34)] transition hover:-translate-y-0.5 hover:brightness-105"
                  >
                    <FaTrashAlt className="text-[11px]" />
                    Sí, eliminar
                  </button>
                </div>
              </div>
            </MotionDiv>
          </>
        ) : null}
      </AnimatePresence>

      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-(--orchird-lilac)/45 bg-[#fcf9ff] p-4 md:p-5">
        <div className="flex items-center gap-3">
          <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-linear-to-br from-(--orchird-lilac) to-(--orchird-lavender) text-white shadow-[0_10px_20px_rgba(143,99,188,0.34)]">
            <FaStar />
          </span>
          <div>
            <p className="text-xs font-black uppercase tracking-[0.14em] text-[#7a49af]">Valoraciones del cliente</p>
            <h2 className="mt-1 text-2xl font-black text-[#45206e] md:text-3xl">Mis testimonios</h2>
          </div>
        </div>
        <span className="rounded-full border border-(--orchird-lilac)/55 bg-[#f8efff] px-3 py-1.5 text-xs font-black uppercase tracking-[0.1em] text-[#6d3ea2]">
          {myTestimonials.length} publicados
        </span>
      </div>

      <form onSubmit={handleSubmit} className="rounded-2xl border border-(--orchird-lilac)/50 bg-white p-4 md:p-5">
        <p className="text-sm font-black uppercase tracking-[0.12em] text-[#6d3ea2]">
          {editId ? 'Editar testimonio' : 'Nuevo testimonio'}
        </p>

        <div className="mt-3 grid gap-3 md:grid-cols-2">
          <label className="space-y-1.5">
            <span className="text-[11px] font-black uppercase tracking-[0.1em] text-[#7a49af]">Servicio</span>
            <input
              type="text"
              value={service}
              onChange={(event) => setService(event.target.value)}
              placeholder="Ej: Rëzocut, color, definición"
              className="h-11 w-full rounded-xl border border-(--orchird-lilac)/55 bg-white px-3 text-sm text-(--orchird-black)/85 outline-none transition focus:border-(--orchird-lavender)"
            />
          </label>

          <div className="space-y-1.5">
            <span className="text-[11px] font-black uppercase tracking-[0.1em] text-[#7a49af]">Calificación</span>
            <div className="flex h-11 items-center gap-2 rounded-xl border border-(--orchird-lilac)/55 bg-white px-3">
              {Array.from({ length: 5 }).map((_, index) => {
                const value = index + 1
                const active = value <= displayRating
                return (
                  <button
                    key={`star-${value}`}
                    type="button"
                    onMouseEnter={() => setHoverRating(value)}
                    onMouseLeave={() => setHoverRating(0)}
                    onFocus={() => setHoverRating(value)}
                    onBlur={() => setHoverRating(0)}
                    onClick={() => setRating(value)}
                    className={`cursor-pointer text-xl transition duration-150 ${active ? 'scale-110 drop-shadow-[0_2px_4px_rgba(245,179,1,0.35)]' : 'hover:scale-105'}`}
                    style={{ color: active ? '#F5B301' : '#D3C2E2' }}
                    aria-label={`Calificar ${value}`}
                  >
                    <FaStar />
                  </button>
                )
              })}
              <span className="ml-2 text-xs font-black uppercase tracking-[0.1em] text-[#7a49af]">
                {displayRating}/5
              </span>
            </div>
          </div>
        </div>

        <label className="mt-3 block space-y-1.5">
          <span className="text-[11px] font-black uppercase tracking-[0.1em] text-[#7a49af]">Comentario</span>
          <textarea
            rows={4}
            value={comment}
            onChange={(event) => setComment(event.target.value.slice(0, MAX_COMMENT_LENGTH))}
            placeholder="Comparte tu experiencia en el salón."
            className="w-full rounded-xl border border-(--orchird-lilac)/55 bg-white px-3 py-2 text-sm text-(--orchird-black)/85 outline-none transition focus:border-(--orchird-lavender)"
          />
          <p className={`text-right text-xs font-semibold ${comment.length > MAX_COMMENT_LENGTH * 0.85 ? 'text-amber-700' : 'text-(--orchird-black)/58'}`}>
            {comment.length}/{MAX_COMMENT_LENGTH}
          </p>
        </label>

        {error ? (
          <p className="mt-3 rounded-xl border border-red-300 bg-red-50 px-3 py-2 text-sm font-semibold text-red-700">{error}</p>
        ) : null}
        {success ? (
          <p className="mt-3 rounded-xl border border-(--orchird-green)/35 bg-(--orchird-green)/12 px-3 py-2 text-sm font-semibold text-(--orchird-green-dark)">{success}</p>
        ) : null}

        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="submit"
            className="inline-flex h-11 items-center justify-center rounded-xl bg-linear-to-r from-(--orchird-lavender) to-[#9c65ca] px-4 text-xs font-black uppercase tracking-[0.12em] text-white transition hover:-translate-y-0.5 hover:brightness-105"
          >
            {editId ? 'Guardar cambios' : 'Publicar testimonio'}
          </button>

          {editId ? (
            <button
              type="button"
              onClick={clearForm}
              className="inline-flex h-11 items-center justify-center rounded-xl border border-(--orchird-lilac)/60 bg-white px-4 text-xs font-black uppercase tracking-[0.12em] text-[#6d3ea2] transition hover:bg-(--orchird-lilac)/20"
            >
              Cancelar edición
            </button>
          ) : null}
        </div>
      </form>

      <div className="space-y-3">
        {myTestimonials.length === 0 ? (
          <div className="rounded-2xl border border-(--orchird-lilac)/55 bg-[#f8f2fc] px-4 py-6 text-sm text-(--orchird-black)/74 md:px-5">
            Aún no has publicado testimonios.
          </div>
        ) : (
          myTestimonials.map((item) => (
            <article key={item.id} className="rounded-2xl border border-(--orchird-lilac)/55 bg-white p-4 shadow-[0_10px_22px_rgba(69,32,110,0.1)] md:p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.12em] text-[#7a49af]">{item.service}</p>
                  <p className="mt-1 text-xs font-semibold text-(--orchird-black)/65">{formatDate(item.createdAt)}</p>
                </div>
              </div>

              <div className="mt-2 flex items-center gap-1" style={{ color: '#F5B301' }}>
                {Array.from({ length: Number(item.rating ?? 5) }).map((_, index) => (
                  <FaStar key={`${item.id}-star-${index}`} className="text-sm" />
                ))}
              </div>

              <p className="mt-3 text-sm leading-7 text-(--orchird-black)/78">{item.text}</p>

              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => handleEdit(item)}
                  className="inline-flex items-center gap-1 rounded-full border border-(--orchird-lilac)/55 bg-[#f8efff] px-3 py-1 text-xs font-black uppercase tracking-[0.1em] text-[#6d3ea2] transition hover:bg-(--orchird-lilac)/30"
                >
                  <FaEdit className="text-[11px]" />
                  Editar
                </button>
                <button
                  type="button"
                  onClick={() => setDeleteId(item.id)}
                  className="inline-flex items-center gap-1 rounded-full border border-red-300 bg-red-50 px-3 py-1 text-xs font-black uppercase tracking-[0.1em] text-red-700 transition hover:bg-red-100"
                >
                  <FaTrashAlt className="text-[11px]" />
                  Eliminar
                </button>
              </div>
            </article>
          ))
        )}
      </div>
    </div>
  )
}

export default AccountTestimonialsPanel
