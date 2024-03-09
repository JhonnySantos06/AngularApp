import { Component } from '@angular/core';
import { FormGroup,FormBuilder,Validators} from '@angular/forms';
import { Router } from '@angular/router';
import { DataFirebaseService } from '../../service/data-firebase.service';
import { UserserviceService } from '../../service/userservice.service';

import {IPersona} from'../../persona';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  loginForm: FormGroup; 
  errorMessage: string = '';
  
  constructor(private formBuilder: FormBuilder, private router: Router,private dataService: DataFirebaseService,
    private UserserviceService:UserserviceService){
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    }); 
    
  }

  async onSubmit() {
    if (this.loginForm.valid) {
      const email = encodeURIComponent(this.loginForm.get('username')?.value); // Codifica el correo
      const password = this.loginForm.get('password')?.value;

      console.log('Email a consultar:', email);
      try {
        const userResponse: any = await this.dataService.getUserByEmail(decodeURIComponent(email)).toPromise();

        // Verifica si hay datos en la respuesta
        if (userResponse) {
          const userId = Object.keys(userResponse)[0]; // Obtiene la clave del objeto (por ejemplo, "-NhAqh4aCbhuejq82PzN")
          const user = userResponse[userId] as IPersona; // Convierte a tipo IPersona

          if (user.password === password) {
            console.log('Inicio de sesión exitoso');
            
            // Almacena el userId en el servicio UserserviceService
            this.UserserviceService.setUserId(userId);

            this.router.navigate(['inicio']);
          } else {
            this.errorMessage = 'Los datos ingresados son incorrectos'; // Establece el mensaje de error
          }
        }
      } catch (error) {
        console.error('Error al iniciar sesión:', error);
        this.errorMessage = 'Error al iniciar sesión. Por favor, inténtalo de nuevo más tarde.';
      }
    }
  }
  
  
  
  
}
