/***** products.component.ts *****/
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Product } from '../../types';
import { ProductsService } from '../../services/products.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [ CommonModule ],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css'
})
export class ProductsComponent implements OnInit {

  /* ob: listado de productos para visualizar */
  products: Product[] = [];
  filteredProducts: Product[] = [];

  constructor(
    private productsService: ProductsService,
    private router: Router,
    private route: ActivatedRoute /* ob: acceso a queryparams */
  ) {}

  /* mt: se cargan productos al iniciar */
  ngOnInit(): void {
    this.products = this.productsService.getAllProducts();
    this.route.queryParams.subscribe(params => {
      const searchTerm = params['search'] || '';  // ob: obtener parámetro de búsqueda
      this.filteredProducts = this.filterProducts(searchTerm);
    });
  }

  /* mt: función para filtrar productos según búsqueda */
  filterProducts(query: string): Product[] {
    if (!query.trim()) return this.products; // si no hay búsqueda, mostrar todos los productos
    return this.products.filter(product => 
      product.name.toLowerCase().includes(query.toLowerCase())
    );
  }

  /* mt: redirige a la vista detalle del producto */
  viewDetails( productId: number ): void {
    this.router.navigate([`productos/${productId}`]);
  }
}