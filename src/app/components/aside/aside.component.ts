import { Component, OnInit } from '@angular/core';
import { Product, ProductCategory } from '../../types';
import { products } from '../../data'; // 👈 este es el import que faltaba
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-aside',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './aside.component.html',
  styleUrl: './aside.component.css'
})
export class AsideComponent implements OnInit {

  products: Product[] = products; // ✅ ahora ya tiene productos
  filteredProducts: Product[] = [];
  selectedCategory: string = '';

  constructor(private route: ActivatedRoute, private router: Router) {}
  
  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      const categoryKey = params.get('category') || '';

      const enumValue = ProductCategory[categoryKey as keyof typeof ProductCategory];

      if (enumValue) {
        this.selectedCategory = enumValue;
        this.filteredProducts = this.products.filter(
          product => product.category === enumValue
        );
      } else {
        this.selectedCategory = '';
        this.filteredProducts = [];
      }
    });
  }

  /* mt: redirigir al detalle del producto */
  viewDetails(productId: number) {
    this.router.navigate([`productos/${productId}`]); // Unificada para productos y categorías
  }
}