import { Component } from '@angular/core';
import { ProductService } from '../services/product.service';

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

  constructor(private productService: ProductService) { }

  ngOnInit(): void {
    // Fetch categories on initialization
    this.fetchCategories();
    this.fetchProducts();


    // this.productService.getProducts().subscribe((response) => {
    //   this.productsToDisplay = response.products
    //   this.data = response
    //   console.log("productsToDisplay = ", this.productsToDisplay);
    // });
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
    // console.log("Category = ", this.selectedCategory);

    // if (this.selectedCategory != "") {
    //   this.productService.getProductsByCategory(category).subscribe((response) => {
    //     this.productsToDisplay = response.products
    //     this.data = response
    //     console.log("productsToDisplay = ", this.productsToDisplay);
    //   });
    // }
    // else {
    //   this.productService.getAllProducts().subscribe((response) => {
    //     this.productsToDisplay = response.products
    //     this.data = response
    //     console.log("productsToDisplay = ", this.productsToDisplay);
    //   });
    // }
  }

  changePage(page: number): void {
    if (page !== this.currentPage) {
      this.fetchProducts(page);
    }
    // window.scrollTo({
    //   top: 0,
    //   behavior: 'smooth'
    // });
  }

  // Calculate total number of pages
  get totalPages(): number {
    return Math.ceil(this.total / this.limit);
  }

  // Create an array of page numbers for the pagination
  get pagesArray(): number[] {
    return Array(this.totalPages).fill(0).map((_, index) => index + 1);
  }
}
