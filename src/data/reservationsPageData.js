export const sectionTitleClass =
  'text-2xl font-black text-[#4b2274] md:text-3xl bg-linear-to-r from-[#4b2274] to-[#8a53bc] bg-clip-text text-transparent'

export const categoryStyles = {
  Cortes: {
    tag: 'Cortes',
    chip: 'bg-[#e6f8ed] text-[#1f8e41] border-[#8ed2a3]',
    surface: 'from-[#f7fef9] to-[#e8f8ef]',
  },
  Tratamientos: {
    tag: 'Tratamientos',
    chip: 'bg-[#eef4ff] text-[#3358a6] border-[#aac1f6]',
    surface: 'from-[#f8fbff] to-[#edf3ff]',
  },
  Color: {
    tag: 'Color',
    chip: 'bg-[#fef0e9] text-[#b45b2a] border-[#f5c0a5]',
    surface: 'from-[#fff8f3] to-[#feeedf]',
  },
  'Secado y alisado': {
    tag: 'Secado',
    chip: 'bg-[#edf8ff] text-[#2a6f9f] border-[#a8d2ed]',
    surface: 'from-[#f8fcff] to-[#e9f5fd]',
  },
  'Definición': {
    tag: 'Definición',
    chip: 'bg-[#f2ebff] text-[#6f3ca8] border-[#cbb1f1]',
    surface: 'from-[#faf6ff] to-[#f1e8ff]',
  },
  Niños: {
    tag: 'Niños',
    chip: 'bg-[#fff7e9] text-[#9b6724] border-[#efd09e]',
    surface: 'from-[#fffdf7] to-[#fff4df]',
  },
  Protectores: {
    tag: 'Protectores',
    chip: 'bg-[#e9fbf6] text-[#1d8f77] border-[#96dfcf]',
    surface: 'from-[#f6fffc] to-[#e7fbf5]',
  },
  'Peinados y eventos': {
    tag: 'Peinados',
    chip: 'bg-[#fff2fb] text-[#a23f86] border-[#efb5da]',
    surface: 'from-[#fff8fd] to-[#ffeef8]',
  },
  Barbería: {
    tag: 'Barbería',
    chip: 'bg-[#edf2f6] text-[#3b5269] border-[#bfd0de]',
    surface: 'from-[#f8fafc] to-[#edf2f6]',
  },
  Shamponier: {
    tag: 'Shamponier',
    chip: 'bg-[#ebf7ff] text-[#2c79a8] border-[#afd9f2]',
    surface: 'from-[#f6fcff] to-[#e7f5fd]',
  },
  Uñas: {
    tag: 'Uñas',
    chip: 'bg-[#fff0f4] text-[#b13d67] border-[#f2b4c9]',
    surface: 'from-[#fff7fa] to-[#ffeef3]',
  },
  Bienestar: {
    tag: 'Bienestar',
    chip: 'bg-[#f2faec] text-[#5b8f2f] border-[#c4e4a4]',
    surface: 'from-[#f9fff5] to-[#eef9e5]',
  },
  Belleza: {
    tag: 'Belleza',
    chip: 'bg-[#f2efff] text-[#6642a6] border-[#c2b4ee]',
    surface: 'from-[#faf8ff] to-[#efebff]',
  },
  'Transición': {
    tag: 'Transición',
    chip: 'bg-[#f3f5ff] text-[#4a60ab] border-[#b6c2f1]',
    surface: 'from-[#fafbff] to-[#edf1ff]',
  },
}

export const reservationsPageContent = {
  hero: {
    eyebrow: 'Agenda premium',
    title: 'Reserva tu cita',
    description: 'Elige servicio, especialista y disponibilidad en un solo flujo claro.',
  },
  sections: {
    choose: '1) Elige servicios',
    added: '2) Servicios agregados',
    summary: '3) Resumen de reserva',
    chooseHelp: 'Puedes agregar múltiples servicios con diferentes especialistas.',
    addedHelp: 'Configura especialista, fecha y hora para cada servicio.',
    summaryHelp: 'Revisa tu selección antes de enviar.',
  },
}

export const formatMoney = (value) => `RD$ ${Number(value).toLocaleString('en-US')}`

const getDaySlots = (dayIndex) => {
  if (dayIndex === 0) return ['8:00 a. m.', '9:00 a. m.', '11:00 a. m.', '1:00 p. m.', '2:00 p. m.']
  if (dayIndex === 6) return ['8:00 a. m.', '9:00 a. m.', '10:00 a. m.', '12:00 p. m.', '2:00 p. m.', '4:00 p. m.']
  return ['9:00 a. m.', '10:00 a. m.', '11:00 a. m.', '12:00 p. m.', '2:00 p. m.', '3:00 p. m.', '4:00 p. m.', '5:00 p. m.']
}

export const getUpcomingDays = (daysNeeded = 5) => {
  const days = []
  let offset = 0

  while (days.length < daysNeeded && offset < 21) {
    const date = new Date()
    date.setDate(date.getDate() + offset)
    const weekDay = date.getDay()

    if (weekDay !== 3) {
      days.push({
        id: date.toISOString().slice(0, 10),
        date,
        weekDay,
        dayLabel: new Intl.DateTimeFormat('es-DO', { weekday: 'long' }).format(date),
        dateLabel: new Intl.DateTimeFormat('es-DO', { day: '2-digit', month: 'short' }).format(date),
      })
    }

    offset += 1
  }

  return days
}

export const getAvailableSlots = (serviceId, staffId, dayData) => {
  if (!serviceId || !staffId || !dayData) return []

  const baseSlots = getDaySlots(dayData.weekDay)
  const seed = `${serviceId}-${staffId}-${dayData.id}`
    .split('')
    .reduce((acc, char) => acc + char.charCodeAt(0), 0)

  return baseSlots.filter((_, index) => (seed + index * 7) % 3 !== 0).slice(0, 6)
}

export const groupByCategory = (services) =>
  services.reduce((acc, service) => {
    if (!acc[service.category]) acc[service.category] = []
    acc[service.category].push(service)
    return acc
  }, {})
