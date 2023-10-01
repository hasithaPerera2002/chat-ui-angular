import {Component, OnInit, ViewChild} from '@angular/core';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';
import {ActivatedRoute, Route, Router} from "@angular/router";



interface ChatMessage {
  senderName: string;
  receiverName: string;
  message: string;
  status: string;
}

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit{
  userName!: string;
  chatName!: string;

  private stompClient: any;
  privateChats: Map<string, ChatMessage[]> = new Map<string, ChatMessage[]>();
  publicChats: ChatMessage[] = [];

  @ViewChild('messageInput') messageInput: any;

  constructor(private route: Router,private router:ActivatedRoute) {
    this.chatName = 'ChatRoom';
    this.userName = this.router.snapshot.queryParams['name'];
    this.route = route;
  }



  setChatName(chatRoom: string) {
    this.chatName = chatRoom;
  }

  onRegister() {
    let sockJs = new SockJS('http://localhost:8080/ws');
    this.stompClient = Stomp.over(sockJs);
    this.stompClient.connect({}, this.onConnected, this.onErrorMessage);
  }

  onErrorMessage = () => {
    this.route.navigate(['/login'])
  };



  onPublicMessage = (payload: any) => {
    let publicMessage: ChatMessage = JSON.parse(payload.body);
    switch (publicMessage.status) {
      case 'JOIN':
        console.log(publicMessage.senderName + ' has joined the chat room');
        if (!this.privateChats.has( publicMessage.senderName) && publicMessage.senderName !== this.userName) {
          this.privateChats.set(publicMessage.senderName, []);
        }
        break;
      case 'LEAVE':
        console.log(publicMessage.senderName + ' has left the chat room');
        break;
      case 'CHAT':
        if (publicMessage.senderName !== this.userName) {
          this.publicChats.push(publicMessage);
        }
        break;

    }
  };
  onPrivateMessage = (payload:any ) => {
    let privateMessage: ChatMessage = JSON.parse(payload.body);
    if (this.privateChats.has(privateMessage.senderName)) {
      this.privateChats.get(privateMessage.senderName)?.push(privateMessage);
    } else {
      this.privateChats.set(privateMessage.senderName, [privateMessage]);
    }
  };
  onConnected = () => {
    this.stompClient.subscribe('/topic/public', this.onPublicMessage);
    this.stompClient.subscribe('/user/' + this.userName + '/private', this.onPrivateMessage);
    let joinMessage: ChatMessage = {
      senderName: this.userName,
      receiverName: 'ChatRoom',
      message: this.userName + ' has joined the chat room',
      status: 'JOIN'
    }
    this.stompClient.send('/app/public', {}, JSON.stringify(joinMessage));
  };
  onSendMessage = (message: string) => {
    if (this.chatName === 'ChatRoom') {
      let sendingMessage :ChatMessage = {
        senderName: this.userName,
        receiverName: this.chatName,
        message: message,
        status: 'CHAT'
      }
      this.stompClient.send('/app/public', {}, JSON.stringify(sendingMessage),this.onErrorMessage);
      this.publicChats.push(sendingMessage);
    } else {
      let sendingMessage :ChatMessage = {
        senderName: this.userName,
        receiverName: this.chatName,
        message: message,
        status: 'CHAT'
      }
      this.stompClient.send('/app/private', {}, JSON.stringify(sendingMessage));
      this.privateChats.get(this.chatName)?.push(sendingMessage);
  }
    this.messageInput.nativeElement.value = '';
  }

  ngOnInit(): void {
    this.onRegister()
  }
}
