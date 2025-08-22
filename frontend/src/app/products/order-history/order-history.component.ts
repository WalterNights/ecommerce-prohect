import { OrderService } from './order.service';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-order-history',
  imports: [CommonModule],
  standalone: true,
  templateUrl: './order-history.component.html',
  styleUrls: ['./order-history.component.scss']
})
export class OrderHistoryComponent implements OnInit {
  orders: any[] = [];

  constructor(private orderService: OrderService) { }

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders() {
    this.orderService.getOrderHistory().subscribe({
      next: (res: any) => this.orders = res.orders,
      error: err => console.error(err)
    });
  }

  getOrderTotal(order: any): number {
    return order.OrderItems?.reduce((
      sum: number, item: any) => sum + item.price * item.quantity, 0) || 0;
  }
}