import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoaderService } from './loader.service';

@Component({
             selector: 'app-loader',
             standalone: true,
             imports: [CommonModule],
             template: `
               <div class="overlay" *ngIf="loader.isLoading()" [class.visible]="loader.isLoading()">
                 <div class="progress-bar"></div>
                 <div class="spinner"></div>
               </div>
             `,
             styles: [`
                        .overlay {
                          position: fixed;
                          top: 0; left: 0;
                          width: 100vw;
                          height: 100vh;
                          background: rgba(0,0,0,0.35);
                          display: flex;
                          justify-content: center;
                          align-items: center;
                          z-index: 9999;
                          opacity: 0;
                          transition: opacity 0.3s ease;
                          pointer-events: none;
                        }

                        .overlay.visible {
                          opacity: 1;
                          pointer-events: all;
                        }

                        .spinner {
                          border: 8px solid rgba(255,255,255,0.3);
                          border-top: 8px solid #ffffff;
                          border-radius: 50%;
                          width: 80px;
                          height: 80px;
                          animation: spin 1s linear infinite;
                          position: absolute;
                        }

                        @keyframes spin {
                          0% { transform: rotate(0deg);}
                          100% { transform: rotate(360deg);}
                        }

                        .progress-bar {
                          position: absolute;
                          top: 0;
                          left: 0;
                          height: 4px;
                          width: 0;
                          background: #29d;
                          animation: progress 2s linear infinite;
                        }

                        @keyframes progress {
                          0% { width: 0; }
                          50% { width: 80%; }
                          100% { width: 0; }
                        }
                      `]
           })
export class LoaderComponent {
  constructor(public loader: LoaderService) {}
}
