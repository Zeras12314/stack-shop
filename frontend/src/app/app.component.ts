import { Component } from '@angular/core';
import { RouterOutlet, RouterLinkWithHref, RouterLink } from '@angular/router';
import { ProductCategoryMenuComponent } from './core/components/product-category-menu/product-category-menu.component';
import { HeaderComponent } from './core/components/header/header.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ProductCategoryMenuComponent, HeaderComponent, RouterLinkWithHref, RouterLink,],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'frontend';
  searchOpen = false;

  toggleSearch() {
    this.searchOpen = !this.searchOpen;
  }
}
