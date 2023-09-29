import {Component} from '@angular/core';
import {animate, state, style, transition, trigger} from "@angular/animations";
import {FormBuilder, FormControl, FormControlName, FormGroup, Validators} from "@angular/forms";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {Router} from "@angular/router";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  animations: [
    trigger('fadeInOut', [
      state('in', style({opacity: 1})),
      state('out', style({opacity: 0})),
      transition('in => out', animate('300s ease-out')),
      transition('out => in', animate('300s ease-in')),
    ]),
  ],
})
export class LoginComponent {
  btnToggle: string = 'Login';
  animationState: string = 'in';
  loginForm = new FormGroup({
    name: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
    },
  );
constructor(private routes:Router) {
}

  toggleValue() {
    this.btnToggle = this.btnToggle === 'Login' ? 'Sign Up' : 'Login';
    this.animationState = this.animationState === 'in' ? 'out' : 'in';
  }


  submit() {
    let value:string | null = this.loginForm.controls.name.value;
    this.routes.navigate(['/chat'],{queryParams:{name:value}}).then(r => console.log(r));
  }
}
