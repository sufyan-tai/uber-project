import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent {

  name = '';
  email = '';
  message = '';

  constructor(private router: Router) {}

  submitForm() {
    if (!this.name || !this.email || !this.message) {
      alert("Please fill all fields");
      return;
    }

    alert("📩 Message Sent Successfully!");
    this.name = '';
    this.email = '';
    this.message = '';
  }

  goBack() {
    this.router.navigate(['/user/dashboard']);
  }
}