import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginData={
    email:'',
    password:'',
  }

  constructor(private toastr:ToastrService,
    private authService:AuthService,
    private router:Router
  ){}

  loginFormSubmitted(event:SubmitEvent){
    event.preventDefault();
    console.log(this.loginData)
    if(this.loginData.email.trim()===''){
      this.toastr.warning("Email is required");
      return;
    }
    if(this.loginData.password.trim()===''){
      this.toastr.warning("Password is required")
    }

    //login karana hai: fireauth
    this.authService.login(this.loginData.email,this.loginData.password).then((result)=>{
      //login success
      console.log(result);
     
      //fetch user information with userid
     this.authService.getUserByUserId(result.user?.uid).subscribe((user:User | null)=>{
      console.log(user);
      this.authService.setUserToLocalStorage(user);
      this.router.navigate(['/chat-dashboard'])
     })
    }).catch(error=>{
      console.log(error);
      this.toastr.error("Error in signing in");
      this.toastr.error(error);
    })
  }


}