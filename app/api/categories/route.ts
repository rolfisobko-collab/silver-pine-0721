import { NextResponse } from 'next/server'
import { buildCategoryTree, fetchAltaCategories } from '@/lib/alta-store'

export async function GET() {
  try {
    const categories = await fetchAltaCategories()
    return NextResponse.json({
      categories,
      tree: buildCategoryTree(categories),
    })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Error al cargar categorias' },
      { status: 500 },
    )
  }
}
