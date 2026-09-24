export function hasFirebaseClientConfig() {
  return Boolean(
    process.env.NEXT_PUBLIC_FIREBASE_API_KEY &&
      process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN &&
      process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID &&
      process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  )
}

export function getStoreUrl(fallback = 'http://127.0.0.1:3011') {
  return process.env.NEXT_PUBLIC_STORE_URL || fallback
}
