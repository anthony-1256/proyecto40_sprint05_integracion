import { Routes } from '@angular/router';
import { ProductsComponent } from './pages/products/products.component';
import { HomeComponent } from './pages/home/home/home.component';
import { AuthPageComponent } from './pages/auth/auth-page/auth-page.component';
import { ShoppingCartComponent } from './pages/profile/profile/shopping-cart/shopping-cart.component';
import { ProfileComponent } from './pages/profile/profile/profile.component';
import { AdminDashboardComponent } from './pages/admin/admin-dashboard/admin-dashboard.component';
import { LoginFormComponent } from './components/form/login-form/login-form.component';
import { RegisterFormComponent } from './components/form/register-form/register-form.component';
import { ProductListComponent } from './pages/admin/admin-dashboard/product-list/product-list.component';
import { UserManagementComponent } from './pages/admin/admin-dashboard/user-management/user-management.component';
import { AsideComponent } from './components/aside/aside.component';
import { AdminComponent } from './pages/admin/admin.component';
import { OffersComponent } from './pages/admin/admin-dashboard/offers/offers.component';
import { ProductDetailComponent } from './pages/products/product-detail/product-detail.component';

export const routes: Routes = [

  /** GUEST + USER **/
  { path: '', component: HomeComponent, title: 'Inicio' },
  { path: 'inicio', component: HomeComponent, title: 'Inicio' },

  { path: 'productos', component: ProductsComponent, title: 'Inventario disponible' },
  { path: 'productos/:id', component: ProductDetailComponent, title: 'Detalle del producto' }, // Ruta común para detalles
  { path: 'categoria/:category', component: AsideComponent, title: 'Categoría de producto' },

  /** LOGIN / REGISTER **/
  {
    path: 'auth',
    component: AuthPageComponent,
    children: [
      { path: 'login', component: LoginFormComponent, title: 'Iniciar sesión' },
      { path: 'register', component: RegisterFormComponent, title: 'Registrarse' },
    ]
  },

  /** USUARIO AUTENTICADO **/
  {
    path: 'perfil',
    component: ProfileComponent,
    title: 'Perfil de usuario',
    children: [
      { path: 'carrito', component: ShoppingCartComponent, title: 'Carrito de compras' },
      { path: 'editar', loadComponent: () => import('./pages/profile/profile/edit-profile/edit-profile.component').then(m => m.EditProfileComponent), title: 'Editar perfil' },
      { path: 'pagos', loadComponent: () => import('./pages/profile/profile/payment-methods/payment-methods.component').then(m => m.PaymentMethodsComponent), title: 'Métodos de pago' },
      { path: 'direcciones', loadComponent: () => import('./pages/profile/profile/address-management/address-management.component').then(m => m.AddressManagementComponent), title: 'Direcciones de entrega' },
    ]
  },

  /** ADMINISTRADOR **/
  { path: 'admin', component: AdminComponent, title: 'Administrador' },
  {
    path: 'admin-dashboard',
    component: AdminDashboardComponent,
    title: 'Panel de administración',
    children: [
      { path: 'inventory', component: ProductListComponent, title: 'Inventario' },
      { path: 'offers', component: OffersComponent, title: 'Ofertas' },
      { path: 'usersAdmin', component: UserManagementComponent, title: 'Usuarios' }
    ]
  },

  /** PRODUCTOS COMPLETOS **/
  {
    path: 'Products', component: ProductsComponent,
    title: 'Detalle de prducto',
    children: [
      { path: 'Details', component: ProductDetailComponent, title: 'Detalles' }
    ]
  
  },

  /** PRODUCTOS POR CATEGORIA **/
  { path: 'categoria/:category', component: AsideComponent, title: 'Productos por categoria' },

  /** RUTA INVÁLIDA **/
  { path: '**', redirectTo: '', pathMatch: 'full' }

];