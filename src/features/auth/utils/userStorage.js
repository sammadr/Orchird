import { usersSeed } from '../data/usersSeed'

const USERS_KEY = 'orchirdUsers'

export const ensureUsersSeeded = () => {
  const currentUsers = JSON.parse(localStorage.getItem(USERS_KEY) ?? 'null')
  if (Array.isArray(currentUsers) && currentUsers.length > 0) return currentUsers

  localStorage.setItem(USERS_KEY, JSON.stringify(usersSeed))
  return usersSeed
}

export const getUsers = () => {
  const parsed = JSON.parse(localStorage.getItem(USERS_KEY) ?? '[]')
  return Array.isArray(parsed) ? parsed : []
}

export const saveUsers = (users) => {
  localStorage.setItem(USERS_KEY, JSON.stringify(users))
}

export const findUserByEmail = (email) =>
  getUsers().find((user) => user.email.toLowerCase() === String(email).trim().toLowerCase())
