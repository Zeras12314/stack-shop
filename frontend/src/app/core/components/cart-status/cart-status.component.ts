import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, HostListener, inject, OnInit } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { RouterLink } from "@angular/router";
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-cart-status',
  imports: [CommonModule, RouterLink],
  templateUrl: './cart-status.component.html',
  styleUrl: './cart-status.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CartStatusComponent implements OnInit {
  cartService = inject(CartService);
  authService = inject(AuthService);
  isOpen = false;

  ngOnInit() {
  }

  toggleMenu() {
    this.isOpen = !this.isOpen;
  }

  closeMenu() {
    this.isOpen = false;
  }

  @HostListener('document:click', ['$event'])
  onClick(event: MouseEvent) {
    const target = event.target as HTMLElement;

    if (!target.closest('.user-menu')) {
      this.isOpen = false;
    }
  }

  // onImgError(event: Event) {
  //   console.log('Image failed to load');
  //   const img = event.target as HTMLImageElement;
  //   img.src = 'default-avatar.png';
  // }

}
