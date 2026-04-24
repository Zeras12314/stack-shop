import { Component, inject } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { Product } from '../../../common/product';
import { CurrencyPipe, NgClass } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { NgbDropdownModule, NgbPagination } from '@ng-bootstrap/ng-bootstrap';
import { CartItem } from '../../../common/cart-item';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-product-list',
  imports: [CurrencyPipe, NgClass, RouterLink, NgbPagination, NgbDropdownModule],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss'
})
export class ProductListComponent {
  products: Product[] = [];
  imaegeSrc: any;
  currentCategoryId: number = 1;
  searchMode: boolean = false;
  // pagination propeties
  pageNumber: number = 1;
  pageSize: number = 5;
  totalElements: number = 0;
  previousCategoryId: number;

  previousKeyword: string = null;

  productService = inject(ProductService);
  cartService = inject(CartService);
  route = inject(ActivatedRoute);
  sanitizer = inject(DomSanitizer);


  ngOnInit() {
    this.listProducts();
    this.route.paramMap.subscribe(() => {
      this.listProducts();
    });
  }

  listProducts() {
    this.searchMode = this.route.snapshot.paramMap.has('keyword');
    if (this.searchMode) {
      this.handleSearchProducts();
    } else {
      this.handleListProducts();
    }
  }

  handleSearchProducts() {
    const keyword: string = this.route.snapshot.paramMap.get('keyword')!;

    // if keyword changes then set pageNumber back to 1
    if (this.previousKeyword != keyword) {
      this.pageNumber = 1;
    }

    this.previousKeyword = keyword;

    this.productService.searchProductsPaginate(this.pageNumber - 1, this.pageSize, keyword).subscribe(this.processResult());
  };

  getProductImage(imageData: string) {
    // We tell the browser this string is an image/png
    return `data:image/png;base64,${imageData}`;
  }

  handleListProducts() {
    const paramMap = this.route.snapshot.paramMap;
    const hasCategoryId: boolean = paramMap.has('id');

    if (hasCategoryId) {
      this.currentCategoryId = +paramMap.get('id')!;
    } else {
      this.currentCategoryId = 1;
    }

    // if user selects different category than previous then set pageNumber back to 1
    if (this.previousCategoryId != this.currentCategoryId) {
      this.pageNumber = 1;
    }

    this.previousCategoryId = this.currentCategoryId;

    this.productService.getProductListPaginate(this.pageNumber - 1, this.pageSize, this.currentCategoryId).subscribe(
      this.processResult()

    )

    this.searchMode = this.route.snapshot.paramMap.has('keyword');

  }

  updatePageSize(pageSize: number) {
    this.pageSize = pageSize;
    this.pageNumber = 1;
    this.listProducts();
  }

  processResult() {
    return data => {
      this.products = data._embedded.products;
      this.pageNumber = data.page.number + 1;
      this.pageSize = data.page.size;
      this.totalElements = data.page.totalElements;
    }
  }

  addToCart(product: Product) {
    const cartItem = new CartItem(product);
    this.cartService.addToCart(cartItem);

  }
}
