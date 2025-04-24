/***** home.component.ts *****/
import { Component, OnInit } from '@angular/core';
import { Product } from '../../../types';
import { ProductsService } from '../../../services/products.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ CommonModule, FormsModule ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  /* ar: productos en oferta */
  offerProducts: Product[] = [];

  constructor(
    private productsService: ProductsService,
    private router: Router,
  ) {}

  // mt: cargar productos con flag de oferta desde localStorage
  private loadOfferProducts(): void {
    // Verifica si 'products' existe en localStorage
    const allProducts = this.productsService.getAllProducts(); // tu método real para obtener los productos
    const savedOffers = JSON.parse(localStorage.getItem('offers') || '[]');
    
    console.log('Productos cargados:', allProducts); // Para verificar si están llegando
    console.log('Ofertas guardadas:', savedOffers); // Para verificar si existen ofertas

    if (savedOffers.length === 0) {
      console.warn('No hay ofertas guardadas en localStorage.');
    }

    // Filtra los productos en oferta
    this.offerProducts = allProducts.filter(p => 
      savedOffers.some((offer: any) => offer.sku === p.sku && offer.isOffer)
    );
    
    console.log('Productos en oferta:', this.offerProducts); // Verificar los productos que se deben mostrar
  }

  toggleOffer(product: Product): void {
    const offers = JSON.parse(localStorage.getItem('offers') || '[]');
    const index = offers.findIndex((p: any) => p.id === product.id);
  
    if (index > -1) {
      offers.splice(index, 1);
    } else {
      offers.push({ id: product.id, sku: product.sku, isOffer: true });
    }
  
    localStorage.setItem('offers', JSON.stringify(offers));
    this.loadOfferProducts(); // recargar productos visibles
  }

  ngOnInit(): void {
    this.loadOfferProducts(); // Cargar productos en oferta al iniciar
  }
  /* mt: redirige a la vista detalle del producto */  
  viewDetails( productId: number ): void {
    this.router.navigate([`productos/${productId}`])
  }
}
