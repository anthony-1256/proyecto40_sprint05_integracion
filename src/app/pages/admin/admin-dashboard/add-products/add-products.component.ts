/***** add-products.component.ts *****/
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ProductCategory } from '../../../../types';

@Component({
  selector: 'app-add-products',
  standalone: true,
  imports: [
    ReactiveFormsModule, CommonModule
  ],
  templateUrl: './add-products.component.html',
  styleUrls: ['./add-products.component.css']
})
export class AddProductsComponent implements OnInit {

  /* on: visibilidad del usuario controlada desde fuera */
  @Input() visible: boolean = false;

  /* ar: Categorías disponibles como string[] */
  readonly productCategories: string[] = this.getProductCategories();

  /* ob: formulario reactivo */
  form: any; // lo declaramos pero no lo inicializamos aún

  constructor(private fb: FormBuilder) {}

  // mt: inicializar el formulario cuando ya existe fb
  ngOnInit(): void {
    this.form = this.fb.group({
      sku: ['', Validators.required],
      name: ['', Validators.required],
      description: ['', Validators.required],
      category: ['', Validators.required],
      storageCapacity: ['', Validators.required],
      price: [null, [Validators.required, Validators.min(0)]],
      stock: [null, [Validators.required, Validators.min(1)]],
    });
  }

  // mt: cerrar el formulario (emitirá en versión futura)
  closeForm(): void {
    this.form.reset();
  }

  // mt: agregar el producto (todavía no guarda)
  submit(): void {
    if (this.form.invalid) return;

    const newProduct = this.form.value;    
    console.log('Producto a agregar:', newProduct); // temporal
    this.form.reset();
  }

  private getProductCategories(): string[] {
    return Object.values(ProductCategory).filter(value => typeof value === 'string') as string[];
  }
}
