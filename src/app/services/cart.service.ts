// ob - Servicio para manejar el carrito con autenticación real
import { Injectable } from '@angular/core';
import { CartItem, Product } from '../types';
import Swal from 'sweetalert2';
import { AuthService } from './auth.service'; // << Agregado


@Injectable({
  providedIn: 'root'
})
export class CartService {

  // mt - Constructor con AuthService inyectado
  constructor(private authService: AuthService) {}

  /* mt: Obtener el carrito de un usuario específico */
  getCart(): CartItem[] {
    const userId = this.authService.getUser().id; // Obtener el ID del usuario
    const stored = localStorage.getItem(`cart_user_${userId}`);
    return stored ? JSON.parse(stored) : [];
  }

  /* mt: Guardar el carrito de un usuario específico */
  private saveCart(products: CartItem[]): void {
    const userId = this.authService.getUser().id; // Obtener el ID del usuario
    localStorage.setItem(`cart_user_${userId}`, JSON.stringify(products));
  }

  /* mt: Agregar producto al carrito con validación real de login */
  addToCart(product: Product, quantity: number): void {
    if (!this.authService.isLoggedIn()) {
      Swal.fire({
        icon: 'warning',
        title: 'Inicia sesión',
        text: 'Debes iniciar sesión para agregar productos al carrito.',
        confirmButtonText: 'OK'
      });
      return;
    }

    const cart = this.getCart(); // Obtener el carrito del usuario
    const newItem: CartItem = { ...product, quantity };
    cart.push(newItem); // Agregar el nuevo producto

    this.saveCart(cart); // Guardar el carrito actualizado

    Swal.fire({
      icon: 'success',
      title: 'Agregado al carrito',
      text: `${product.name} fue añadido al carrito.`,
      timer: 2000,
      showConfirmButton: false
    });
  }

  /* mt: actualizar el carrito con una nueva lista de productos */
  updateCart( updatedCart: (Product & { quantity: number })[]): void {
    const userId = this.authService.getUser().id;
    localStorage.setItem(`cart_user_${userId}`, JSON.stringify(updatedCart));
  }
}