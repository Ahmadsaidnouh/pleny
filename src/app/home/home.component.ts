import { Component } from '@angular/core';
import { ProductService } from '../services/product.service';
import { CartService } from '../services/cart.service';
import { SearchService } from '../services/search.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  categories: any[] = [];
  selectedCategory: string = '';
  selectedCategoryName: string = '';
  searchText = ""

  productsToDisplay: any[] = []
  data: any;
  total: number = 0;
  limit: number = 9; // Items per page
  currentPage: number = 1;

  constructor(private productService: ProductService, private cartService: CartService, private searchService: SearchService) { }

  ngOnInit(): void {
    // Fetch categories on initialization
    this.fetchCategories();
    this.fetchProducts();

    this.searchService.searchText$.subscribe((text) => {
      if (text != "") {
        this.searchText = text;
        this.fetchProducts();
      }
      else {
        this.searchText = "";
        this.fetchProducts();
      }
    });
  }

  calcPrice(price: number, discount:number) {    
    return (price * (100 - discount)/100).toFixed(2)
  }

  fetchCategories(): void {
    this.productService.getAllCategories().subscribe((response) => {
      this.categories = [{ name: "All", slug: "" }];
      this.categories.push(...response);
    });
  }

  fetchProducts(page: number = 1): void {
    this.currentPage = page;
    const skip = (this.currentPage - 1) * this.limit;

    this.productService.getProducts(this.selectedCategory, this.searchText, this.limit, skip).subscribe((response) => {
      this.productsToDisplay = response.products;
      this.data = response;
      this.total = response.total;
    });
  }

  onCategoryChange(category: string, categoryName: string): void {
    this.searchText = '';
    this.searchService.setSearchText('');
    this.searchService.resetTextSubject.next(!this.searchService.resetTextSubject.getValue());

    this.selectedCategory = category;
    this.selectedCategoryName = categoryName;
    this.fetchProducts();
  }

  changePage(page: number): void {
    if (page !== this.currentPage) {
      this.fetchProducts(page);
    }
  }

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
