import { Component } from '@angular/core';
import { FormGroup,FormBuilder,Validators,FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  loginForm: FormGroup; 
  
  constructor(private formBuilder: FormBuilder, private router: Router){
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    }); 
    
  }
  onSubmit(){
    if (this.loginForm){

      this.router.navigate(['inicio']);

    }
  }
}
