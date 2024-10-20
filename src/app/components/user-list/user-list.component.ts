import { Component, EventEmitter, HostListener, Output } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/compat/database';
import { Observable } from 'rxjs';
import { User } from 'src/app/models/user';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent {
  public userList:User[]=[];

  isSmallScreen = false;
  @Output() startChatEmitter:EventEmitter<string>=new EventEmitter()
  hidePawanClass: boolean=false;

  constructor(private fireDb:AngularFireDatabase){
    this.isSmallScreen = window.innerWidth <= 500;
  const userListRef:AngularFireList<User>=this.fireDb.list("users")
  userListRef.valueChanges().subscribe(users=>{
    this.userList=users;
  })

  
  
  }
  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.isSmallScreen = window.innerWidth <= 500;
  }
  startChatChild(uid:string){
    this.startChatEmitter.next(uid);
    this.hidePawanClass = true;

  }
}
