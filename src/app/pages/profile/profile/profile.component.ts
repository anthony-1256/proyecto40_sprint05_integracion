import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [ RouterOutlet, FormsModule, CommonModule,  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {

  /* ob: inyeccion del servicio de autenticación */
  private authService = inject(AuthService);

  /* ob: computed del usuario actual */
  user = toSignal( this.authService.currentUser$ );

}
