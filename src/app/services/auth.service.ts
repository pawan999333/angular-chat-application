import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import {AngularFireDatabase, AngularFireObject} from '@angular/fire/compat/database';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { User } from '../models/user';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private firAuth:AngularFireAuth,
    private fireDb: AngularFireDatabase,
    private router:Router,
    private toastr:ToastrService
  ) { }


  //method for registration
  register(user:User){
    this.firAuth.createUserWithEmailAndPassword(user.email,user.password).then(result=>{
      console.log(result);
      this.toastr.success("saving user data","Registered Success...")
      //save user data
    user.uid=  result.user?.uid || '';
    user.displayName =result.user?.displayName || user?.name.toUpperCase();
    user.emailVarified !=result.user?.emailVerified || false
    user.password='';
    user.imageURL=result.user?.photoURL || 'https://w7.pngwing.com/pngs/981/645/png-transparent-default-profile-united-states-computer-icons-desktop-free-high-quality-person-icon-miscellaneous-silhouette-symbol-thumbnail.png'
      this.saveUserData(user).then((data)=>{
        console.log(data);
        this.toastr.success("user data saved !!!")
        this.setUserToLocalStorage(user);
      }).catch(error=>{
        console.log(error)
        this.toastr.error("error in saving data")
      })
    }).catch(error=>{
      console.error("Error in signup");
      this.toastr.error("Error in signup")
    })
  }
  //user detail saved in realtime db
  saveUserData(user:User){
    const usesrObjectRef:AngularFireObject<User>=this.fireDb.object(`users/${user.uid}`)
    return usesrObjectRef.set(user);

  }

  //setUser to local storgae
  setUserToLocalStorage(user:User | null){
    localStorage.setItem('user',JSON.stringify(user));
  }

  //return the status of login user
  get loggedInStatus(){
    const userString=localStorage.getItem('user');
    if(userString==null){
      return false;
    }else{
      return JSON.parse(userString);
    }

  }
//remove the user from local strogae
  logoutFromLocalStorage(){
    localStorage.removeItem('user');
  }

  //logout user from firebase and also from local storage
  signOut(){
    this.firAuth.signOut().then(()=>{
      this.logoutFromLocalStorage();
      this.router.navigate(['/login'])
    }).catch((error)=>{
      console.log(error);
      this.toastr.error("Error in logging out!!!")
    })
  }

  //login usesr
  login(email:string,password:string){
   return this.firAuth.signInWithEmailAndPassword(email,password)
  }


getUserByUserId(uid:string | undefined):Observable<User | null>{
 const objectRef:AngularFireObject<User>= this.fireDb.object(`users/${uid}`)
 return objectRef.valueChanges();
  }

}