import { filter } from 'rxjs';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth/services/auth.services';
import { HeaderComponent } from './header/header.component';
import { CartComponent } from './shopping-cart/cart/cart.component';
import { Router, RouterOutlet, NavigationEnd } from '@angular/router';


@Component({
  selector: 'app-root',
  imports: [CommonModule, RouterOutlet, HeaderComponent, CartComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'frontend';
  showCart = true;
  constructor(
    private authService: AuthService,
    private router: Router
  ){
    this.router.events
    .pipe(filter(event => event instanceof NavigationEnd))
    .subscribe((event: any) => {
      const productList = ['/product-list'];
      this.showCart = productList.includes(event.urlAfterRedirects);
    })
  }
  ngOnInit(): void {
    this.authService.syncAuthStatus();
  }
}