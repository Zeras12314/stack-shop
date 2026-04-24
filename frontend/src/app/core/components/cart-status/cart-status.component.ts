import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-cart-status',
  imports: [CommonModule, RouterLink],
  templateUrl: './cart-status.component.html',
  styleUrl: './cart-status.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CartStatusComponent implements OnInit {
  cartService = inject(CartService);


  ngOnInit() {

  }

}
