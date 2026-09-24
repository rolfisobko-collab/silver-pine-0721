'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { AlertCircle, Check, CheckCircle2, CreditCard, Lock, MessageCircle, Truck } from 'lucide-react'
import { useCart } from '@/components/cart-context'
import { useAuth } from '@/components/auth-context'
import { formatPrice } from '@/lib/products'
import { Price } from '@/components/ui/price'
import { cn } from '@/lib/utils'

type PaymentMethod = 'operator' | 'mercadopago'

const phoneCountries = [
  { code: 'AR', name: 'Argentina', dial: '54', placeholder: '9 3764 63-3878' },
  { code: 'PY', name: 'Paraguay', dial: '595', placeholder: '985 712217' },
  { code: 'BR', name: 'Brasil', dial: '55', placeholder: '11 91234-5678' },
  { code: 'UY', name: 'Uruguay', dial: '598', placeholder: '99 123 456' },
  { code: 'CL', name: 'Chile', dial: '56', placeholder: '9 1234 5678' },
  { code: 'BO', name: 'Bolivia', dial: '591', placeholder: '71234567' },
  { code: 'US', name: 'Estados Unidos', dial: '1', placeholder: '305 555 0123' },
]

function onlyDigits(value: string) {
  return value.replace(/\D/g, '')
}

function normalizePhone(countryDial: string, value: string) {
  let digits = onlyDigits(value)
  if (digits.startsWith(countryDial)) digits = digits.slice(countryDial.length)
  if (countryDial === '54') {
    digits = digits.replace(/^0+/, '')
    if (digits.length >= 10 && !digits.startsWith('9')) digits = `9${digits}`
  }
  return {
    national: digits,
    international: digits ? `+${countryDial}${digits}` : '',
  }
}

function isPhoneValid(countryDial: string, national: string) {
  if (!national) return false
  if (countryDial === '54') return /^9\d{10}$/.test(national)
  return national.length >= 8 && national.length <= 14
}

function Field({
  label,
  id,
  ...props
}: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label htmlFor={id} className="block">
      <span className="mb-1.5 block text-sm font-medium">{label}</span>
      <input
        id={id}
        required
        {...props}
        className="glass w-full rounded-2xl px-4 py-3 text-sm outline-none transition-shadow focus:ring-2 focus:ring-primary/60"
      />
    </label>
  )
}

function PhoneField({
  country,
  phone,
  onCountryChange,
  onPhoneChange,
}: {
  country: string
  phone: string
  onCountryChange: (value: string) => void
  onPhoneChange: (value: string) => void
}) {
  const current = phoneCountries.find((item) => item.dial === country) || phoneCountries[0]
  const normalized = normalizePhone(current.dial, phone)
  const hasValue = onlyDigits(phone).length > 0
  const valid = isPhoneValid(current.dial, normalized.national)

  return (
    <label htmlFor="phone" className="block">
      <span className="mb-1.5 block text-sm font-medium">WhatsApp</span>
      <div className="grid min-h-12 grid-cols-[92px_minmax(0,1fr)] overflow-hidden rounded-2xl border border-border bg-white/72 text-sm shadow-sm transition-shadow focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/35 sm:grid-cols-[104px_minmax(0,1fr)]">
        <select
          value={current.dial}
          onChange={(event) => onCountryChange(event.target.value)}
          className="min-w-0 border-r border-border bg-transparent px-3 font-semibold outline-none"
          aria-label="Codigo de pais"
        >
          {phoneCountries.map((item) => (
            <option key={item.code} value={item.dial}>
              {item.code} +{item.dial}
            </option>
          ))}
        </select>
        <input
          id="phone"
          required
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          value={phone}
          onChange={(event) => onPhoneChange(event.target.value)}
          placeholder={current.placeholder}
          className="min-w-0 bg-transparent px-3 py-3 text-[15px] outline-none placeholder:text-muted-foreground sm:px-4"
        />
      </div>
      <div
        className={cn(
          'mt-2 flex min-h-5 items-center gap-1.5 text-xs font-semibold transition',
          !hasValue && 'text-muted-foreground',
          hasValue && valid && 'text-emerald-600',
          hasValue && !valid && 'text-amber-700',
        )}
      >
        {hasValue && valid ? (
          <CheckCircle2 className="h-3.5 w-3.5" />
        ) : hasValue ? (
          <AlertCircle className="h-3.5 w-3.5" />
        ) : null}
        <span>
          {hasValue
            ? valid
              ? `Numero listo para contacto: ${normalized.international}`
              : current.dial === '54'
                ? 'Para Argentina usamos formato movil: +54 9 + area + numero.'
                : 'Revisa el codigo de pais y el numero antes de comprar.'
            : 'Argentina viene preseleccionado, pero podes usar otro pais.'}
        </span>
      </div>
    </label>
  )
}

