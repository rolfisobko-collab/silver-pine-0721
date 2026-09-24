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
import {
  firebaseGoogleLogin,
  firebaseLogin,
  firebaseLogout,
  firebaseRegister,
  firebaseResetPassword,
  hasFirebaseConfig,
  listenFirebaseAuth,
} from '@/lib/firebase-client'

export type User = {
  id: string
  name: string
  email: string
  photoURL?: string
  points?: number
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
  | 'Cancelado'

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
  login: (email: string, password: string) => Promise<{ ok: boolean; error?: string }>
  loginWithGoogle: () => Promise<{ ok: boolean; error?: string; redirecting?: boolean }>
  register: (
    name: string,
    email: string,
    password: string,
  ) => Promise<{ ok: boolean; error?: string }>
  resetPassword: (email: string) => Promise<{ ok: boolean; error?: string }>
  logout: () => Promise<void>
  createOrder: (data: Omit<Order, 'id' | 'userId' | 'createdAt' | 'status'>) => Order | null
}

const USERS_KEY = 'alta_users'
const SESSION_KEY = 'alta_session'
const ORDERS_KEY = 'alta_orders'

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

function mapRemoteStatus(status: string): OrderStatus {
  if (status === 'cancelled') return 'Cancelado'
  if (status === 'delivered') return 'Entregado'
  if (status === 'ready' || status === 'shipped') return 'Enviado'
  if (status === 'preparing') return 'Preparando'
  return 'Confirmado'
}

export function statusFromAge(createdAt: number): OrderStatus {
  const hours = (Date.now() - createdAt) / 3_600_000
  if (hours < 1) return 'Confirmado'
  if (hours < 24) return 'Preparando'
  if (hours < 72) return 'Enviado'
  return 'Entregado'
}

