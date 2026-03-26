import { Component } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-driver-layout',
  imports: [CommonModule, RouterOutlet],
  templateUrl: './driver-layout.component.html',
  styleUrls: ['./driver-layout.component.css']
})
export class DriverLayoutComponent {

  constructor(private router: Router) {}

  logout() {
    localStorage.removeItem('driver');
    this.router.navigate(['/']);
  }
}