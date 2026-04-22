import { Injectable, signal, effect, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export type AccessibilityTheme = 'normal' | 'light' | 'protanopia' | 'deuteranopia' | 'tritanopia' | 'achromatopsia';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly THEME_KEY = 'autolink-accessibility-theme';
  private platformId = inject(PLATFORM_ID);
  private isBrowser = isPlatformBrowser(this.platformId);
  
  // Signal to track the current theme
  currentTheme = signal<AccessibilityTheme>(this.getInitialTheme());

  constructor() {
    // Effect to apply the theme whenever it changes
    effect(() => {
      const theme = this.currentTheme();
      if (this.isBrowser) {
        this.applyTheme(theme);
        localStorage.setItem(this.THEME_KEY, theme);
      }
    });
  }

  setTheme(theme: AccessibilityTheme) {
    this.currentTheme.set(theme);
  }

  private getInitialTheme(): AccessibilityTheme {
    if (this.isBrowser) {
      const savedTheme = localStorage.getItem(this.THEME_KEY) as AccessibilityTheme;
      return savedTheme || 'normal';
    }
    return 'normal';
  }

  private applyTheme(theme: AccessibilityTheme) {
    if (!this.isBrowser) return;
    
    const root = document.documentElement;
    
    // Remove attribute if it's normal, otherwise set it
    if (theme === 'normal') {
      root.removeAttribute('data-theme');
    } else {
      root.setAttribute('data-theme', theme);
    }
  }
}
