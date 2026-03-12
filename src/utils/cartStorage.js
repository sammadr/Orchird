const getCurrentUserEmail = () => localStorage.getItem('orchirdUserEmail') ?? ''

export const getCartStorageKey = () => {
  const email = getCurrentUserEmail().trim().toLowerCase()
  return email ? `orchirdCart:${email}` : 'orchirdCart:guest'
}

export const getCurrentUserCart = () => {
  const cartKey = getCartStorageKey()
  const parsed = JSON.parse(localStorage.getItem(cartKey) ?? '[]')
  return Array.isArray(parsed) ? parsed : []
}

export const saveCurrentUserCart = (cartItems) => {
  localStorage.setItem(getCartStorageKey(), JSON.stringify(cartItems))
}

export const getCurrentUserCartCount = () =>
  getCurrentUserCart().reduce((total, item) => total + Number(item.quantity ?? 0), 0)
