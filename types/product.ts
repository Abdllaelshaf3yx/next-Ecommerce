export interface Product {
    id: string;
    name_en: string;
    name_ar: string;
    price: number;
    category: string;
    image: string;
    description_en: string;
    description_ar: string;
    inStock: boolean;
    originalPrice?: number;
}
