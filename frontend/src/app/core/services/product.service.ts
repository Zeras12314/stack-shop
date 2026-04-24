import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Product } from '../../common/product';
import { ProductCategory } from '../../common/product-category';

interface ProductResponse {
  _embedded: {
    products: Product[];
  },
  page: {
    size: number,
    totalElements: number,
    totalPages: number,
    number: number
  }
}

interface ProductCategoryResponse {
  _embedded: {
    productCategory: ProductCategory[];
  };
}



@Injectable({
  providedIn: 'root'
})

export class ProductService {

  private baseUrl = 'http://localhost:8080/api';
  http = inject(HttpClient)

  constructor() {
  }

  getProductList(id: number): Observable<Product[]> {
    const searchUrl = `${this.baseUrl}/products/search/findByCategoryId?id=${id}`;
    return this.getProducts(searchUrl);
  }

  getProductListPaginate(page: number, pageSize: number, id: number): Observable<ProductResponse> {
    const searchUrl = `${this.baseUrl}/products/search/findByCategoryId?id=${id}` + `&page=${page}&size=${pageSize}`;
    return this.http.get<ProductResponse>(searchUrl);
  }

  getProduct(id: number): Observable<Product> {
    const productUrl = `${this.baseUrl}/products/${id}`;
    return this.http.get<Product>(productUrl);
  }


  searchProducts(keyword: string): Observable<Product[]> {
    const searchUrl = `${this.baseUrl}/products/search/findByNameContainingIgnoreCase?name=${keyword}`;
    return this.getProducts(searchUrl);
  }

  searchProductsPaginate(page: number, pageSize: number, keyword: string): Observable<ProductResponse> {
    const searchUrl = `${this.baseUrl}/products/search/findByNameContainingIgnoreCase?name=${keyword}` + `&page=${page}&size=${pageSize}`;
    return this.http.get<ProductResponse>(searchUrl);
  }

  getProductCategories(): Observable<ProductCategory[]> {
    const categoryUrl = `${this.baseUrl}/product-category`;
    return this.http.get<ProductCategoryResponse>(categoryUrl).pipe(
      map(res => res._embedded.productCategory)
    );
  }

  private getProducts(searchUrl: string): Observable<Product[]> {
    return this.http.get<ProductResponse>(searchUrl).pipe(
      map(res => res._embedded.products)
    );
  }
}
