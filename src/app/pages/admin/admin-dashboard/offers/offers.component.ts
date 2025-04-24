/***** offers.component.ts *****/
import { Component, OnInit } from '@angular/core';
import { Product } from '../../../../types';
import { ProductsService } from '../../../../services/products.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

/*  */
interface OfferProduct extends Product {
  isOffer: boolean;
}

@Component({
  selector: 'app-offers',
  standalone: true,
  imports: [ CommonModule, FormsModule ],
  templateUrl: './offers.component.html',
  styleUrls: ['./offers.component.css']
})
export class OffersComponent implements OnInit {

  /* ar: productos locales con estado de oferta */
  productsWithOffer: OfferProduct[] = [];

  constructor(private productsService: ProductsService) {}

  /* mt: inicializar productos extendidos */
  ngOnInit(): void {
    // Cargar productos desde localStorage
    const allProducts = this.productsService.getAllProducts();
    const savedOffers = JSON.parse(localStorage.getItem('offers') || '[]');

    // Actualizar el estado de las ofertas con los datos guardados
    this.productsWithOffer = allProducts.map(p => {
      const savedOffer = savedOffers.find((offer: any) => offer.sku === p.sku);
      return {
        ...p,
        isOffer: savedOffer ? savedOffer.isOffer : false // estado inicial de oferta
      };
    });
  }
 
  
  // mt: alternar estado de oferta para producto individual
  toggleOffer(product: OfferProduct): void {
    product.isOffer = !product.isOffer;
    console.log(`${product.name} ahora ${product.isOffer ? 'está' : 'no está'} en oferta`);
    
    // Guardar el estado actualizado en localStorage
    this.saveOffers();
  }

  /*************************************************/  

  /*************************************************/

  /* mt: guardar el estado de las ofertas en localStorage */
  saveOffers(): void {
    const offerData = this.productsWithOffer.filter(product => product.isOffer).map(product => ({
      sku: product.sku,
      isOffer: product.isOffer
    }));
    localStorage.setItem('offers', JSON.stringify(offerData));
  }

  
}
