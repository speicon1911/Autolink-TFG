import { Component, Input, Output, EventEmitter } from '@angular/core';


@Component({
    selector: 'app-confirm-modal',
    standalone: true,
    imports: [],
    template: `
    @if (isOpen) {
      <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-surface-base/80 backdrop-blur-sm animate-fade-in">
        <div class="bg-surface-card border border-white/10 rounded-3xl w-full max-w-md shadow-2xl overflow-hidden transform transition-all animate-scale-in">
          <div class="p-6">
            <div class="flex items-center gap-4 mb-4">
              <div class="w-12 h-12 rounded-2xl bg-feedback-warning/10 flex items-center justify-center text-feedback-warning">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 9 0 4"/><path d="m12 17 .01 0"/><circle cx="12" cy="12" r="10"/></svg>
              </div>
              <div>
                <h3 class="text-xl font-black text-content-primary">{{ title }}</h3>
                <p class="text-content-secondary text-sm">{{ message }}</p>
              </div>
            </div>
            <div class="flex gap-3 mt-8">
              <button
                (click)="onCancel()"
                class="flex-1 px-6 py-3 rounded-xl bg-surface-overlay text-content-primary font-bold hover:bg-white/5 transition-all border border-white/5"
                >
                Cancelar
              </button>
              <button
                (click)="onConfirm()"
                class="flex-1 px-6 py-3 rounded-xl bg-action-primary text-surface-base font-bold hover:bg-action-hover transition-all shadow-lg shadow-action-primary/20"
                >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      </div>
    }
    `,
    styles: [`
    .animate-fade-in { animation: fadeIn 0.2s ease-out; }
    .animate-scale-in { animation: scaleIn 0.2s ease-out; }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    @keyframes scaleIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
  `]
})
export class ConfirmModalComponent {
    @Input() isOpen = false;
    @Input() title = 'Confirmar acción';
    @Input() message = '¿Estás seguro de que deseas realizar esta acción?';

    @Output() confirmed = new EventEmitter<void>();
    @Output() cancelled = new EventEmitter<void>();

    onConfirm() {
        this.confirmed.emit();
    }

    onCancel() {
        this.cancelled.emit();
    }
}
