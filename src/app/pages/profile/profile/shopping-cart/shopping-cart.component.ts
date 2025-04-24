import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CartItem, Product } from '../../../../types';
import { CartService } from '../../../../services/cart.service';
import Swal from 'sweetalert2';
import { AuthService } from '../../../../services/auth.service';

@Component({
  selector: 'app-shopping-cart',
  standalone: true,
  imports: [ CommonModule, FormsModule, RouterModule ],
  templateUrl: './shopping-cart.component.html',
  styleUrl: './shopping-cart.component.css'
})
export class ShoppingCartComponent implements OnInit {

  /* ar: productos en el carrito */
  cartItems: CartItem[] = [];

  constructor(
    private cartService: CartService,
    private router: Router,
    private authService: AuthService
  ) {}

  /* mt: inicializa y carga el carrito del usuario */
  ngOnInit(): void {
    this.cartItems = this.cartService.getCart();
  }

  /* fn: calculo total por producto */
  getItemTotal( item: CartItem): number {
    return item.price * item.quantity;
  }

  /* fn: calcula el total general */
  getCartTotal(): number {
    return this.cartItems.reduce((total, item) => total + this.getItemTotal(item), 0);
  }

  /* mt: actualizar cantidad respetando limites */
  updateQuantity( item: CartItem, value: number ): void {
    const newQuantity = Math.min(10, Math.max(1, value));
    item.quantity = newQuantity;
    this.cartService.updateCart(this.cartItems); /*  */
  }
  
  /* mt: redirigir a productos */
  goToProducts(): void {
    this.router.navigate(['/productos']);
  }

  /* mt: eliminar un producto por referencia */
  removeItemByRef( item: Product & { quantity: number }): void {
    this.cartItems = this.cartItems.filter( p => p !== item );
    this.cartService.updateCart(this.cartItems);
  }

  /* mt: Manejar el cambio de cantidad con conversion segura */
  onQuantityChange( event: Event, item: Product & { quantity: number }): void {
    const input = event.target as HTMLInputElement;
    const value = parseInt( input.value, 10 );
    this.updateQuantity( item, value );
  }

  confirmPurchase(): void {
    if ( this.cartItems.length === 0 ) {
      Swal.fire('tu carrito esta vacío', 'Agrega productospara poder comprar', 'info');
      return;
    }
    Swal.fire({
      title: '¿Confirmar compra?',
      text: 'Esta acción no se puede deshacer',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, comprar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#198754',
    }).then((result) => {
      if (result.isConfirmed) {
        this.validateShippingAndCheckout();
      }
    });
  }

  validateShippingAndCheckout(): void {
    const total = this.getCartTotal();

    /* Monto minimo para envio */
    const minimoEnvio = 1000;

    if ( total >= minimoEnvio ) {
      Swal.fire({
        title: '¿Confirmar compra?',
        text: 'Tu compra aplica para envío a domicilio.',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Sí, comprar',
        cancelButtonText: 'Cancelar'
      }).then(result => {
        if(result.isConfirmed) {
          this.finalizePurchase(false); /* Enviar a domicilio */
        }
      });
    } else {
      Swal.fire({
        title: 'Monto insuficiente para envío',
        text: `El total es $${total.toFixed(2)}. Puedes recoger en tienda o agregar más productos.`,
        icon: 'info',
        showCancelButton: true,
        confirmButtonText: 'Recoger en tienda',
        cancelButtonText: 'Agregar más productos'
      }).then( result => {
        if (result.isConfirmed) {
          this.finalizePurchase(true); /* recoger en tienda */
        }
      });
    }
  }

  finalizePurchase( recogerEnTienda: boolean = false ): void {

    const user =this.authService.getUser();

    const faltaDireccion = user.deliveryAddresses.length === 0;
    const faltaMetodo = user.paymentMethods.length === 0;
    
    if ( faltaDireccion || faltaMetodo ) {
      this.askForMissingData( faltaDireccion, faltaMetodo, recogerEnTienda );
      return;
    }
    
    this.confirmSuccess(recogerEnTienda);
  }

  /* fn: Mostrar formulario de datos faltantes */
  askForMissingData( faltaDireccion: boolean, faltaMetodo: boolean, recogerEnTienda: boolean ): void {
    const htmlForm = `
      ${faltaMetodo ? `<input id="payment" class="swal2-input" placeholder="Método de pago (ej: Visa 1234)">` : ''}
      ${faltaDireccion ? `<input id="address" class="swal2-input" placeholder="Dirección de entrega">` : ''}
    `;

    Swal.fire({
      title: 'Completa tus datos',
      html: htmlForm,
      showCancelButton: true,
      confirmButtonText: 'Guardar y continuar',
      cancelButtonText: 'Cancelar',
      preConfirm: () => {
        const newPayment = (document.getElementById('payment') as HTMLInputElement)?.value.trim();
        const newAddress = (document.getElementById('address') as HTMLInputElement)?.value.trim();

        // Validación estricta si se requieren los campos
        if (faltaMetodo && !newPayment) {
          Swal.showValidationMessage('Debes ingresar el método de pago');
          return;
        }
        if (faltaDireccion && !newAddress) {
          Swal.showValidationMessage('Debes ingresar una dirección de entrega');
          return;
        }

        return { newPayment, newAddress };
      }
    }).then(result => {
      if (result.isConfirmed && result.value) {
        const { newPayment, newAddress } = result.value;
        this.saveProfileData(newPayment, newAddress, recogerEnTienda);
      }
    });
  }

  /* fn: Guardar datos en perfil de usuario */
  saveProfileData( payment: string, address: string, recogerEnTienda: boolean ): void {
    const user = this.authService.getUser();
    
    if ( payment ) {
      user.paymentMethods = user.paymentMethods || [];

      const newMethod = {
        id: Date.now(), // o una lógica más sofisticada
      type: 'Tarjeta',
      cardNumber: payment,
      expiry: '12/30' // Por defecto, o pedirlo en el formulario después        
      };

      user.paymentMethods.push(newMethod);
    }

    if (address) {
      user.deliveryAddresses = user.deliveryAddresses || [];
  
      const newAddress = {
        id: Date.now(),
        alias: 'Dirección agregada',
        street: address,
        city: 'Sin ciudad', // Temporal, o pedirlo luego
        zip: '0000' // Temporal, o pedirlo luego
      };
  
      user.deliveryAddresses.push(newAddress);
    }
  
    this.authService.updateUser(user);
    this.confirmSuccess(recogerEnTienda);
  }


  /* fn: Confirmación de compra */
  confirmSuccess( recogerEnTienda: boolean ): void {
    if (recogerEnTienda) {
      Swal.fire( 'Compra realizada', 'Puedes recoger tus productos en tienda', 'success' );
    } else {
      Swal.fire( 'Compra realizada', 'Gracias por tu compra. Será enviada a domicilo.', 'success' );
    }
  }

}