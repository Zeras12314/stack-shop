import { Product } from "./product";

export class CartItem {
    id: string;
    name: string;
    unitPrice: number;
    imageData: string;
    quantity: number;
    constructor(product: Product) {
        this.id = product.id.toString();
        this.name = product.name;
        this.unitPrice = product.unitPrice;
        this.imageData = product.imageData;
        this.quantity = 1;
    }
}