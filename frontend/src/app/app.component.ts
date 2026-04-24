import { Component } from '@angular/core';
import { RouterOutlet, RouterLinkWithHref, RouterLink } from '@angular/router';
import { ProductCategoryMenuComponent } from './core/components/product-category-menu/product-category-menu.component';
import { SearchComponent } from './core/components/search/search.component';
import { CartStatusComponent } from './core/components/cart-status/cart-status.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ProductCategoryMenuComponent, SearchComponent, RouterLinkWithHref, RouterLink, CartStatusComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'frontend';
}
