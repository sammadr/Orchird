export const reservationStatusConfig = {
  pending: {
    label: 'Pendiente de revisión',
    badgeClass: 'border-amber-300 bg-amber-50 text-amber-700',
  },
  approved: {
    label: 'Aprobada',
    badgeClass: 'border-(--orchird-green)/45 bg-(--orchird-green)/12 text-(--orchird-green-dark)',
  },
  reviewed: {
    label: 'Revisada',
    badgeClass: 'border-(--orchird-green)/45 bg-(--orchird-green)/12 text-(--orchird-green-dark)',
  },
  confirmed: {
    label: 'Confirmada',
    badgeClass: 'border-(--orchird-green)/45 bg-(--orchird-green)/12 text-(--orchird-green-dark)',
  },
  cancelled: {
    label: 'Cancelada',
    badgeClass: 'border-red-300 bg-red-50 text-red-700',
  },
  completed: {
    label: 'Completada',
    badgeClass: 'border-[#91d7a6] bg-[#ecfbf0] text-[#267a42]',
  },
}

export const reservationFilters = [
  { id: 'all', label: 'Todas' },
  { id: 'pending', label: 'Pendientes' },
  { id: 'approved', label: 'Aprobadas' },
  { id: 'cancelled', label: 'Canceladas' },
  { id: 'completed', label: 'Completadas' },
]

export const normalizeReservationStatus = (value) => {
  const raw = String(value ?? '').toLowerCase().trim()
  if (['approved', 'reviewed', 'confirmed'].includes(raw)) return 'approved'
  if (raw === 'completed') return 'completed'
  if (raw === 'cancelled' || raw === 'canceled') return 'cancelled'
  return 'pending'
}
