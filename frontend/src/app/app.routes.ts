import { Routes } from '@angular/router';
import { ProductListComponent } from './core/components/product-list/product-list.component';
import { ProductDetailsComponent } from './core/components/product-details/product-details.component';

export const routes: Routes = [
    { path: 'products', component: ProductListComponent },
    { path: 'category', component: ProductListComponent },
    { path: 'category/:id', component: ProductListComponent },
    { path: 'search/:keyword', component: ProductListComponent },
    { path: 'products/:id', component: ProductDetailsComponent },
    { path: '', redirectTo: '/products', pathMatch: 'full' },
    { path: '**', redirectTo: 'not-found' },
];
