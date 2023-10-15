import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { InicioComponent } from './components/inicio/inicio.component';


const routes: Routes = [
{
  path: 'login',
  component: LoginComponent
}, 
{
  path:'registro',
  component:RegisterComponent
},
{
  path:'inicio',
  component: InicioComponent
},
{
  path: '**',
  pathMatch:'full',redirectTo:'login'
}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
