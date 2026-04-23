import { Component, computed, input, model, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="flex flex-col xl:flex-row items-center justify-between gap-4 py-3 w-full">
      
      <!-- Info + Jump to page -->
      <div class="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 text-center sm:text-left">
        <p class="text-xs sm:text-sm text-content-secondary whitespace-nowrap">
          Mostrando <span class="font-bold text-content-primary">{{ startIndex() + 1 }}</span>–<span class="font-bold text-content-primary">{{ endIndex() }}</span>
          de <span class="font-bold text-content-primary">{{ totalItems() }}</span>
        </p>
 
        <!-- Jump to page input -->
        <div class="flex items-center gap-2">
          <label class="text-[10px] sm:text-xs text-content-muted whitespace-nowrap hidden sm:block">Ir a:</label>
          <input
            type="number"
            [(ngModel)]="jumpPage"
            (keydown.enter)="goToPage()"
            [min]="1"
            [max]="totalPages()"
            placeholder="{{ currentPage() }}"
            class="w-12 sm:w-14 bg-white/5 border border-white/10 text-content-primary text-[10px] sm:text-xs rounded-lg px-2 py-1.5 text-center focus:ring-2 focus:ring-action-primary outline-none transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          />
          <button
            (click)="goToPage()"
            class="px-2 sm:px-2.5 py-1.5 text-[10px] sm:text-xs bg-white/10 hover:bg-action-primary text-content-secondary hover:text-surface-base rounded-lg transition-all font-bold"
          >
            Ir
          </button>
        </div>
      </div>
 
      <!-- Navigation -->
      <nav class="flex flex-wrap items-center justify-center gap-1 sm:gap-1.5">
 
        <!-- First page -->
        <button
          (click)="onPageChange(1)"
          [disabled]="currentPage() === 1"
          title="Primera página"
          class="relative inline-flex items-center p-1.5 sm:px-2 sm:py-2 rounded-lg sm:rounded-l-lg sm:rounded-none border border-white/5 bg-white/5 text-sm text-content-secondary hover:bg-white/10 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 sm:w-4 sm:h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="11 17 6 12 11 7"/><polyline points="18 17 13 12 18 7"/>
          </svg>
        </button>
 
        <!-- Previous page -->
        <button
          (click)="onPageChange(currentPage() - 1)"
          [disabled]="currentPage() === 1"
          title="Página anterior"
          class="relative inline-flex items-center p-1.5 sm:px-2 sm:py-2 rounded-lg sm:rounded-none border border-white/5 bg-white/5 text-sm text-content-secondary hover:bg-white/10 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 sm:w-4 sm:h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
        </button>
 
        <!-- Page numbers -->
        @for (page of pages(); track page) {
          <button
            (click)="onPageChange(page)"
            [class]="currentPage() === page
              ? 'relative inline-flex items-center px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-lg sm:rounded-none border border-action-primary bg-action-primary text-xs sm:text-sm font-bold text-surface-base transition-colors'
              : 'relative inline-flex items-center px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-lg sm:rounded-none border border-white/5 bg-white/5 text-xs sm:text-sm font-medium text-content-secondary hover:bg-white/10 transition-colors'"
          >
            {{ page }}
          </button>
        }
 
        <!-- Next page -->
        <button
          (click)="onPageChange(currentPage() + 1)"
          [disabled]="currentPage() === totalPages()"
          title="Página siguiente"
          class="relative inline-flex items-center p-1.5 sm:px-2 sm:py-2 rounded-lg sm:rounded-none border border-white/5 bg-white/5 text-sm text-content-secondary hover:bg-white/10 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 sm:w-4 sm:h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="9 18 15 12 9 6"/>
          </svg>
        </button>
 
        <!-- Last page -->
        <button
          (click)="onPageChange(totalPages())"
          [disabled]="currentPage() === totalPages()"
          title="Última página"
          class="relative inline-flex items-center p-1.5 sm:px-2 sm:py-2 rounded-lg sm:rounded-r-lg sm:rounded-none border border-white/5 bg-white/5 text-sm text-content-secondary hover:bg-white/10 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 sm:w-4 sm:h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="13 17 18 12 13 7"/><polyline points="6 17 11 12 6 7"/>
          </svg>
        </button>
      </nav>
    </div>
  `
})
export class PaginationComponent {
  totalItems = input(0);
  itemsPerPage = input(10);
  currentPage = model(1);
  @Output() pageChange = new EventEmitter<number>();

  totalPages = computed(() => Math.ceil(this.totalItems() / this.itemsPerPage()) || 1);

  startIndex = computed(() => (this.currentPage() - 1) * this.itemsPerPage());
  endIndex = computed(() => Math.min(this.startIndex() + this.itemsPerPage(), this.totalItems()));

  pages = computed(() => {
    const total = this.totalPages();
    const current = this.currentPage();
    const maxPagesToShow = 5;
    
    let startPage: number, endPage: number;

    if (total <= maxPagesToShow) {
      startPage = 1;
      endPage = total;
    } else {
      const half = Math.floor(maxPagesToShow / 2);
      if (current <= half) {
        startPage = 1;
        endPage = maxPagesToShow;
      } else if (current + half >= total) {
        startPage = total - maxPagesToShow + 1;
        endPage = total;
      } else {
        startPage = current - half;
        endPage = current + half;
      }
    }

    return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
  });

  jumpPage: number | null = null;

  onPageChange(page: number) {
    if (page >= 1 && page <= this.totalPages() && page !== this.currentPage()) {
      this.currentPage.set(page);
      this.pageChange.emit(page);
    }
  }

  goToPage() {
    if (this.jumpPage !== null && !isNaN(this.jumpPage)) {
      const target = Math.max(1, Math.min(this.totalPages(), Math.floor(this.jumpPage)));
      this.onPageChange(target);
    }
    this.jumpPage = null;
  }
}
