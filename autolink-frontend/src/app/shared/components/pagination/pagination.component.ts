import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="flex flex-col sm:flex-row items-center justify-between gap-4 px-4 py-3 sm:px-6">
      
      <!-- Info + Jump to page -->
      <div class="flex items-center gap-4">
        <p class="text-sm text-slate-400 whitespace-nowrap">
          Mostrando <span class="font-bold text-white">{{ startIndex + 1 }}</span>–<span class="font-bold text-white">{{ endIndex }}</span>
          de <span class="font-bold text-white">{{ totalItems }}</span>
        </p>

        <!-- Jump to page input -->
        <div class="flex items-center gap-2">
          <label class="text-xs text-slate-500 whitespace-nowrap hidden sm:block">Ir a:</label>
          <input
            type="number"
            [(ngModel)]="jumpPage"
            (keydown.enter)="goToPage()"
            [min]="1"
            [max]="totalPages"
            placeholder="{{ currentPage }}"
            class="w-14 bg-slate-800 border border-slate-700 text-white text-xs rounded-lg px-2 py-1.5 text-center focus:ring-2 focus:ring-blue-500 outline-none transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          />
          <button
            (click)="goToPage()"
            class="px-2.5 py-1.5 text-xs bg-slate-700 hover:bg-blue-600 text-slate-300 hover:text-white rounded-lg transition-all font-bold"
          >
            Ir
          </button>
        </div>
      </div>

      <!-- Navigation -->
      <nav class="flex items-center gap-1">

        <!-- First page -->
        <button
          (click)="onPageChange(1)"
          [disabled]="currentPage === 1"
          title="Primera página"
          class="relative inline-flex items-center px-2 py-2 rounded-l-lg border border-slate-700 bg-slate-800 text-sm text-slate-400 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="11 17 6 12 11 7"/><polyline points="18 17 13 12 18 7"/>
          </svg>
        </button>

        <!-- Previous page -->
        <button
          (click)="onPageChange(currentPage - 1)"
          [disabled]="currentPage === 1"
          title="Página anterior"
          class="relative inline-flex items-center px-2 py-2 border border-slate-700 bg-slate-800 text-sm text-slate-400 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
        </button>

        <!-- Page numbers -->
        @for (page of pages; track page) {
          <button
            (click)="onPageChange(page)"
            [class]="currentPage === page
              ? 'relative inline-flex items-center px-3.5 py-2 border border-blue-500 bg-blue-600 text-sm font-bold text-white transition-colors'
              : 'relative inline-flex items-center px-3.5 py-2 border border-slate-700 bg-slate-800 text-sm font-medium text-slate-300 hover:bg-slate-700 transition-colors'"
          >
            {{ page }}
          </button>
        }

        <!-- Next page -->
        <button
          (click)="onPageChange(currentPage + 1)"
          [disabled]="currentPage === totalPages"
          title="Página siguiente"
          class="relative inline-flex items-center px-2 py-2 border border-slate-700 bg-slate-800 text-sm text-slate-400 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="9 18 15 12 9 6"/>
          </svg>
        </button>

        <!-- Last page -->
        <button
          (click)="onPageChange(totalPages)"
          [disabled]="currentPage === totalPages"
          title="Última página"
          class="relative inline-flex items-center px-2 py-2 rounded-r-lg border border-slate-700 bg-slate-800 text-sm text-slate-400 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="13 17 18 12 13 7"/><polyline points="6 17 11 12 6 7"/>
          </svg>
        </button>
      </nav>
    </div>
  `
})
export class PaginationComponent implements OnChanges {
  @Input() totalItems: number = 0;
  @Input() itemsPerPage: number = 10;
  @Input() currentPage: number = 1;

  @Output() pageChange = new EventEmitter<number>();

  totalPages: number = 1;
  pages: number[] = [];
  startIndex: number = 0;
  endIndex: number = 0;
  jumpPage: number | null = null;

  ngOnChanges(changes: SimpleChanges) {
    if (changes['totalItems'] || changes['itemsPerPage'] || changes['currentPage']) {
      this.calculatePagination();
    }
  }

  private calculatePagination() {
    this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage) || 1;

    if (this.currentPage > this.totalPages) {
      this.currentPage = this.totalPages;
      this.pageChange.emit(this.currentPage);
    }

    this.startIndex = (this.currentPage - 1) * this.itemsPerPage;
    this.endIndex = Math.min(this.startIndex + this.itemsPerPage, this.totalItems);
    this.generatePages();
  }

  private generatePages() {
    const maxPagesToShow = 5;
    let startPage: number, endPage: number;

    if (this.totalPages <= maxPagesToShow) {
      startPage = 1;
      endPage = this.totalPages;
    } else {
      const half = Math.floor(maxPagesToShow / 2);
      if (this.currentPage <= half) {
        startPage = 1;
        endPage = maxPagesToShow;
      } else if (this.currentPage + half >= this.totalPages) {
        startPage = this.totalPages - maxPagesToShow + 1;
        endPage = this.totalPages;
      } else {
        startPage = this.currentPage - half;
        endPage = this.currentPage + half;
      }
    }

    this.pages = Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
  }

  onPageChange(page: number) {
    if (page >= 1 && page <= this.totalPages && page !== this.currentPage) {
      this.currentPage = page;
      this.pageChange.emit(this.currentPage);
      this.calculatePagination();
    }
  }

  goToPage() {
    if (this.jumpPage !== null && !isNaN(this.jumpPage)) {
      const target = Math.max(1, Math.min(this.totalPages, Math.floor(this.jumpPage)));
      this.onPageChange(target);
    }
    this.jumpPage = null;
  }
}
