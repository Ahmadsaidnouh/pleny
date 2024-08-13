import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  cartItemsSubject = new BehaviorSubject<number[]>([]);
  public cartItems$ = this.cartItemsSubject.asObservable();

  private cartItems: number[] = [];

  constructor() {}

  // Add product to the cart
  addToCart(productId: number): void {
    if (!this.cartItems.includes(productId)) {
      this.cartItems.push(productId);
      this.cartItemsSubject.next(this.cartItems);
    }
  }

  // Remove product from the cart
  removeFromCart(productId: number): void {
    this.cartItems = this.cartItems.filter(id => id !== productId);
    this.cartItemsSubject.next(this.cartItems);
  }

  // Check if a product is in the cart
  isInCart(productId: number): boolean {
    return this.cartItems.includes(productId);
  }

  // Get cart item count
  getCartItemCount(): number {
    return this.cartItems.length;
  }
}
