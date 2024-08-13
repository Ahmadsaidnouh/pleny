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
      console.log("Search text:", text, " from home");
      if (text != "") {
        // this.selectedCategory = "";
  
        // want to reset the rad btns by choosing All, but doesn't send a request because this.selectedCategory = "" resets but sends a request
  
        this.searchText = text;
        console.log("Search text:", text);
        this.fetchProducts();
      }
      else {
        this.searchText = "";
        this.fetchProducts();
      }
    });
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

    this.productService.getProducts(this.selectedCategory, this.searchText, this.limit, skip).subscribe((response) => {
      this.productsToDisplay = response.products;
      this.data = response;
      this.total = response.total;
      console.log("Products: ", this.productsToDisplay);
    });
  }

  onCategoryChange(category: string, categoryName: string): void {
    // this.searchService.setSearchText(""); // reset search input

    // Reset the search input and avoid emitting search value to prevent an unnecessary request
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
