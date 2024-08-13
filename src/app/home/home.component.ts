import { Component } from '@angular/core';
import { ProductService } from '../services/product.service';
import { CartService } from '../services/cart.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  categories: any[] = [];
  selectedCategory: string = '';

  productsToDisplay: any[] = []
  data: any;
  total: number = 0;
  limit: number = 9; // Items per page
  currentPage: number = 1;

  constructor(private productService: ProductService, private cartService: CartService) { }

  ngOnInit(): void {
    // Fetch categories on initialization
    this.fetchCategories();
    this.fetchProducts();
  }

  fetchCategories(): void {
    this.productService.getAllCategories().subscribe((response) => {
      this.categories = [{ name: "All", slug: "" }];
      this.categories.push(...response);
      console.log("Categories: ", this.categories);
    });
  }

  fetchProducts(page: number = 1): void {
    this.currentPage = page;
    const skip = (this.currentPage - 1) * this.limit;
    
    console.log("Cat = ", this.selectedCategory, " page = ", page, " skip = ", skip, " limit = ", this.limit);
    
    this.productService.getProducts(this.selectedCategory, this.limit, skip).subscribe((response) => {
      this.productsToDisplay = response.products;
      this.data = response;
      this.total = response.total;
      console.log("Products: ", this.productsToDisplay);
    });
  }

  onCategoryChange(category: string): void {
    this.selectedCategory = category;
    this.fetchProducts();
  }

  changePage(page: number): void {
    if (page !== this.currentPage) {
      this.fetchProducts(page);
    }
  }

  // Calculate total number of pages
  get totalPages(): number {
    return Math.ceil(this.total / this.limit);
  }

  // Create an array of page numbers for the pagination
  get pagesArray(): number[] {
    return Array(this.totalPages).fill(0).map((_, index) => index + 1);
  }

  // Add or remove product from cart
  toggleCart(productId: number): void {
    if (this.cartService.isInCart(productId)) {
      this.cartService.removeFromCart(productId);
    } else {
      this.cartService.addToCart(productId);
    }
  }

  // Check if the product is in the cart
  isInCart(productId: number): boolean {
    return this.cartService.isInCart(productId);
  }
}
