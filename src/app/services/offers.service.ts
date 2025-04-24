/***** offers.service.ts *****/
import { Injectable } from '@angular/core';
import { Product } from '../types';

@Injectable({
  providedIn: 'root'
})
export class OffersService {

  private offersKey = 'productOffers';  // Clave para guardar las ofertas en localStorage

  constructor() {}

  // mt: Verifica si el producto está en oferta usando el id
  isInOffer(id: number): boolean {
    const offers = this.getOffers();
    return offers.includes(id);  // Usamos el id en lugar del SKU
  }

  // mt: Agrega o elimina un producto de las ofertas
  toggleOffer(product: Product): void {
    const offers = this.getOffers();
    const index = offers.indexOf(product.id);  // Usamos el id en lugar del SKU

    if (index === -1) {
      offers.push(product.id);  // Agregar producto a las ofertas
      alert(`Producto ${product.name} añadido a oferta.`);
    } else {
      offers.splice(index, 1);  // Eliminar producto de las ofertas
      alert(`Producto ${product.name} eliminado de oferta.`);
    }

    this.saveOffers(offers);  // Guardamos las ofertas actualizadas en localStorage
  }

  // mt: Obtiene los productos en oferta desde localStorage
  private getOffers(): number[] {
    const offers = localStorage.getItem(this.offersKey);
    return offers ? JSON.parse(offers) : [];
  }

  // mt: Guarda los productos en oferta en localStorage
  private saveOffers(offers: number[]): void {
    localStorage.setItem(this.offersKey, JSON.stringify(offers));
  }
  
}
  