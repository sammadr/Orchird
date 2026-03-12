export const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const weekdayLabels = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']

const windowsByDay = {
  0: { open: 8 * 60, close: 15 * 60 },
  1: { open: 9 * 60, close: 19 * 60 },
  2: { open: 9 * 60, close: 19 * 60 },
  3: null,
  4: { open: 9 * 60, close: 19 * 60 },
  5: { open: 9 * 60, close: 19 * 60 },
  6: { open: 8 * 60, close: 18 * 60 },
}

const getSalonNow = () => new Date(new Date().toLocaleString('en-US', { timeZone: 'America/Santo_Domingo' }))

export const getTodayLabel = () => {
  const salonNow = getSalonNow()
  return weekdayLabels[salonNow.getDay()]
}

export const getSalonStatus = () => {
  const salonNow = getSalonNow()
  const day = salonNow.getDay()
  const currentMinutes = salonNow.getHours() * 60 + salonNow.getMinutes()
  const todayWindow = windowsByDay[day]

  if (!todayWindow) {
    return {
      label: 'Cerrado ahora',
      detail: 'Abrimos mañana en horario regular.',
      badgeClass: 'bg-red-100 text-red-700 border-red-200',
    }
  }

  if (currentMinutes < todayWindow.open) {
    return {
      label: 'Cerrado ahora',
      detail: 'Falta poco para abrir.',
      badgeClass: 'bg-[#f0ebfa] text-[#5d2e8f] border-(--orchird-lilac)/60',
    }
  }

  if (currentMinutes >= todayWindow.close) {
    return {
      label: 'Cerrado ahora',
      detail: 'El salón ya cerró por hoy.',
      badgeClass: 'bg-red-100 text-red-700 border-red-200',
    }
  }

  const minutesToClose = todayWindow.close - currentMinutes
  if (minutesToClose <= 90) {
    return {
      label: '¡Cierra pronto!',
      detail: `Quedan ${minutesToClose} min para el cierre.`,
      badgeClass: 'bg-amber-100 text-amber-700 border-amber-200',
    }
  }

  return {
    label: 'Abierto ahora',
    detail: 'Atendiendo con normalidad en este momento.',
    badgeClass: 'bg-(--orchird-green)/12 text-(--orchird-green-dark) border-(--orchird-green)/35',
  }
}

export const contactPageContent = {
  hero: {
    title: 'Contáctanos',
    description: '¿Tienes dudas, quieres reservar o necesitas soporte? Escríbenos y te respondemos rápidamente.',
  },
  cards: {
    addressTitle: 'Dirección',
    mapsCta: 'Ver en Google Maps',
    emailTitle: 'Correo',
    emailCta: 'Enviar correo',
    whatsappTitle: 'WhatsApp',
    whatsappCta: 'Escribir ahora',
    hoursTitle: 'Horario laboral',
  },
  form: {
    title: 'Envíanos un mensaje',
    description: 'Cuéntanos qué necesitas y te responderemos lo antes posible.',
    placeholders: {
      name: 'Nombre completo',
      email: 'Correo electrónico',
      subject: 'Asunto',
      message: 'Escribe tu mensaje...',
    },
    submitLabel: 'Enviar mensaje',
    success: '¡Mensaje enviado! Te responderemos pronto.',
    quickReplyTitle: 'Respuesta rápida',
    quickReplyDescription: 'Normalmente respondemos en menos de 24 horas.',
  },
  validations: {
    name: 'Escribe un nombre válido (mínimo 3 caracteres).',
    email: 'Ingresa un correo electrónico válido.',
    subject: 'El asunto debe tener al menos 3 caracteres.',
    message: 'El mensaje debe tener al menos 12 caracteres.',
  },
}
