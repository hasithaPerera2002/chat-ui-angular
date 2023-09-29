import {Component, ViewChild} from '@angular/core';

interface ChatMessage {
  senderName: string;
  message: string;
}

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent {
  userName!: string;
  chatName!: string;

  privateChats: Map<string, ChatMessage[]> = new Map<string, ChatMessage[]>();
  publicChats: ChatMessage[] = [];

  @ViewChild('messageInput') messageInput: any;
  constructor() {
    this.chatName = 'Chat';
    this.userName = 'User';
  }



  sendMessage(value: string) {
    console.log(value)
    this.messageInput.nativeElement.value = '';
  }

  setChatName(chatRoom: string) {
    this.chatName = chatRoom;
  }
}
