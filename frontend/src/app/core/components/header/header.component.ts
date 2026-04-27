import { Component } from '@angular/core';
import { CartStatusComponent } from '../cart-status/cart-status.component';
import { SearchComponent } from '../search/search.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [CartStatusComponent, SearchComponent, RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {

}
