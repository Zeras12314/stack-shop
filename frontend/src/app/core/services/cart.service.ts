import { Injectable, signal } from '@angular/core';
import { CartItem } from '../../common/cart-item';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  cartItems: CartItem[] = [];
  totalPrice = signal(0);
  totalQuantity = signal(0);

  constructor() { }

  addToCart(cartitem: CartItem) {
    // check if item already exists in cart
    let alreadyExistsInCart: boolean = false;
    let existingCartItem: CartItem = undefined;

    // find the item in the cart based on item id
    if (this.cartItems.length > 0) {
      existingCartItem = this.cartItems.find(item => item.id === cartitem.id);
    }

    // test commit from frontend
    // check if we found it in the cart
    alreadyExistsInCart = (existingCartItem != undefined);

    if (alreadyExistsInCart) {
      // increment the quantity
      existingCartItem.quantity++;
    } else {
      // add the item to the array
      this.cartItems.push(cartitem);
    }

    // compute cart total price and total quantity
    this.computeCartTotals();

    // test frontend commit
  }

  computeCartTotals() {
    let totalPriceValue: number = 0;
    let totalQuantityValue: number = 0;

    for (let currentCartItem of this.cartItems) {
      totalPriceValue += currentCartItem.quantity * currentCartItem.unitPrice;
      totalQuantityValue += currentCartItem.quantity;
    }
    this.totalPrice.set(totalPriceValue);
    this.totalQuantity.set(totalQuantityValue);

    // log cart data just for debugging purposes
    this.logCartData(totalPriceValue, totalQuantityValue);
  }


  logCartData(totalPriceValue: number, totalQuantityValue: number) {
    console.log('Contents of the cart');
    for (let tempCartItem of this.cartItems) {
      const subTotalPrice = tempCartItem.quantity * tempCartItem.unitPrice;
      console.log(`name: ${tempCartItem.name}, quantity=${tempCartItem.quantity}, unitPrice=${tempCartItem.unitPrice}, subTotalPrice=${subTotalPrice}`);
    }

    console.log(`totalPrice: ${totalPriceValue.toFixed(2)}, totalQuantity: ${totalQuantityValue}`);
    console.log('----');
  }

  removeFromCart(cartItem: CartItem) {
    this.cartItems = this.cartItems.filter(item => item.id !== cartItem.id);
    this.computeCartTotals();
  }

  increaseQty(cartItem: CartItem) {
    cartItem.quantity++;
    this.computeCartTotals();
  }

  decreaseQty(cartItem: CartItem) {
    cartItem.quantity--;
    if (cartItem.quantity <= 0) {
      this.removeFromCart(cartItem);
    } else {
      this.computeCartTotals();
    }
  }
}
