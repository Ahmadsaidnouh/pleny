import { Component } from '@angular/core';
import { ProductService } from '../services/product.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  categories: any[] = [
    {name: "All", slug: ""}
  ];
  selectedCategory: string = '';

  productsToDisplay: any[] = []

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    // Fetch categories on initialization
    this.productService.getAllCategories().subscribe((response) => {
      this.categories.push(...response)
      console.log("cat = ", this.categories);
    });

    this.productService.getAllProducts().subscribe((response) => {
      this.productsToDisplay = response
      console.log("productsToDisplay = ", this.productsToDisplay);
    });
  }

  onCategoryChange(category: string): void {
    this.selectedCategory = category;
    console.log("Category = ", this.selectedCategory);
    
    if (this.selectedCategory != "") {
      this.productService.getProductsByCategory(category).subscribe((response) => {
        this.productsToDisplay = response
        console.log("productsToDisplay = ", this.productsToDisplay);
      });
    }
    else {
      this.productService.getAllProducts().subscribe((response) => {
        this.productsToDisplay = response
        console.log("productsToDisplay = ", this.productsToDisplay);
      });
    }
  }
}
