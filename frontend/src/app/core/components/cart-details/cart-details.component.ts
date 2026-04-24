import { Component, inject, OnInit } from '@angular/core';
import { UtilsService } from '../../services/utils.service';
import { CartItem } from '../../../common/cart-item';
import { CartService } from '../../services/cart.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cart-details',
  imports: [CommonModule],
  templateUrl: './cart-details.component.html',
  styleUrl: './cart-details.component.scss'
})
export class CartDetailsComponent implements OnInit {
  utilsService = inject(UtilsService);
  cartService = inject(CartService);
  cartItems: CartItem[] = [];
  subtotal: number = 0;
  shipping: number = 0;
  total: number = 0;


  ngOnInit(): void {
    this.initializeCartData();
  }

  initializeCartData() {
    this.cartItems = this.cartService.cartItems;
    this.subtotal = this.cartService.totalPrice();
    this.total = this.subtotal + this.shipping;
  }


  getProductImage(imageData: string) {
    return this.utilsService.getProductImage(imageData);
  }

  decreaseQty(item: CartItem) {
    this.cartService.decreaseQty(item);
    this.initializeCartData();
  }

  increaseQty(item: CartItem) {
    this.cartService.increaseQty(item);
    this.initializeCartData();
  }

  removeItem(item: CartItem) {
    this.cartService.removeFromCart(item);
    this.initializeCartData();
  }

}
