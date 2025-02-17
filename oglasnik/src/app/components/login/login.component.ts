import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(private authService: AuthService) {}

  login() {
    if (this.username && this.password) {
      this.authService.login({
        username: this.username,
        password: this.password,
      });
    } else {
      alert('Please enter both username and password.');
    }
  }
}
