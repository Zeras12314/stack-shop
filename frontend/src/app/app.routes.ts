import { Routes } from '@angular/router';
import { ProductListComponent } from './core/components/product-list/product-list.component';
import { ProductDetailsComponent } from './core/components/product-details/product-details.component';
import { CartDetailsComponent } from './core/components/cart-details/cart-details.component';
import { CheckoutComponent } from './core/components/checkout/checkout.component';
import { CallbackComponent } from './core/components/callback/callback.component';
import { LoginComponent } from './core/components/login/login.component';

export const routes: Routes = [
    { path: 'products', component: ProductListComponent },
    { path: 'category', component: ProductListComponent },
    { path: 'category/:id', component: ProductListComponent },
    { path: 'search/:keyword', component: ProductListComponent },
    { path: 'products/:id', component: ProductDetailsComponent },
    { path: 'cart-details', component: CartDetailsComponent },
    { path: 'checkout', component: CheckoutComponent },
    { path: 'auth/callback', component: CallbackComponent },
    { path: 'login', component: LoginComponent },
    { path: '', redirectTo: '/products', pathMatch: 'full' },
    { path: '**', redirectTo: 'not-found' },
];
