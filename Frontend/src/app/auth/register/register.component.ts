import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {

  name = '';
  email = '';
  password = '';
  role = 'user';

  constructor(private http: HttpClient, private router: Router) {}

  register() {

    if (!this.name || !this.email || !this.password) {
      alert("Please fill all fields");
      return;
    }

    this.http.post("http://localhost:5000/api/auth/register", {
      name: this.name,
      email: this.email,
      password: this.password,
      role: this.role
    }).subscribe({
      next: () => {
        alert("Account created successfully 🎉");
        this.router.navigate(['/']);
      },
      error: (err) => {
        alert(err.error?.message || "Registration failed");
      }
    });
  }

}