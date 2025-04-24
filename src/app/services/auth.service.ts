/* ob = Importaciones */
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { DeliveryAddress, PaymentMethod, User } from '../models/users';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  /* ob = Constantes para claves de almacenamiento local */
  private readonly USER_KEY = 'user';
  private readonly TYPE_KEY = 'userType';
  private readonly USERS_KEY = 'users';

  /* ob = Colores personalizables para alertas */
  colorText = '#000000';
  colorBg = '#ffffff';

  /* ob = Subjects reactivos */
  private userTypeSubject!: BehaviorSubject<'admin' | 'user' | 'guest'>;
  userType$; // ob = Observable público del tipo de usuario

  private currentUserSubject = new BehaviorSubject<User>(this.getUser()); // ob = Usuario actual observable
  currentUser$ = this.currentUserSubject.asObservable(); // ob = Observable expuesto

  /* mt = Constructor para inicializar servicios e instancias */
  constructor(private router: Router) {
    const userType = localStorage.getItem(this.TYPE_KEY) as 'admin' | 'user' | 'guest' || 'guest';
    this.userTypeSubject = new BehaviorSubject(userType);
    this.userType$ = this.userTypeSubject.asObservable();
  }

  /* mt = Guardar el usuario actual en localStorage */
  setUser(user: User): void {
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    this.currentUserSubject.next(user);
    this.setUserType(user.admin ? 'admin' : 'user');
  }

  
  /* mt = Obtener el usuario actual */
  getUser(): User {
    const data = localStorage.getItem(this.USER_KEY);
    const parsed = data ? JSON.parse(data) : null;

    if (parsed) {
      return {
        ...parsed,
        paymentMethods: parsed.paymentMethods || [],
        deliveryAddresses: parsed.deliveryAddresses || []
      };
    }

    return {
      id: 0,
      name: 'Invitado',
      age: 0,
      gender: '',
      email: '',
      username: 'invitado',
      password: '',
      admin: false,
      paymentMethods: [],
      deliveryAddresses: []
    };
  }

  /* mt = Obtener el tipo de usuario actual */
  getUserType(): 'admin' | 'user' | 'guest' {
    return (localStorage.getItem(this.TYPE_KEY) as 'admin' | 'user' | null) || 'guest';
  }

  /* mt = Guardar el tipo de usuario actual y notificar a los suscriptores */
  setUserType(type: 'admin' | 'user' | 'guest'): void {
    localStorage.setItem(this.TYPE_KEY, type);
    this.userTypeSubject.next(type);
  }

  
  /* mt = Cerrar sesión y limpiar localStorage */
  logout(): void {
    localStorage.removeItem(this.USER_KEY);
    localStorage.removeItem(this.TYPE_KEY);
    this.setUserType('guest');
    this.currentUserSubject.next({
      id: 0,
      name: '',
      age: 0,
      gender: '',
      email: '',
      username: 'invitado',
      password: '',
      admin: false,
      paymentMethods: [],
      deliveryAddresses: []
    });
  }

  /* mt = Agregar un nuevo usuario */
  public addUser(user: User): void {
    const currentUser = this.user;

    user.id = currentUser.length > 0 ? Math.max(...currentUser.map(u => u.id)) + 1 : 1;
    this.user = [...currentUser, user];

    Swal.fire({
      text: 'Usuario agregado',
      icon: 'success',
      color: this.colorText,
      background: this.colorBg,
    }).then(() => {
      this.router.navigateByUrl('');
    });
  }

  /* mt = Actualizar datos de un usuario existente */
  public updateUser(updatedUser: User): void {
    const users = this.user.map(user =>
      user.id === updatedUser.id ? { ...updatedUser } : user
    );
    this.user = users;

    Swal.fire({
      text: 'Usuario actualizado correctamente',
      icon: 'success',
      color: this.colorText,
      background: this.colorBg,
    });
  }
  
  /*** get = Obtener lista de usuarios desde localStorage ***/ 
  get user(): User[] {
    const stored = localStorage.getItem(this.USERS_KEY);
    return stored ? JSON.parse(stored) : [];
  }
  
  /*** set = Guardar lista de usuarios en localStorage ***/
  set user(users: User[]) {
    localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
  }
  
  /* mt = verifica si el usuario esta logeado */
  isLoggedIn(): boolean {
    return this.getUserType() !== 'guest';
  }
  
  
  /* mt = Agregar un método de pago al usuario */
  public addPaymentMethod(paymentMethod: PaymentMethod): void {
    const currentUser = this.getUser();
    currentUser.paymentMethods.push(paymentMethod); /* error: currentUser.paymentMethods */
    this.setUser(currentUser); // Actualizar el usuario con el nuevo método de pago

    Swal.fire({
      text: 'Método de pago agregado',
      icon: 'success',
      color: this.colorText,
      background: this.colorBg,
    });
  }

  /* mt = Eliminar un método de pago del usuario */
  public removePaymentMethod(paymentMethodId: number): void {
    const currentUser = this.getUser();
    currentUser.paymentMethods = currentUser.paymentMethods.filter(pm => pm.id !== paymentMethodId); /* error: currentUser.paymentMethods */
    this.setUser(currentUser); // Actualizar el usuario después de la eliminación

    Swal.fire({
      text: 'Método de pago eliminado',
      icon: 'success',
      color: this.colorText,
      background: this.colorBg,
    });
  }

  /* mt = Agregar una dirección de entrega al usuario */
  public addDeliveryAddress(address: DeliveryAddress): void {
    const currentUser = this.getUser();
    currentUser.deliveryAddresses.push(address); /* error: currentUser.deliveryAddresses declarar propiedad */
    this.setUser(currentUser); // Actualizar el usuario con la nueva dirección

    Swal.fire({
      text: 'Dirección de entrega agregada',
      icon: 'success',
      color: this.colorText,
      background: this.colorBg,
    });
  }

  /* mt = Eliminar una dirección de entrega del usuario */
  public removeDeliveryAddress(addressId: number): void {
    const currentUser = this.getUser();
    currentUser.deliveryAddresses = currentUser.deliveryAddresses.filter(addr => addr.id !== addressId); /* error: currentUser.deliveryAddresses y addr*/
    this.setUser(currentUser); // Actualizar el usuario después de la eliminación

    Swal.fire({
      text: 'Dirección de entrega eliminada',
      icon: 'success',
      color: this.colorText,
      background: this.colorBg,
    });
  }
}