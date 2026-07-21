'use client'

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  type ReactNode,
} from 'react'
import type { Product } from '@/lib/products'

const CART_KEY = 'lumen_cart'

export type CartItem = {
  product: Product
  quantity: number
  color: string
}

type CartState = {
  items: CartItem[]
}

type CartAction =
  | { type: 'ADD'; product: Product; color: string; quantity: number }
  | { type: 'REMOVE'; id: string; color: string }
  | { type: 'UPDATE_QTY'; id: string; color: string; quantity: number }
  | { type: 'CLEAR' }

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD': {
      const existing = state.items.find(
        (i) => i.product.id === action.product.id && i.color === action.color,
      )
      if (existing) {
        return {
          items: state.items.map((i) =>
            i.product.id === action.product.id && i.color === action.color
              ? { ...i, quantity: i.quantity + action.quantity }
              : i,
          ),
        }
      }
      return {
        items: [
          ...state.items,
          {
            product: action.product,
            color: action.color,
            quantity: action.quantity,
          },
        ],
      }
    }
    case 'REMOVE':
      return {
        items: state.items.filter(
          (i) => !(i.product.id === action.id && i.color === action.color),
        ),
      }
    case 'UPDATE_QTY':
      return {
        items: state.items.map((i) =>
          i.product.id === action.id && i.color === action.color
            ? { ...i, quantity: Math.max(1, action.quantity) }
            : i,
        ),
      }
    case 'CLEAR':
      return { items: [] }
    default:
      return state
  }
}

type CartContextValue = {
  items: CartItem[]
  addItem: (product: Product, color: string, quantity?: number) => void
  removeItem: (id: string, color: string) => void
  updateQuantity: (id: string, color: string, quantity: number) => void
  clear: () => void
  count: number
  subtotal: number
}

const CartContext = createContext<CartContextValue | null>(null)

function init(): CartState {
  if (typeof window === 'undefined') return { items: [] }
  try {
    const raw = window.localStorage.getItem(CART_KEY)
    return raw ? (JSON.parse(raw) as CartState) : { items: [] }
  } catch {
    return { items: [] }
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [] }, init)

  useEffect(() => {
    try {
      window.localStorage.setItem(CART_KEY, JSON.stringify(state))
    } catch {
      // ignore write errors
    }
  }, [state])

  const value = useMemo<CartContextValue>(() => {
    const count = state.items.reduce((acc, i) => acc + i.quantity, 0)
    const subtotal = state.items.reduce(
      (acc, i) => acc + i.product.price * i.quantity,
      0,
    )
    return {
      items: state.items,
      addItem: (product, color, quantity = 1) =>
        dispatch({ type: 'ADD', product, color, quantity }),
      removeItem: (id, color) => dispatch({ type: 'REMOVE', id, color }),
      updateQuantity: (id, color, quantity) =>
        dispatch({ type: 'UPDATE_QTY', id, color, quantity }),
      clear: () => dispatch({ type: 'CLEAR' }),
      count,
      subtotal,
    }
  }, [state.items])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart debe usarse dentro de CartProvider')
  return ctx
}
