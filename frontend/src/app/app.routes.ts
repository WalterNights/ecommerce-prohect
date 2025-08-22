import { Routes } from '@angular/router';
import { AutoGuard } from './auth/auto.guard';
import { AuthModule } from './auth/auth.module';
import { HomeComponent } from './home/home.component';
import { ProductsListComponent } from './products/products-list/products-list.component';
import { OrderHistoryComponent } from './products/order-history/order-history.component';
import { ProductCreateComponent } from './products/products-create/products-create.component';

export const routes: Routes = [
    { path: '', component: HomeComponent, canActivate: [AutoGuard] },
    { path: 'auth', loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule) },
    { path: 'product-create', component: ProductCreateComponent, canActivate: [AutoGuard] },
    { path: 'product-list', component: ProductsListComponent, canActivate: [AutoGuard] },
    { path: 'order-history', component: OrderHistoryComponent, canActivate: [AutoGuard] },
    { path: '**', redirectTo: '' }
];