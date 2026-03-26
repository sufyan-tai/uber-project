import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule,RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  email = '';
  password = '';

  constructor(private http: HttpClient, private router: Router) {}

  login() {
  this.http.post<any>('http://localhost:5000/api/auth/login', {
    email: this.email,
    password: this.password
  }).subscribe({
    next: (res) => {
      console.log('LOGIN RESPONSE 👉', res);
      


      const user = res.user ? res.user : res;

      if (!user || !user._id || !user.role) {
        alert('Invalid login response');
        return;
      }
        
      // 🔥 Always clear old storage first
      localStorage.clear();
localStorage.setItem('currentUser', JSON.stringify(user));

const role = user.role.toLowerCase();

if (role === 'driver') {
  this.router.navigate(['/driver']);
} 
else if (role === 'user') {
  this.router.navigate(['/user/dashboard']);
} 
else if (role === 'admin') {
  this.router.navigate(['/admin']);
} 
else {
  alert('Unknown role: ' + user.role);
}
    },
    error: () => {
      alert('Invalid login');
    }
  });
}
logout() {
  localStorage.clear();
  this.router.navigate(['/login']);
}
}
