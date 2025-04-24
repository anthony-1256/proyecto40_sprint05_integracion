import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { User } from '../../../../models/users';
import { AuthService } from '../../../../services/auth.service';
import Swal from 'sweetalert2';
import { FormsModule } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [ CommonModule, FormsModule ],
  templateUrl: './user-management.component.html',
  styleUrl: './user-management.component.css'
})
export class UserManagementComponent implements OnInit {

  /* ob = Emisor para registrar usuario desde componente padre */
  @Output() onRegister = new EventEmitter<User>();

  /* ob: modo individual */
  @Input() singleUserMode = false;

  /* ob: usuario actual recibido desde componente padre */
  @Input() userData!: User;

  /* ob = Arreglo local de usuarios */
  users: User[] = [];
  originalUsers: User[] = [];
  
  /* ob = Inyección del servicio de autenticación */
  private authService = inject(AuthService);

  /* ob: señal del usuario actual (reactiva) */
  currentUser = toSignal(this.authService.currentUser$);

  /* mt = al iniciar el componente, cargamos la lista de usuarios */
  ngOnInit(): void {
    if ( this.singleUserMode && this.userData ) {
      
      /* mt: carga de usuario unico */
      this.users = [this.userData];
      this.originalUsers = [JSON.parse(JSON.stringify(this.userData))];
    } else {
      this.loadUsers();
    }
  }

  /* mt = Obtener usuarios desde el servicio */
  loadUsers(): void {
    this.users = this.authService.user;
    this.originalUsers = JSON.parse(JSON.stringify(this.users)); // Clon profundo
  }

  hasChanges( user: User ): boolean {
    const original = this.originalUsers.find( u => u.id === user.id );
    return JSON.stringify(user) !== JSON.stringify(original);
  }

  /* mt = Eliminar un usuario por su ID con confirmación */
  deleteUser( id: number ): void {
    Swal.fire({
      title: '¿Estas seguro?',
      text: 'Esta accion eliminara el usuario de manera permanente',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si, eliminar',
      cancelButtonText: 'Cancelar',
    }).then( result => {
      if( result.isConfirmed ) {

        /* fn = Filtrar usuarios sin el ID eliminado */
        this.users = this.users.filter( user => user.id !== id );
        this.authService.user = this.users;

        Swal.fire({
          text: 'Usuario eliminado correctamente',
          icon: 'success',
          color: this.authService.colorText,
          background: this.authService.colorBg,
        });
      }
    });
  }

  makeAdmin( user: User ): void {
    user.admin = true;
    this.authService.user = [...this.users];
    Swal.fire({
      text: 'El usuario ahora es administrador',
      icon: 'success',
      color: this.authService.colorText,
      background: this.authService.colorBg,
    });
  }

  removeAdmin( user: User ): void {
    user.admin = false;
    this.authService.user = [...this.users];

    Swal.fire({
      text: 'Rol de administrador removido',
      icon: 'info',
      color: this.authService.colorText,
      background: this.authService.colorBg,
    });
  }

  saveUser( user: User ): void {
    this.authService.updateUser(user);
  }
}