function friendlyAuthError(error: unknown, fallback: string) {
  const message = error instanceof Error ? error.message : String(error || '')
  if (/unauthorized-domain|auth\/unauthorized-domain/i.test(message)) {
    return 'Este dominio todavia no esta habilitado para iniciar sesion con Google.'
  }
  if (/popup-closed|auth\/popup-closed-by-user/i.test(message)) {
    return 'Se cerro la ventana de Google antes de terminar.'
  }
  if (/wrong-password|invalid-credential|invalid-login-credentials|auth\/invalid/i.test(message)) {
    return 'Correo o contrasena incorrectos.'
  }
  if (/email-already-in-use/i.test(message)) {
    return 'Ya existe una cuenta con ese correo.'
  }
  return fallback
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [orders, setOrders] = useState<Order[]>([])
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (hasFirebaseConfig()) {
      const unsubscribe = listenFirebaseAuth(async (firebaseUser) => {
        if (firebaseUser) {
          const profile = await fetchCustomerProfile(firebaseUser)
          setUser(profile)
        } else {
          setUser(null)
        }
        setOrders(readJSON<Order[]>(ORDERS_KEY, []))
        setReady(true)
      })
      return unsubscribe
    }

    const users = readJSON<StoredUser[]>(USERS_KEY, [])
    const sessionId = readJSON<string | null>(SESSION_KEY, null)
    if (sessionId) {
      const found = users.find((u) => u.id === sessionId)
      if (found) {
        const { password: _pw, ...safe } = found
        setUser({ ...safe, points: safe.points ?? 0 })
      }
    }
    setOrders(readJSON<Order[]>(ORDERS_KEY, []))
    setReady(true)
  }, [])

  useEffect(() => {
    if (!ready || !user?.email) return
    let cancelled = false
    fetch(`/api/customer-orders?email=${encodeURIComponent(user.email)}`, { cache: 'no-store' })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (cancelled || !Array.isArray(data?.orders)) return
        const remoteOrders: Order[] = data.orders.map((order: any) => ({
          id: String(order.id || order.number || ''),
          userId: user.id,
          createdAt: new Date(order.createdAt || Date.now()).getTime(),
          status: mapRemoteStatus(String(order.status || 'pending')),
          address: String(order.shippingAddress || ''),
          city: String(order.deliveryType || 'Alta Telefonia'),
          total: Number(order.totalARS || order.totalUSD || 0),
          items: Array.isArray(order.items)
            ? order.items.map((item: any) => ({
                name: String(item.name || 'Producto'),
                slug: String(item.productId || ''),
                image: String(item.image || '/placeholder.svg'),
                color: 'Unico',
                quantity: Number(item.quantity || 1),
                price: Number(item.price || 0),
              }))
            : [],
        })).filter((order: Order) => order.id)
        if (remoteOrders.length) {
          setOrders(remoteOrders)
        }
      })
      .catch(() => undefined)
    return () => {
      cancelled = true
    }
  }, [ready, user])

  const login = useCallback(async (email: string, password: string) => {
    if (hasFirebaseConfig()) {
      try {
        const firebaseUser = await firebaseLogin(email, password)
        setUser(await fetchCustomerProfile(firebaseUser))
        return { ok: true }
      } catch (err) {
        return { ok: false, error: friendlyAuthError(err, 'No pudimos iniciar sesion con ese correo.') }
      }
    }

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

  const loginWithGoogle = useCallback(async () => {
    try {
      if (!hasFirebaseConfig()) {
        return {
          ok: false,
          error:
            'El ingreso con Google todavia no esta habilitado en este dominio.',
        }
      }
      const firebaseUser = await firebaseGoogleLogin()
      if (!firebaseUser) return { ok: true, redirecting: true }
      setUser(await fetchCustomerProfile(firebaseUser))
      return { ok: true }
    } catch (err) {
      return {
        ok: false,
        error: friendlyAuthError(err, 'No pudimos iniciar sesion con Google.'),
      }
    }
  }, [])

  const register = useCallback(
    async (name: string, email: string, password: string) => {
      if (hasFirebaseConfig()) {
        try {
          const firebaseUser = await firebaseRegister(name, email, password)
          setUser(await fetchCustomerProfile(firebaseUser))
          return { ok: true }
        } catch (err) {
          return { ok: false, error: friendlyAuthError(err, 'No pudimos crear la cuenta.') }
        }
      }

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
        points: 0,
      }
      const next = [...users, newUser]
      writeJSON(USERS_KEY, next)
      writeJSON(SESSION_KEY, newUser.id)
      const { password: _pw, ...safe } = newUser
      setUser({ ...safe, points: 0 })
      return { ok: true }
    },
    [],
  )

  const resetPassword = useCallback(async (email: string) => {
    if (!email.trim()) return { ok: false, error: 'Ingresa tu correo para recuperar la cuenta.' }
    if (!hasFirebaseConfig()) {
      return { ok: false, error: 'La recuperacion por correo todavia no esta configurada.' }
    }
    try {
      await firebaseResetPassword(email.trim())
      return { ok: true }
    } catch {
      return { ok: false, error: 'No pudimos enviar el correo de recuperacion.' }
    }
  }, [])

  const logout = useCallback(async () => {
    await firebaseLogout()
    setUser(null)
    writeJSON(SESSION_KEY, null)
  }, [])

  const createOrder = useCallback<AuthContextValue['createOrder']>(
    (data) => {
      if (!user) return null
      const order: Order = {
        ...data,
        id: 'ALT-' + Math.random().toString(36).slice(2, 8).toUpperCase(),
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
          .map((o) => ({ ...o, status: o.status || statusFromAge(o.createdAt) }))
          .sort((a, b) => b.createdAt - a.createdAt)
      : []
    return {
      user,
      ready,
      orders: userOrders,
      login,
      loginWithGoogle,
      register,
      resetPassword,
      logout,
      createOrder,
    }
  }, [user, orders, ready, login, loginWithGoogle, register, resetPassword, logout, createOrder])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

async function fetchCustomerProfile(user: User): Promise<User> {
  try {
    const res = await fetch(`/api/customer-profile?email=${encodeURIComponent(user.email)}&uid=${encodeURIComponent(user.id)}`)
    if (!res.ok) return user
    const data = await res.json()
    return {
      ...user,
      name: data.profile?.name || user.name,
      points: Number(data.profile?.points ?? data.profile?.puntos ?? user.points ?? 0),
    }
  } catch {
    return user
  }
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth debe usarse dentro de AuthProvider')
  return ctx
}
