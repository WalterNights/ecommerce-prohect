import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { CartService, CartItem } from '../cart.service';
import { environment } from '../../../environment/environment';

@Component({
  selector: 'app-cart',
  imports: [CommonModule],
  standalone: true,
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent {

  cartItems: CartItem[] = []
  total = 0;

  constructor(private cartService: CartService, private http: HttpClient) { }

  ngOnInit() {
    this.cartService.cart$.subscribe(items => {
      this.cartItems = items;
      this.total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
    });
  }

  remove(id: number) {
    this.cartService.removeFromCart(id);
  }

  clear() {
    this.cartService.clearCart();
  }

  checkout() {
    const items = this.cartItems.map(item => ({ 
      id: item.id, 
      quantity: item.quantity 
    }));
    console.log(items)
    if(items.length === 0) {
      alert('No tienes nada en el carrito de compras');
    } else{
      this.http.post(`${environment.apiUrl}/orders`, { items }).subscribe({
        next: (res: any) => {
          console.log('Orden creada:', res.order);
          this.cartService.clearCart();
          alert('Orden creada correctamente!');
        },
        error: err => {
          console.error(err);
          alert('Tienes mas cantidad de un producto que la disponible en nuestro inventario');
        }
      });
    }
  }
}