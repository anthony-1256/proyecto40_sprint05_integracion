/***** products.service.ts *****/
import { Injectable } from '@angular/core';
import { Product } from '../types';
import { products as defaultProducts } from '../data';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  getAll() {
    throw new Error('Method not implemented.');
  }

  color: string = '#3E3F5B';
  bg_color: string = '#BAB2A6 ';

  private readonly STORAGE_KEY = 'products_data';

  constructor() {}

  /* ob: getter con fallback a productos por defecto */
  private get products(): Product[] {
    const data = localStorage.getItem(this.STORAGE_KEY);

    if ( data ) {
      return JSON.parse(data);
    }
    
    /* inicializa una sola vez los productospor defecto */
    const initializedData = [...defaultProducts]; /* evita muatr el original */
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(initializedData));
    return initializedData;
  }
  
  /* ob: setter de productos */
  private set products( value: Product[] ) {
    localStorage.setItem( this.STORAGE_KEY, JSON.stringify(value));
  }
  
  /* mt: obtener todos los productos */
  public getAllProducts(): Product[] {
    return this.products;
  }
  
  /* mt: Obtener un producto por ID */
  public getProductByID( id: number): Product | undefined {
    return this.products.find( product => product.id === id );
  }

  /*** mt: agregar nuevo producto ***/
  public addProduct( newProduct: Product ): void {

    const currentProducts = this.products;
    this.products = [ ...currentProducts, newProduct ];
    Swal.fire({
      text: "Producto Agregado",
      icon: "success",
      confirmButtonColor: this.color
    });
  }

  /* mt: actualizar un producto */
  public updateProduct( updatedProduct: Product ): void {
    const currentProducts = this.products;
    const productIndex = currentProducts.findIndex( product => product.id === updatedProduct.id );
    
    if (productIndex !== -1) {

      currentProducts[ productIndex ] = updatedProduct;
      this.products = [ ...currentProducts ];

      Swal.fire({
        text: "Producto Actualizado",
        icon: "success",
        confirmButtonColor: this.color        
      });
    }
  }

  /* Eliminar un producto */
  public deleteProduct( id: number ): void {
    const currentProducts = this.products;
    const updatedProducts = currentProducts.filter( product => product.id !== id);
    this.products = updatedProducts;
    Swal.fire({
      title: 'Producto Eliminado',
      icon: 'success',
      confirmButtonColor: this.color
    });
  }
  
}