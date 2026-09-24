import { NextRequest, NextResponse } from 'next/server'
import { searchAltaProducts } from '@/lib/alta-search'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    return NextResponse.json(await searchAltaProducts(searchParams))
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Error al cargar productos' },
      { status: 500 },
    )
  }
}
