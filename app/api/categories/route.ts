import { NextResponse } from 'next/server';
import productsData from '../../../data/products.json';

export async function GET() {
    const categories = Array.from(new Set(productsData.map((p) => p.category)));
    return NextResponse.json(categories);
}
