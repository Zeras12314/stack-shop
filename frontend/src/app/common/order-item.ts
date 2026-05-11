import { CartItem } from "./cart-item";

export class OrderItem {
    imageData: string;
    unitPrice: number;
    quantity: number;
    productId: number;

    constructor(cartItem: CartItem) {
        this.imageData = cartItem.imageData;
        this.unitPrice = cartItem.unitPrice;
        this.quantity = cartItem.quantity;
        this.productId = +cartItem.id;
    }


}