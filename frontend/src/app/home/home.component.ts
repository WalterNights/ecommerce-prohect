import { Router } from '@angular/router';
import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  imports: [CommonModule],
  standalone: true,
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  apiResponse: any = null;

  constructor(private http: HttpClient, private router: Router) { }

  goToProductCreate() {
    this.router.navigate(['product-create']);
  }

  goToProductList() {
    this.router.navigate(['product-list']);
  }

  goToOrderHistory() {
    this.router.navigate(['order-history']);
  }

  testEndpoint(endpoint: string) {
    this.apiResponse = 'Cargando...';
    this.http.get(`http://localhost:3000/api/${endpoint}`).subscribe({
      next: (res) => this.apiResponse = res,
      error: (err) => this.apiResponse = err.error || err.message
    });
  }
}