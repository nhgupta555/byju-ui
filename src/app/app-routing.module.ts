import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { HomeComponent } from './home/home.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { VerifyAccountComponent } from './verify-account/verify-account.component';
import { ActivateAccountComponent } from './activate-account/activate-account.component';
import { CompanyComponent } from './company/company.component';
import { AuthGuard } from './auth.guard';

const routes: Routes = [
  {
      path: '',
      component: HomeComponent
  },
  {
      path: 'login',
      component: LoginComponent
  },
  {
      path: 'register',
      component: RegisterComponent
  },
  {
    path: 'reset-password',
    component: ResetPasswordComponent
  },
  {
    path: 'change-password',
    component: ChangePasswordComponent
  },
  {
    path: 'verify-account',
    component: VerifyAccountComponent
  },
  {
    path: 'activate-account',
    component: ActivateAccountComponent
  },
  {
    path: 'company',
    component: CompanyComponent,
    canActivate: [AuthGuard]
  }

];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})

export class AppRoutingModule { }
