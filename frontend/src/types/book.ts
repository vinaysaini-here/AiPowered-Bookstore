export interface Book {
    _id: string;
    title: string;
    author: string;
    description: string;
    price: number;
    category: string;
    imageUrl: string;
    fileUrl?: string;
    stock: number;
}
