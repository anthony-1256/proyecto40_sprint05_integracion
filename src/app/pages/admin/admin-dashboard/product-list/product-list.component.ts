/***** product-list.component.ts *****/
import { Component, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Product } from '../../../../types';
import { ProductsService } from '../../../../services/products.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { AddProductsComponent } from '../add-products/add-products.component';


@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [ RouterModule, FormsModule, CommonModule, AddProductsComponent ],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css'
})
export class ProductListComponent {

  // ob: Array de productos actuales
  products!: Product[];

  // ob: Array copia editable de productos
  productsToEdit: Product[] = [];

  // ob: Array copia para comparar cambios
  originalProducts: Product[] = [];

  // ob: Propiedad para controlar visibilidad del formulario
  isAddFormVisible = signal(false);  // Usar signal para controlar la visibilidad del formulario

  constructor(private productsService: ProductsService) { }

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.products = this.productsService.getAllProducts();
    this.productsToEdit = JSON.parse(JSON.stringify(this.products));
    this.originalProducts = JSON.parse(JSON.stringify(this.products));
  }

  hasChanges(product: Product): boolean {
    const original = this.products.find(p => p.id === product.id);
    return JSON.stringify(product) !== JSON.stringify(original);
  }

  saveProduct(product: Product): void {
    this.productsService.updateProduct(product);
    this.products = this.productsService.getAllProducts();
    this.productsToEdit = [...this.products];
  }

  deleteProduct(id: number): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción eliminará el producto de forma permanente.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then(result => {
      if (result.isConfirmed) {
        this.productsService.deleteProduct(id);
        this.loadProducts();
      }
    });
  }

  onDelete(productId: number): void {
    this.productsService.deleteProduct(productId);
    this.products = this.productsService.getAllProducts();
    this.productsToEdit = [...this.products];
  }

  onEdit(productId: number): void {
    this.productsService.getProductByID(productId);
  }

  // Alternar visibilidad del formulario flotante
  onToggleAddProductForm(): void {
    console.log("Antes de cambiar:", this.isFormVisible);  // Verifica el valor antes de cambiarlo
    this.isAddFormVisible.set(!this.isAddFormVisible());  
    console.log("Después de cambiar:", this.isFormVisible);  // Verifica el valor después de cambiarlo
  }

  get isFormVisible(): boolean {
    return this.isAddFormVisible();
  }

  // Método track para optimizar el seguimiento de productos
  trackProduct(index/*error en index, corregir en coherencia, desde donde viene este error*/ : number, product: Product): number {
    return product.id;  // Usamos el id para identificar de forma única cada producto
  }
}