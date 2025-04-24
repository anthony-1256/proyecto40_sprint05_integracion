/* ob = Importaciones */
import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/users';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [ CommonModule, RouterLink, FormsModule ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {

  @Output() searchTermChange = new EventEmitter<string>();

  /* ob: Término de búsqueda */
  searchTerm: string = '';

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

  /* ob = Tipo de usuario */
  userType: 'admin' | 'user' | 'guest' = 'guest';

  /* ob = Modo oscuro activado */
  isDarkMode: boolean = false;

  /* ob = Suscripciones activas */
  private subscriptions: Subscription[] = [];

  /* mt = Constructor para inyección de dependencias */
  constructor(private authService: AuthService, private router: Router) {}

  /* mt = Inicialización del componente */
  ngOnInit() {
    this.subscriptions.push(
      this.authService.userType$.subscribe(type => {
        this.userType = type;
      }),
      this.authService.currentUser$.subscribe(user => {
        this.currentUser = {
          ...user,
          paymentMethods: user.paymentMethods ?? [],
          deliveryAddresses: user.deliveryAddresses ?? []
        };
      })
    );

    /* modo oscuro */
    const savedMode = localStorage.getItem('mode');
    if (savedMode === 'dark') {
      document.body.classList.add('dark-mode');
      this.isDarkMode = true;
    } else {
      document.body.classList.add('clear-mode');
      this.isDarkMode = false;
    }
  }

  /* mt = Alternar modo claro/oscuro */
  toggleMode() {
    const body = document.body;

    if (this.isDarkMode) {
      body.classList.remove('dark-mode');
      body.classList.add('clear-mode');
      localStorage.setItem('mode', 'clear');
      this.isDarkMode = false;
    } else {
      body.classList.remove('clear-mode');
      body.classList.add('dark-mode');
      localStorage.setItem('mode', 'dark');
      this.isDarkMode = true;
    }
  }

  /* mt = Cerrar sesión y resetear estado */
  logout(): void {
    this.authService.logout();
    this.currentUser = {
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
    this.userType = 'guest';

    /* Redirigir a inicio o login */
    this.router.navigate(['/auth/login']);
  }

  /* get = Acceso al tipo de usuario actual */
  get role(): 'guest' | 'user' | 'admin' {
    return this.userType;
  }

  /* mt = Redirigir al usuario a la página de resultados con el término de búsqueda */
  onSearch() {
    if (this.searchTerm.trim()) {
      // Redirigir a la página de resultados de búsqueda
      this.router.navigate(['/productos'], { queryParams: { search: this.searchTerm } });
    }
  }

  onBlurSearch(): void {
    if (this.searchTerm.trim() === '') {
      this.searchTermChange.emit('');
      this.router.navigate(['/productos'])
    }
  }

  /* ob = Referencia al DOM de la barra lateral */
  @ViewChild('navbarToggleExternalContent') sidebar!: ElementRef;

  /* mt = Método para cerrar la sidebar */
  closeSidebar() {
    const sidebarElement = this.sidebar.nativeElement;
    sidebarElement.classList.remove('show');
  }
}