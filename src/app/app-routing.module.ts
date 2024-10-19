import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { VerifyEmailComponent } from './pages/verify-email/verify-email.component';
import { ChatDashboardComponent } from './pages/chat-dashboard/chat-dashboard.component';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  {
    path:'',
    redirectTo:'login',
    pathMatch:'full',
   
  },
  {
    path:'login',
    component:LoginComponent,
     title:'Login Chat App'
  },
  {
    path:'register',
    component:RegisterComponent,
     title:'Register Chat App'
  },
  {
    path:'verify-email',
    component:VerifyEmailComponent
  },
  {
    path:'chat-dashboard',
    component:ChatDashboardComponent,
    canActivate:[AuthGuard],
     title:'Chat Dashboard'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
