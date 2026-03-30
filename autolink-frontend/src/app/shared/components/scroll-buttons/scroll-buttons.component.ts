import { Component, HostListener, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-scroll-buttons',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="fixed bottom-8 right-8 flex flex-col gap-3 z-50">
      <!-- Scroll to Top -->
      <button 
        *ngIf="showTop()"
        (click)="scrollToTop()"
        class="p-3 bg-baltic-blue-500/20 hover:bg-baltic-blue-500 backdrop-blur-md border border-baltic-blue-500/30 rounded-2xl text-baltic-blue-400 hover:text-white transition-all shadow-xl hover:-translate-y-1 active:scale-90 group"
        title="Subir al inicio"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="group-hover:animate-bounce-short">
          <path d="m18 15-6-6-6 6"/>
        </svg>
      </button>

      <!-- Scroll to Bottom -->
      <button 
        *ngIf="showBottom()"
        (click)="scrollToBottom()"
        class="p-3 bg-baltic-blue-500/20 hover:bg-baltic-blue-500 backdrop-blur-md border border-baltic-blue-500/30 rounded-2xl text-baltic-blue-400 hover:text-white transition-all shadow-xl hover:translate-y-1 active:scale-90 group"
        title="Bajar al final"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="group-hover:animate-bounce-short-down">
          <path d="m6 9 6 6 6-6"/>
        </svg>
      </button>
    </div>
  `,
  styles: [`
    .group-hover\\:animate-bounce-short {
      animation: bounceShort 1s infinite;
    }
    .group-hover\\:animate-bounce-short-down {
      animation: bounceShortDown 1s infinite;
    }
    @keyframes bounceShort {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-3px); }
    }
    @keyframes bounceShortDown {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(3px); }
    }
  `]
})
export class ScrollButtonsComponent {
  showTop = signal(false);
  showBottom = signal(true);

  @HostListener('window:scroll', [])
  onWindowScroll() {
    const yOffset = window.pageYOffset || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    
    this.showTop.set(yOffset > 300);
    this.showBottom.set(yOffset < height - 300);
  }

  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  scrollToBottom() {
    window.scrollTo({ 
      top: document.documentElement.scrollHeight, 
      behavior: 'smooth' 
    });
  }
}
