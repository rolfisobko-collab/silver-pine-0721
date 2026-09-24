function envValue(value: string | undefined) {
  const clean = value?.trim().replace(/^"|"$/g, '')
  return clean || undefined
}

export function hasFirebaseClientConfig() {
  return Boolean(
    envValue(process.env.NEXT_PUBLIC_FIREBASE_API_KEY) &&
      envValue(process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN) &&
      envValue(process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID) &&
      envValue(process.env.NEXT_PUBLIC_FIREBASE_APP_ID),
  )
}

export function getStoreUrl(fallback = 'http://127.0.0.1:3011') {
  return envValue(process.env.NEXT_PUBLIC_STORE_URL) || fallback
}
