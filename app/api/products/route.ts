import { NextResponse } from 'next/server';
import productsData from '../../../data/products.json';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const sort = searchParams.get('sort');

    let products = [...productsData];

    if (category && category !== 'all') {
        products = products.filter(p => p.category.toLowerCase() === category.toLowerCase());
    }

    if (sort === 'asc') {
        products.sort((a, b) => a.price - b.price);
    } else if (sort === 'desc') {
        products.sort((a, b) => b.price - a.price);
    }

    return NextResponse.json(products);
}
