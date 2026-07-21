'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

export type User = {
  id: string
  name: string
  email: string
}

export type OrderItem = {
  name: string
  slug: string
  image: string
  color: string
  quantity: number
  price: number
}

export type OrderStatus =
  | 'Confirmado'
  | 'Preparando'
  | 'Enviado'
  | 'Entregado'

export type Order = {
  id: string
  userId: string
  createdAt: number
  items: OrderItem[]
  total: number
  status: OrderStatus
  address: string
  city: string
}

type StoredUser = User & { password: string }

type AuthContextValue = {
  user: User | null
  ready: boolean
  orders: Order[]
  login: (email: string, password: string) => { ok: boolean; error?: string }
  register: (
    name: string,
    email: string,
    password: string,
  ) => { ok: boolean; error?: string }
  logout: () => void
  createOrder: (data: Omit<Order, 'id' | 'userId' | 'createdAt' | 'status'>) => Order | null
}

const USERS_KEY = 'lumen_users'
const SESSION_KEY = 'lumen_session'
const ORDERS_KEY = 'lumen_orders'

const AuthContext = createContext<AuthContextValue | null>(null)

function readJSON<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback
  try {
    const raw = window.localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

function writeJSON(key: string, value: unknown) {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(key, JSON.stringify(value))
}

/** Mock tracking timeline steps derived from order age. */
export const trackingSteps: OrderStatus[] = [
  'Confirmado',
  'Preparando',
  'Enviado',
  'Entregado',
]

export function statusFromAge(createdAt: number): OrderStatus {
  const hours = (Date.now() - createdAt) / 3_600_000
  if (hours < 1) return 'Confirmado'
  if (hours < 24) return 'Preparando'
  if (hours < 72) return 'Enviado'
  return 'Entregado'
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [orders, setOrders] = useState<Order[]>([])
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const users = readJSON<StoredUser[]>(USERS_KEY, [])
    const sessionId = readJSON<string | null>(SESSION_KEY, null)
    if (sessionId) {
      const found = users.find((u) => u.id === sessionId)
      if (found) {
        const { password: _pw, ...safe } = found
        setUser(safe)
      }
    }
    setOrders(readJSON<Order[]>(ORDERS_KEY, []))
    setReady(true)
  }, [])

  const login = useCallback((email: string, password: string) => {
    const users = readJSON<StoredUser[]>(USERS_KEY, [])
    const found = users.find(
      (u) => u.email.toLowerCase() === email.trim().toLowerCase(),
    )
    if (!found) return { ok: false, error: 'No existe una cuenta con ese correo.' }
    if (found.password !== password)
      return { ok: false, error: 'Contraseña incorrecta.' }
    const { password: _pw, ...safe } = found
    setUser(safe)
    writeJSON(SESSION_KEY, found.id)
    return { ok: true }
  }, [])

  const register = useCallback(
    (name: string, email: string, password: string) => {
      const users = readJSON<StoredUser[]>(USERS_KEY, [])
      if (
        users.some(
          (u) => u.email.toLowerCase() === email.trim().toLowerCase(),
        )
      ) {
        return { ok: false, error: 'Ya existe una cuenta con ese correo.' }
      }
      const newUser: StoredUser = {
        id: crypto.randomUUID(),
        name: name.trim(),
        email: email.trim(),
        password,
      }
      const next = [...users, newUser]
      writeJSON(USERS_KEY, next)
      writeJSON(SESSION_KEY, newUser.id)
      const { password: _pw, ...safe } = newUser
      setUser(safe)
      return { ok: true }
    },
    [],
  )

  const logout = useCallback(() => {
    setUser(null)
    writeJSON(SESSION_KEY, null)
  }, [])

  const createOrder = useCallback<AuthContextValue['createOrder']>(
    (data) => {
      if (!user) return null
      const order: Order = {
        ...data,
        id: 'LUM-' + Math.random().toString(36).slice(2, 8).toUpperCase(),
        userId: user.id,
        createdAt: Date.now(),
        status: 'Confirmado',
      }
      setOrders((prev) => {
        const next = [order, ...prev]
        writeJSON(ORDERS_KEY, next)
        return next
      })
      return order
    },
    [user],
  )

  const value = useMemo<AuthContextValue>(() => {
    const userOrders = user
      ? orders
          .filter((o) => o.userId === user.id)
          .map((o) => ({ ...o, status: statusFromAge(o.createdAt) }))
          .sort((a, b) => b.createdAt - a.createdAt)
      : []
    return {
      user,
      ready,
      orders: userOrders,
      login,
      register,
      logout,
      createOrder,
    }
  }, [user, orders, ready, login, register, logout, createOrder])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth debe usarse dentro de AuthProvider')
  return ctx
}
