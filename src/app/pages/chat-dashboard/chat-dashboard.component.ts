import { Component, ElementRef, ViewChild } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFireDatabase, AngularFireObject } from '@angular/fire/compat/database';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { Message } from 'src/app/models/message';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-chat-dashboard',
  templateUrl: './chat-dashboard.component.html',
  styleUrls: ['./chat-dashboard.component.scss']
})
export class ChatDashboardComponent {

  currentUser!: User | null;

  toUser!: User | null;

  message:string='';
  chatRefNode: string='';
  oppChatRefNode: string='';

  chatSubscription:Subscription | undefined;
  chats: Message[]=[];

  @ViewChild("messageBox",{static:false}) messageBox!:ElementRef;

  constructor(public auth: AuthService,
    private fireAuth: AngularFireAuth,
    private fireDb: AngularFireDatabase,
    private toastr: ToastrService
  ) {

    //get login user details
    //localstorage
    // fireAuth
    this.fireAuth.authState.subscribe((user) => {
      console.log(user)

      this.auth.getUserByUserId(user?.uid).subscribe(user => {
        this.currentUser = user;
        console.log(this.currentUser)
      })
    })
  }

  startChatParent(uid: string) {
    console.log("parent " + uid);
    if(this.chatSubscription){
      this.chatSubscription.unsubscribe()
    }
    this.chats=[];

    //important
   this.chatRefNode= `chats/${this.currentUser?.uid}****${uid}`
  
  
  
  
  
   this.oppChatRefNode=`chats/${uid}****${this.currentUser?.uid}`


    this.auth.getUserByUserId(uid).subscribe(
      {
        next: (user) => {
            this.toUser = user;
            console.log(this.toUser);
            document.title=user?.name || 'Chat App'
            this.loadChat()
          },
        error: (error) => {
          console.log(error);
          this.toastr.error("Error in starting chat !!")
        }
      })



  }

  loadChat(){
    //chat load code
   this.chatSubscription= this.fireDb.list(this.chatRefNode).valueChanges().subscribe((chatList:any[])=>{
    this.chats=chatList;

    if(this.chats.length<=0){
      this.chatSubscription?.unsubscribe();
      this.chatSubscription=
      this.fireDb.list(this.oppChatRefNode).valueChanges().
      subscribe((chatList:any[])=>{
        this.chats=chatList

        this.chatRefNode=this.oppChatRefNode
        this.scrollBottom()
      })
    }else{
      this.scrollBottom();
    }
   })
  }

  sendMessage(event:SubmitEvent){
    event.preventDefault();
    if(this.message.trim()===''){
      return;
    }else{
      console.log(this.message);

      const message:Message=new Message()
      message.message=this.message;
      message.from=this.currentUser?.uid || '';
      message.to=this.toUser?.uid || '';

     const chatRef:AngularFireObject<Message>= this.fireDb.object(
      `${this.chatRefNode}/${new Date()}`);

     chatRef.set(message).then(data=>{
      this.toastr.success("Message send success")
      this.scrollBottom()
      this.message='';
     }).catch((error)=>{
      console.log(error);
      this.toastr.error("Error in sending message");
     })

    }

  }
  scrollBottom(){
    this.messageBox.nativeElement.scrollTo({
      left:0,
      top:this.messageBox.nativeElement.scrollHeight,
      behaviour:'smooth'
    })

  }
}
