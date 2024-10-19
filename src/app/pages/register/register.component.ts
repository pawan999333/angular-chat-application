import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  user:User=new User();
constructor(private toastr:ToastrService,
  private authService:AuthService
){}
formSubmit(event:SubmitEvent){
  event.preventDefault();
  console.log(this.user);
  // validate data
  //blank name is not allowed
  if(this.user.name.trim()===''){
    // alert("Name is required");
    this.toastr.error("Name is required");
    return;
  }

  //email
  if(this.user.email.trim()===''){
    // alert("Name is required");
    this.toastr.error("Email is required");
    return;
  }

  //password
  if(this.user.password.trim()===''){
    // alert("Name is required");
    this.toastr.error("Password is required");
    return;
  }

  //about
  if(this.user.about.trim()===''){
    // alert("Name is required");
    this.toastr.error("About is required");
    return;
  }

  // register code goes 
  this.authService.register(this.user)
}
}
