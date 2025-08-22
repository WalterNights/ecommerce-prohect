import { BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';

export interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

const CART_KEY = 'cart_items';

@Injectable({
  providedIn: 'root'
})

export class CartService {
  private cartItems: CartItem[] = [];
  private cartSubject = new BehaviorSubject<CartItem[]>([]);
  cart$ = this.cartSubject.asObservable();

  constructor() {
    this.loadCart();
  }

  private loadCart() {
    const savedCart = localStorage.getItem(CART_KEY);
    if (savedCart) {
      this.cartItems = JSON.parse(savedCart);
      this.cartSubject.next(this.cartItems);
    }
  }

  private saveCart() {
    localStorage.setItem(CART_KEY, JSON.stringify(this.cartItems));
    this.cartSubject.next(this.cartItems);
  }

  addToCart(item: CartItem) {
    const existing = this.cartItems.find(ci => ci.id === item.id);
    if (existing) {
      existing.quantity += item.quantity;
    } else {
      this.cartItems.push({ ...item });
    }
    this.saveCart();
  }

  removeFromCart(itemId: number) {
    this.cartItems = this.cartItems.filter(ci => ci.id !== itemId);
    this.saveCart();
  }

  clearCart() {
    this.cartItems = [];
    this.saveCart();
  }

  getTotal() {
    return this.cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }
}