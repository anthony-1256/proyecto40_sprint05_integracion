import { Component } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { User } from '../../../models/users';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-auth-page',
  standalone:true,
  imports: [ RouterOutlet],
  templateUrl: './auth-page.component.html',
  styleUrl: './auth-page.component.css'
})
export class AuthPageComponent {

  constructor ( private authService: AuthService) {}

  fnAddUser( newUser: User ) {
    this.authService.addUser( newUser );
  } 

}