export function CheckoutView() {
  const { items, subtotal, clear } = useCart()
  const { user, createOrder } = useAuth()
  const [done, setDone] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('operator')
  const [mpReady, setMpReady] = useState(false)
  const [orderSynced, setOrderSynced] = useState<boolean | null>(null)
  const [email, setEmail] = useState(user?.email ?? '')
  const [firstName, setFirstName] = useState(user?.name?.split(' ')[0] ?? '')
  const [lastName, setLastName] = useState(user?.name?.split(' ').slice(1).join(' ') ?? '')
  const [phoneCountry, setPhoneCountry] = useState('54')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [city, setCity] = useState('')

  useEffect(() => {
    let cancelled = false
    fetch('/api/integrations')
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled) setMpReady(Boolean(data.mercadoPago))
      })
      .catch(() => {
        if (!cancelled) setMpReady(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  const total = subtotal
  const hasInvalidPrice = items.some((item) => Number(item.product.price || 0) <= 0)
  const normalizedPhone = useMemo(() => normalizePhone(phoneCountry, phone), [phoneCountry, phone])
  const phoneValid = isPhoneValid(phoneCountry, normalizedPhone.national)

  async function syncOrder(order: unknown) {
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(order),
      })
      const data = await res.json()
      setOrderSynced(Boolean(data.synced))
      return data
    } catch {
      setOrderSynced(false)
      return null
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    if (hasInvalidPrice) {
      setError('Hay productos sin precio. Sacalos del carrito o consultá con una operadora.')
      return
    }
    if (!phoneValid) {
      setError('Revisa el WhatsApp antes de comprar. Necesitamos un numero valido para coordinar el pedido.')
      return
    }
    setLoading(true)

    const orderId = `ALT-${Date.now().toString(36).toUpperCase()}`
    const customerName = `${firstName} ${lastName}`.trim()
    const orderPayload = {
      id: orderId,
      customer: {
        name: customerName,
        email,
        phone: normalizedPhone.international,
      },
      delivery: {
        address,
        city,
        note: 'Envio/retiro a coordinar por operadora',
      },
      payment: {
        method: paymentMethod,
        status: paymentMethod === 'operator' ? 'pending_operator' : 'pending_mp',
      },
      items: items.map((item) => ({
        productId: item.product.id,
        sku: item.product.sku,
        name: item.product.name,
        image: item.product.image,
        quantity: item.quantity,
        unitPrice: item.product.price,
        total: item.product.price * item.quantity,
        currency: 'ARS',
      })),
      total,
      currency: 'ARS',
      createdAt: new Date().toISOString(),
      source: 'ecommerce',
      sourceSystem: 'alta_ecommerce',
    }

    const localOrder = user
      ? createOrder({
          items: items.map((item) => ({
            name: item.product.name,
            slug: item.product.slug,
            image: item.product.image,
            color: item.color,
            quantity: item.quantity,
            price: item.product.price,
          })),
          total,
          address,
          city,
        })
      : null

    const syncedOrder = await syncOrder({ ...orderPayload, localOrderId: localOrder?.id })

    if (paymentMethod === 'mercadopago') {
      if (!syncedOrder?.synced) {
        setLoading(false)
        setError('No pudimos registrar el pedido en el panel. No te mando a pagar hasta que eso quede guardado.')
        return
      }
      try {
        const res = await fetch('/api/payments/mercadopago', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            orderId,
            customer: { name: customerName, email },
            items: orderPayload.items.map((item) => ({
              name: item.name,
              quantity: item.quantity,
              price: item.unitPrice,
            })),
          }),
        })
        const data = await res.json()
        if (!res.ok || !data.init_point) {
          throw new Error(data.error || 'No pudimos abrir Mercado Pago.')
        }
        window.location.href = data.init_point
        return
      } catch (err) {
        setLoading(false)
        setError(
          err instanceof Error
            ? err.message
            : 'No pudimos iniciar el pago con Mercado Pago.',
        )
        return
      }
    }

    setDone(true)
    clear()
    setLoading(false)
  }

  if (done) {
    return (
      <div className="mx-auto max-w-2xl px-4">
        <div className="glass glass-sheen flex flex-col items-center gap-4 rounded-4xl p-10 text-center sm:p-16">
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <Check className="h-8 w-8" />
          </span>
          <h1 className="text-3xl font-semibold">Pedido enviado</h1>
          <p className="max-w-sm text-muted-foreground">
            Alta recibio el pedido para coordinar pago, disponibilidad y entrega
            por WhatsApp.
          </p>
          {orderSynced === false ? (
            <p className="rounded-2xl bg-amber-100 px-4 py-2 text-sm font-semibold text-amber-800">
              El pedido quedo en esta sesion, pero falta conectar el endpoint del panel.
            </p>
          ) : null}
          <div className="mt-2 flex flex-wrap items-center justify-center gap-3">
            {user && (
              <Link
                href="/cuenta/pedidos"
                className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-transform hover:scale-[1.03]"
              >
                Seguir mi pedido
              </Link>
            )}
            <Link
              href="/links"
              className="glass glass-hover inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold"
            >
              Contactar por WhatsApp
            </Link>
          </div>
        </div>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4">
        <div className="glass glass-sheen flex flex-col items-center gap-4 rounded-4xl p-16 text-center">
          <h1 className="text-2xl font-semibold">No hay productos en el carrito</h1>
          <p className="text-muted-foreground">
            Agrega productos antes de confirmar el pedido.
          </p>
          <Link
            href="/catalogo"
            className="mt-2 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-transform hover:scale-[1.03]"
          >
            Ir a la tienda
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-6xl px-4">
      <h1 className="mb-8 text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
        Confirmar pedido
      </h1>

      <form
        onSubmit={handleSubmit}
        className="grid gap-6 lg:grid-cols-[1.5fr_1fr]"
      >
        <div className="flex flex-col gap-4">
          <fieldset className="glass glass-sheen rounded-3xl p-6">
            <legend className="px-2 text-sm font-semibold">Contacto</legend>
            <div className="mt-2 grid gap-4 sm:grid-cols-2">
              <Field
                label="Correo electronico"
                id="email"
                type="email"
                placeholder="tu@email.com"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <PhoneField
                country={phoneCountry}
                phone={phone}
                onCountryChange={setPhoneCountry}
                onPhoneChange={setPhone}
              />
              <Field
                label="Nombre"
                id="first"
                placeholder="Juan"
                autoComplete="given-name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
              <Field
                label="Apellido"
                id="last"
                placeholder="Perez"
                autoComplete="family-name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
          </fieldset>

          <fieldset className="glass glass-sheen rounded-3xl p-6">
            <legend className="flex items-center gap-1.5 px-2 text-sm font-semibold">
              <Truck className="h-4 w-4" /> Entrega
            </legend>
            <div className="mt-2 grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <Field
                  label="Direccion"
                  id="address"
                  placeholder="Calle, numero, referencia"
                  autoComplete="street-address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>
              <Field
                label="Ciudad"
                id="city"
                placeholder="Posadas"
                autoComplete="address-level2"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
              <div className="rounded-2xl border border-border bg-white/70 p-4 text-sm text-muted-foreground">
                La entrega o retiro se coordina con una operadora despues de
                confirmar el pedido.
              </div>
            </div>
          </fieldset>

          <fieldset className="glass glass-sheen rounded-3xl p-6">
            <legend className="flex items-center gap-1.5 px-2 text-sm font-semibold">
              <CreditCard className="h-4 w-4" /> Pago
            </legend>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <PaymentCard
                active={paymentMethod === 'operator'}
                icon={MessageCircle}
                title="Coordinar con operadora"
                text="Recomendado por ahora: Alta confirma stock, entrega y forma de pago."
                onClick={() => setPaymentMethod('operator')}
              />
              <PaymentCard
                active={paymentMethod === 'mercadopago'}
                icon={CreditCard}
                title="Mercado Pago"
                text={
                  mpReady
                    ? 'Redirige a Checkout Pro de Mercado Pago.'
                    : 'Falta configurar el access token.'
                }
                onClick={() => setPaymentMethod('mercadopago')}
                muted={!mpReady || hasInvalidPrice}
              />
            </div>
          </fieldset>

          {error ? (
            <p className="rounded-3xl bg-destructive/10 px-5 py-3 text-sm font-semibold text-destructive">
              {error}
            </p>
          ) : null}
        </div>

        <div className="lg:sticky lg:top-28 lg:h-fit">
          <div className="glass glass-sheen rounded-3xl p-6">
            <h2 className="text-lg font-semibold">Tu pedido</h2>
            <ul className="mt-4 space-y-3">
              {items.map((item) => (
                <li
                  key={`${item.product.id}-${item.color}`}
                  className="flex items-center gap-3"
                >
                  <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-secondary">
                    <Image
                      src={item.product.image || '/placeholder.svg'}
                      alt={item.product.name}
                      fill
                      sizes="56px"
                      className="object-contain p-1"
                    />
                    <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-xs font-semibold text-primary-foreground">
                      {item.quantity}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">
                      {item.product.name}
                    </p>
                    <p className="text-xs text-muted-foreground">{item.color}</p>
                  </div>
                  <span className="text-sm font-medium">
                    <Price value={item.product.price * item.quantity} />
                  </span>
                </li>
              ))}
            </ul>

            <dl className="mt-5 space-y-2.5 border-t border-border pt-4 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Subtotal</dt>
                <dd><Price value={subtotal} /></dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Entrega</dt>
                <dd>A coordinar</dd>
              </div>
              <div className="flex justify-between border-t border-border pt-2.5 text-base font-semibold">
                <dt>Total productos</dt>
                <dd><Price value={total} /></dd>
              </div>
            </dl>

            <button
              type="submit"
              disabled={loading || hasInvalidPrice || !phoneValid}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground transition-transform hover:scale-[1.02] active:scale-95 disabled:cursor-not-allowed disabled:opacity-70"
            >
              <Lock className="h-4 w-4" />
              {loading
                ? 'Procesando...'
                : paymentMethod === 'mercadopago'
                  ? `Pagar ${formatPrice(total)}`
                  : 'Enviar pedido'}
            </button>
            <p className="mt-3 text-center text-xs text-muted-foreground">
              {paymentMethod === 'mercadopago'
                ? 'El pago se completa en Mercado Pago.'
                : 'Una operadora confirma el pedido antes de despacharlo.'}
            </p>
          </div>
        </div>
      </form>
    </div>
  )
}

function PaymentCard({
  active,
  icon: Icon,
  title,
  text,
  onClick,
  muted = false,
}: {
  active: boolean
  icon: typeof CreditCard
  title: string
  text: string
  onClick: () => void
  muted?: boolean
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'rounded-3xl border p-4 text-left transition hover:-translate-y-0.5',
        active
          ? 'border-primary bg-primary/8 shadow-[0_18px_40px_-30px_rgba(239,35,60,0.7)]'
          : 'border-border bg-white/70 hover:border-primary/30',
        muted && 'opacity-75',
      )}
    >
      <span
        className={cn(
          'flex h-11 w-11 items-center justify-center rounded-2xl',
          active ? 'bg-primary text-primary-foreground' : 'bg-secondary text-foreground',
        )}
      >
        <Icon className="h-5 w-5" />
      </span>
      <span className="mt-4 block text-sm font-bold">{title}</span>
      <span className="mt-1 block text-xs leading-relaxed text-muted-foreground">
        {text}
      </span>
    </button>
  )
}

