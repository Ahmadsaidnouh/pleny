import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = 'https://dummyjson.com/products';
  private productsSubject = new BehaviorSubject<any[]>([]);
  public productsToDisplay = this.productsSubject.asObservable();

  constructor(private http: HttpClient) {}

  // // Fetch all products
  // getAllProducts(): void {
  //   this.http.get<any>(this.apiUrl)
  //     .pipe(map(response => response.products))
  //     .subscribe(products => this.productsSubject.next(products));
  // }
  // Fetch all products
  getAllProducts(limit: number, skip: number): Observable<any>  {
    return this.http.get<any>(`${this.apiUrl}?limit=${limit}&skip=${skip}`);
  }

  // Fetch all products
  getProducts(category: string, searchText: string, limit: number, skip: number): Observable<any>  {
    if (searchText != "") {
      console.log("case1");
      return this.http.get<any>(`${this.apiUrl}/search?q=${searchText}`);
    }
    else {
      let temp = ""
      if (category != '') {
        temp = `/category/${category}`
      }
      return this.http.get<any>(`${this.apiUrl + temp}?limit=${limit}&skip=${skip}`);
    }
  }

  // Fetch a single product by ID
  getProductById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  // Search products
  searchProducts(query: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/search`, { params: { q: query } })
      .pipe(map(response => response.products));
  }

  // Fetch products with pagination
  getProductsWithPagination(limit: number, skip: number, select?: string): Observable<any>  {
    const params: any = { limit: limit.toString(), skip: skip.toString() };
    if (select) {
      params.select = select;
    }
    return this.http.get<any>(this.apiUrl, { params });
  }

  // Fetch all product categories
  getAllCategories(): Observable<any[]> {
    return this.http.get<any[]>(`https://dummyjson.com/products/categories`);
  }

  // Fetch product category list
  getCategoryList(): Observable<any> {
    return this.http.get<any>('https://dummyjson.com/products/category-list');
  }

  // Fetch products by category
  getProductsByCategory(category: string, limit: number, skip: number): Observable<any>  {
    return this.http.get<any>(`https://dummyjson.com/products/category/${category}?limit=${limit}&skip=${skip}`);
  }
}
