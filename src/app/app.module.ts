import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {RouterModule} from "@angular/router";
import { ChatComponent } from './chat/chat.component';

const routes = [
  {path: '', component: LoginComponent},
  {path: 'login', component: LoginComponent},
  {path: 'chat', component: ChatComponent},
];
@NgModule({

  declarations: [
    AppComponent,
    LoginComponent,
    ChatComponent
  ],
  imports: [
    RouterModule.forRoot(routes),
    BrowserModule,
    ReactiveFormsModule,
    FormsModule,
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent],
  exports: [RouterModule]
})
export class AppModule { }
