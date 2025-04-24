import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Product } from '../../../types';
import { ProductsService } from '../../../services/products.service';
import Swal from 'sweetalert2';
import { AuthService } from '../../../services/auth.service';
import { CartService } from '../../../services/cart.service';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [ CommonModule, FormsModule, RouterModule ],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.css'
})
export class ProductDetailComponent {

  /* ob: producto actual cargado desde el servicio */
  product!: Product;

  /* ob: cantidad seleccionada por el usuario */
  quantity: number = 1;  

  constructor(
    private route: ActivatedRoute,
    private productsService: ProductsService,
    private authService: AuthService,
    private cartService: CartService, /* ob: servicio de carrito */
    private router: Router    
  ) {}

  /* mt: inicializar y obtener producto por ID */
  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
  
    const foundProduct = this.productsService.getProductByID(id);
    if (foundProduct) {
      this.product = foundProduct;
    }

    // mt: detectar si hay producto pendiente por agregar después del login
  const pending = localStorage.getItem('pendingProduct');
  if (pending) {
    const { id: pendingId, quantity: pendingQuantity } = JSON.parse(pending);
    if (pendingId === this.product.id) {
      this.quantity = pendingQuantity;
      this.addToCart(true); // true: indica que viene del login
      localStorage.removeItem('pendingProduct');
    }
  }
}
  /* fn: calcula el maximo permitido para la cantidad */
  getMaxQuantity(): number {
    return Math.min(10, this.product.quantity);
  }

  /* fn: calcula el precio total en vivo */
  getTotalPrice(): number {
    return this.product.price * this.quantity;
  }

  /* mt: agregar al carrito con validacion y swal */
  addToCart(fromLogin: boolean = false): void {
    if (!this.authService.isLoggedIn()) {
      Swal.fire({
        icon: 'warning',
        title: 'Necesitas iniciar sesión',
        text: 'Inicia sesión para agregar productos al carrito.',
        confirmButtonText: 'Iniciar sesión',
        showCancelButton: true        
      }).then(result => {
        if (result.isConfirmed) {
          localStorage.setItem('pendingProduct', JSON.stringify({
            id: this.product.id,
            quantity: this.quantity
          }));

          this.router.navigate(['/login']).then(() => {
            Swal.fire({
              icon: 'info',
              title: '¡Listo!',
              text: `${this.product.name} x${this.quantity} fue enviado al carrito.`,
            });
          });
        }
      });
      return;
    }

    if (this.quantity > this.product.quantity) {
      Swal.fire({
        icon: 'error',
        title: 'inventario insuficiente',
        text: `Solo hay ${this.product.quantity} unidades disponibles.`,
      });
      return;
    }

    // Aquí irá la lógica real para agregar al carrito
    // TODO: implementar servicio de carrito y agregar producto
    this.cartService.addToCart(this.product, this.quantity);

    if (!fromLogin) {
      Swal.fire({
        icon: 'success',
        title: 'Producto agregado',
        text: `${this.product.name} x${this.quantity} fue agregado al carrito.`,
      });
    }
  }
}
