import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loader',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="loader" *ngIf="loading">
      <div class="spinner"></div>
    </div>
  `,
  styles: [`
    .loader {
      text-align:center;
      margin:20px;
    }
    .spinner {
      width:40px;
      height:40px;
      border:4px solid #333;
      border-top:4px solid #00ff88;
      border-radius:50%;
      animation: spin 1s linear infinite;
      margin:auto;
    }
    @keyframes spin {
      100% { transform: rotate(360deg); }
    }
  `]
})
export class LoaderComponent {
  @Input() loading = false;
}
