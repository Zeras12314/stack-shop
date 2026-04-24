import { Component, inject } from '@angular/core';
import { ProductCategory } from '../../../common/product-category';
import { ProductService } from '../../services/product.service';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-product-category-menu',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './product-category-menu.component.html',
  styleUrl: './product-category-menu.component.scss'
})
export class ProductCategoryMenuComponent {
  productCategories: ProductCategory[] = [];
  productService = inject(ProductService);

  ngOnInit() {
    this.listProductCategories();
  }

  listProductCategories() {
    this.productService.getProductCategories().subscribe(
      (data: ProductCategory[]) => {
        this.productCategories = data;
        console.log(this.productCategories);
      }
    );
  }

}
