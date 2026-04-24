import { Component, inject, OnInit } from '@angular/core';
import { Product } from '../../../common/product';
import { ProductService } from '../../services/product.service';
import { ActivatedRoute } from '@angular/router';
import { DatePipe, NgClass } from '@angular/common';

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

  ngOnInit(): void {
    this.route.paramMap.subscribe(() => { this.handleProductDetails(); });
  }

  handleProductDetails() {
    const id: number = +this.route.snapshot.paramMap.get('id')!;
    this.productService.getProduct(id).subscribe((data) => {
      this.product = data;
    })
  }

  getProductImage(imageData: string) {
    // We tell the browser this string is an image/png
    return `data:image/png;base64,${imageData}`;
  }

}
