'use client'

import { initializeApp, getApps } from 'firebase/app'
import {
  browserLocalPersistence,
  createUserWithEmailAndPassword,
  getAuth,
  getRedirectResult,
  GoogleAuthProvider,
  onAuthStateChanged,
  sendPasswordResetEmail,
  setPersistence,
  signInWithEmailAndPassword,
  signInWithPopup,
  signInWithRedirect,
  signOut,
  updateProfile,
  type User as FirebaseUser,
} from 'firebase/auth'

let authReady: Promise<void> | null = null

function envValue(value: string | undefined) {
  const clean = value?.trim().replace(/^"|"$/g, '')
  return clean || undefined
}

export function hasFirebaseConfig() {
  return Boolean(
    envValue(process.env.NEXT_PUBLIC_FIREBASE_API_KEY) &&
      envValue(process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN) &&
      envValue(process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID) &&
      envValue(process.env.NEXT_PUBLIC_FIREBASE_APP_ID),
  )
}

export function getFirebaseAuth() {
  if (!hasFirebaseConfig()) return null
  const app =
    getApps()[0] ??
    initializeApp({
      apiKey: envValue(process.env.NEXT_PUBLIC_FIREBASE_API_KEY),
      authDomain: envValue(process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN),
      projectId: envValue(process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID),
      storageBucket: envValue(process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET),
      messagingSenderId: envValue(process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID),
      appId: envValue(process.env.NEXT_PUBLIC_FIREBASE_APP_ID),
    })
  return getAuth(app)
}

async function ensureAuthReady() {
  const auth = getFirebaseAuth()
  if (!auth) throw new Error('Firebase no configurado')
  authReady ??= setPersistence(auth, browserLocalPersistence).catch(() => undefined)
  await authReady
  return auth
}

export function toAltaUser(firebaseUser: FirebaseUser) {
  return {
    id: firebaseUser.uid,
    name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'Cliente Alta',
    email: firebaseUser.email || '',
    photoURL: firebaseUser.photoURL || '',
    points: 0,
  }
}

export async function firebaseLogin(email: string, password: string) {
  const auth = await ensureAuthReady()
  const result = await signInWithEmailAndPassword(auth, email, password)
  return toAltaUser(result.user)
}

export async function firebaseRegister(name: string, email: string, password: string) {
  const auth = await ensureAuthReady()
  const result = await createUserWithEmailAndPassword(auth, email, password)
  if (name.trim()) await updateProfile(result.user, { displayName: name.trim() })
  return { ...toAltaUser(result.user), name: name.trim() || toAltaUser(result.user).name }
}

export async function firebaseGoogleLogin() {
  const auth = await ensureAuthReady()
  const provider = new GoogleAuthProvider()
  provider.setCustomParameters({ prompt: 'select_account' })
  try {
    const result = await signInWithPopup(auth, provider)
    return toAltaUser(result.user)
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error || '')
    if (/popup-blocked|popup-closed|cancelled-popup-request/i.test(message)) {
      await signInWithRedirect(auth, provider)
      return null
    }
    throw error
  }
}

export async function firebaseResetPassword(email: string) {
  const auth = await ensureAuthReady()
  await sendPasswordResetEmail(auth, email)
}

export async function firebaseLogout() {
  const auth = getFirebaseAuth()
  if (auth) await signOut(auth)
}

export function listenFirebaseAuth(callback: (user: ReturnType<typeof toAltaUser> | null) => void) {
  const auth = getFirebaseAuth()
  if (!auth) return () => {}
  let active = true
  ensureAuthReady()
    .then(async (readyAuth) => {
      const result = await getRedirectResult(readyAuth).catch(() => null)
      if (active && result?.user) callback(toAltaUser(result.user))
    })
    .catch(() => undefined)
  const unsubscribe = onAuthStateChanged(auth, (user) => callback(user ? toAltaUser(user) : null))
  return () => {
    active = false
    unsubscribe()
  }
}
