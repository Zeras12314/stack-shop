import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-callback',
  imports: [],
  templateUrl: './callback.component.html',
  styleUrl: './callback.component.scss'
})
export class CallbackComponent implements OnInit {
  authService = inject(AuthService);
  router = inject(Router);

  ngOnInit() {
    this.authService.fetchCurrentUser().subscribe({
      next: (user) => {
        this.router.navigate(['/products']);
      },
      error: (err) => {
        console.error('Auth error:', err);
        this.router.navigate(['/login']);
      }
    });
  }

}
