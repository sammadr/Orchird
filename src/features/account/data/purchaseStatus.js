export const purchaseStatusConfig = {
  pending: {
    label: 'Pendiente',
    badgeClass: 'border-amber-300 bg-amber-50 text-amber-700',
  },
  approved: {
    label: 'Aprobado',
    badgeClass: 'border-(--orchird-green)/45 bg-(--orchird-green)/12 text-(--orchird-green-dark)',
  },
  failed: {
    label: 'Fallido',
    badgeClass: 'border-red-300 bg-red-50 text-red-700',
  },
}

export const purchaseFilters = [
  { id: 'all', label: 'Todas' },
  { id: 'pending', label: 'Pendientes' },
  { id: 'approved', label: 'Aprobadas' },
  { id: 'failed', label: 'Fallidas' },
]

export const normalizePurchaseStatus = (value) => {
  const status = String(value ?? '').toLowerCase().trim()
  if (status === 'approved') return 'approved'
  if (status === 'failed') return 'failed'
  return 'pending'
}
