/* login-form.component.ts */
import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-login-form',
  standalone: true,
  imports: [ CommonModule, ReactiveFormsModule ],
  templateUrl: './login-form.component.html',
  styleUrl: './login-form.component.css'
})
export class LoginFormComponent implements OnInit{

  private fb = inject(FormBuilder); // fb: (fn) FormBuilder
  private router = inject(Router); // router: (fn) Router
  private auth = inject(AuthService); // auth: (ob) AuthService

  form: FormGroup = this.fb.group({ // form: (ob) FormGroup
    username: ['', Validators.required], // username: (ar) Validators
    password: ['', Validators.required]  // password: (ar) Validators
  });

  
  /* crear usuarios estandar */
  ngOnInit(): void {
    
  }
  
  // fn: login
  login(): void {
    const { username, password } = this.form.value;
  
    const user = this.auth.user.find(u => u.username === username && u.password === password);
  
    if (!user) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Credenciales inválidas'
      });
      return;
    }
  
    this.auth.setUser(user);
  
    Swal.fire({
      icon: 'success',
      title: 'Bienvenido',
      text: `Hola ${user.username}`
    }).then(() => {
      const pendingProduct = localStorage.getItem('pendingProduct');
  
      if (pendingProduct) {
        const { id } = JSON.parse(pendingProduct);
        // Redirigir al detalle del producto pendiente
        this.router.navigateByUrl(`/products/${id}`);
        return;
      }
  
      if (user.admin) {
        this.router.navigateByUrl('/admin');
      } else {
        this.router.navigateByUrl('/perfil');
      }
    });
  }
  
  // fn: onLogin
  onLogin(): void {
    this.login(); // Llama a la función login() cuando el formulario es enviado
  }
}