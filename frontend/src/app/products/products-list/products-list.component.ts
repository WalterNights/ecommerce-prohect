import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environment/environment';
import { CartService, CartItem } from '../../shopping-cart/cart.service';

interface Product {
  id: number;
  name: string;
  batch_number: string;
  price: number;
  stock: number;
  date_in: string;
}

@Component({
  selector: 'app-products-list',
  imports: [CommonModule],
  templateUrl: './products-list.component.html',
  styleUrls: ['./products-list.component.scss']
})

export class ProductsListComponent {
  products: Product[] = [];
  loading = true;
  error: string = '';

  constructor(
    private http: HttpClient,
    private cartService: CartService
  ) { }

  ngOnInit() {
    this.http.get<any>(`${environment.apiUrl}/products`).subscribe({
      next: (res) => {
        if (res.success) {
          this.products = res.data || [];
        } else {
          this.error = 'No se pudieron cargar los productos';
        }
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.error = 'Error al obtener los productos';
        this.loading = false;
      }
    });
  }

  addToCart(product: Product) {
    const item: CartItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1
    }
    this.cartService.addToCart(item);
  }
}