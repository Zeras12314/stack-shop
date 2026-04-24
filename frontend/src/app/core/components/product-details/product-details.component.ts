import { Component, inject, OnInit } from '@angular/core';
import { Product } from '../../../common/product';
import { ProductService } from '../../services/product.service';
import { ActivatedRoute } from '@angular/router';
import { DatePipe, NgClass } from '@angular/common';
import { CartService } from '../../services/cart.service';
import { CartItem } from '../../../common/cart-item';
import { UtilsService } from '../../services/utils.service';

@Component({
  selector: 'app-product-details',
  imports: [NgClass],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.scss'
})
export class ProductDetailsComponent implements OnInit {
  product: Product;
  productService = inject(ProductService);
  route = inject(ActivatedRoute);
  cartService = inject(CartService);
  utilsService = inject(UtilsService);

  ngOnInit(): void {
    this.route.paramMap.subscribe(() => { this.handleProductDetails(); });
  }

  handleProductDetails() {
    const id: number = +this.route.snapshot.paramMap.get('id')!;
    this.productService.getProduct(id).subscribe((data) => {
      this.product = data;
    })
  }


  addToCart() {
    const cartItem = new CartItem(this.product);
    this.cartService.addToCart(cartItem);
  }

  getProductImage(imageData: string) {
    return this.utilsService.getProductImage(imageData);
  }
}
