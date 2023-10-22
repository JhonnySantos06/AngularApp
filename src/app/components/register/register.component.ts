import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DataFirebaseService } from '../../service/data-firebase.service';
import { UserserviceService } from '../../service/userservice.service'; // Importa el servicio UserserviceService

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  registerForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private dataService: DataFirebaseService,
    private userService: UserserviceService // Inyecta el servicio UserserviceService
  ) {
    this.registerForm = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  goToLogin() {
    this.router.navigate(['login']);
  }

  async onSubmit() {
    if (this.registerForm.valid) {
      const name = this.registerForm.get('name')?.value;
      const email = this.registerForm.get('email')?.value;
      const password = this.registerForm.get('password')?.value;
  
      // Crear un objeto con los datos que deseas guardar
      const personaData = {
        name: name,
        email: email,
        password: password
      };
  
      // Llamar al servicio para guardar los datos y obtener el ID del usuario registrado
      try {
        const userId = await this.dataService.savePersona(personaData);
  
        if (userId) {
          // Almacena el ID del usuario en el servicio UserserviceService
          this.userService.setUserId(userId);
  
          // Redirige al usuario a la página de inicio después de un registro exitoso
          this.router.navigate(['inicio']);
        } else {
          console.error('No se pudo obtener el ID del usuario.');
        }
      } catch (error) {
        // Manejar errores si la operación de registro falla
        console.error('Error al registrar:', error);
      }
    }
  }
  
}
