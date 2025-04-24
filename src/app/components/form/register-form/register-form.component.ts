import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { User } from '../../../models/users';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-register-form',
  standalone: true,
  imports: [ ReactiveFormsModule ],
  templateUrl: './register-form.component.html',
  styleUrl: './register-form.component.css'
})
export class RegisterFormComponent {
    
  private fb = inject(FormBuilder); /*  */  
  private auth = inject(AuthService); /*  */

  user = this.fb.group({
    id: [0],
    name: ['', [Validators.required]],
    age: [null, [Validators.required, Validators.min(1)]],
    gender: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    username: ['', [Validators.required]],
    password: ['', [Validators.required]],
    admin: [false],
  });

  fnOnRegister(event: Event): void {
    event.preventDefault();
    if (this.user.valid) {
      const formValue = this.user.getRawValue();


      const newUser: User = {

        id: formValue.id ?? 0,
        name: formValue.name ?? '',
        age: formValue.age ?? 0,
        gender: formValue.gender ?? '',
        email: formValue.email ?? '',
        username: formValue.username ?? '',
        password: formValue.password ?? '',
        admin: formValue.admin ?? false,
        paymentMethods: [],
        deliveryAddresses: []
        
      };

      this.auth.addUser(newUser); // <--- LLAMADA DIRECTA
      /* this.userRegistered.emit(newUser); // Emitir al componente padre */
      this.user.reset();
    }
  }
}