import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { CartService } from '../services/cart.service';
import { SearchService } from '../services/search.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  user: any;
  isLoggedIn: boolean = false;
  cartCount = 3;
  searchText: string = '';

  constructor(private auth: AuthService, private cartService: CartService, private searchService: SearchService) { }
  
  ngOnInit(): void {
    this.auth.userData.subscribe(() => {
      if (this.auth.userData.getValue() != null) {
        this.isLoggedIn = true;
        this.user = this.auth.userData.getValue();
      }
      else {
        this.isLoggedIn = false;
      }
    })

    this.cartService.cartItemsSubject.subscribe(() => {
      this.cartCount = this.cartService.cartItemsSubject.getValue().length;
    })

    this.searchService.resetTextSubject.subscribe(() => {
      const searchInput = document.querySelector(".search-input input") as HTMLInputElement;
      if (searchInput) {
        searchInput.value = "";
      }
    });
  }

  onSearchChange(event: any): void {
    this.searchService.setSearchText(event.target.value);
  }

  logOut() {
    this.auth.logOut();
  }
}
