import { Component, OnInit } from '@angular/core';
import { User } from '../../../../models/users';
import { AuthService } from '../../../../services/auth.service';
import { Router, RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-edit-profile',
  imports: [ FormsModule, CommonModule ],
  templateUrl: './edit-profile.component.html',
  styleUrl: './edit-profile.component.css'
})
export class EditProfileComponent implements OnInit {

  /* ob = Usuario actual */
  currentUser: User = {
    id: 0,
    name: '',
    age: 0,
    gender: '',
    email: '',
    username: 'Invitado',
    password: '',
    admin: false,
    paymentMethods: [],
    deliveryAddresses: []
  };

  /* mt = Constructor para inyección de dependencias */
  constructor(private authService: AuthService, private router: Router) {}

  /* mt = Inicialización del componente */
  ngOnInit() {
    // Verificar si el usuario está logeado
    this.authService.currentUser$.subscribe(user => {
      if (user) {
        this.currentUser = { ...user };
      } else {
        this.router.navigate(['/auth/login']); // Redirigir a login si no está logeado
      }
    });
  }

  /* mt = Guardar los cambios de perfil */
  saveProfileChanges() {
    if (
      !this.currentUser.name.trim() ||      
      !this.currentUser.email.trim() ||
      !this.currentUser.username.trim()
    ) {
      Swal.fire({
        icon: 'warning',
        title: 'Campos obligatorios',
        text: 'Por favor completa nombre, email y nombre de usuario.',
        color: '#000',
        background: '#fff'
      });
      return;
    }

    this.authService.updateUser(this.currentUser);Swal.fire({
      icon: 'success',
      title: 'Perfil actualizado',
      text: 'Los cambios se guardaron correctamente.',
      color: '#000',
      background: '#fff'
    }).then(() => {
      this.router.navigate(['/perfil']);
    });
  }

  /* mt = Cancelar la edición y volver al perfil */
  cancel() {
    this.router.navigate(['/perfil']);
  }
}