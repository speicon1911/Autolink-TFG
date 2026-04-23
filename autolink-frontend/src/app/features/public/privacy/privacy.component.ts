import { Component } from '@angular/core';

@Component({
  selector: 'app-privacy',
  standalone: true,
  template: `
    <div class="min-h-screen bg-surface-base text-content-primary py-20 px-4">
      <div class="max-w-3xl mx-auto space-y-8">
        <header class="space-y-4">
          <h1 class="text-4xl font-black tracking-tight text-content-primary italic">Política de Privacidad</h1>
          <p class="text-content-muted font-medium">Última actualización: 16 de marzo de 2026</p>
        </header>

        <section class="space-y-4 bg-surface-card p-8 rounded-2xl border border-white/5 backdrop-blur-sm">
          <h2 class="text-2xl font-bold text-action-primary">1. Información que recopilamos</h2>
          <p class="leading-relaxed text-content-secondary">
            En AutoLink, nos tomamos muy en serio la privacidad de tus datos. Recopilamos información personal básica como tu nombre, correo electrónico y número de teléfono cuando te registras en nuestra plataforma.
          </p>
        </section>

        <section class="space-y-4 bg-surface-card p-8 rounded-2xl border border-white/5 backdrop-blur-sm">
          <h2 class="text-2xl font-bold text-action-primary">2. Uso de la información</h2>
          <p class="leading-relaxed text-content-secondary">
            Utilizamos tus datos exclusivamente para gestionar tu cuenta, facilitar la comunicación entre compradores y vendedores, y mejorar la experiencia de usuario en nuestra plataforma de compraventa de vehículos.
          </p>
        </section>

        <section class="space-y-4 bg-surface-card p-8 rounded-2xl border border-white/5 backdrop-blur-sm">
          <h2 class="text-2xl font-bold text-action-primary">3. Protección de datos</h2>
          <p class="leading-relaxed text-content-secondary">
            Implementamos medidas de seguridad técnicas y organizativas para proteger tus datos contra el acceso no autorizado, la pérdida o la alteración.
          </p>
        </section>

        <footer class="pt-8 border-t border-white/10">
          <p class="text-sm text-content-muted">
            Si tienes alguna duda sobre nuestra política de privacidad, puedes contactarnos a través de nuestra sección de soporte.
          </p>
        </footer>
      </div>
    </div>
  `
})
export class PrivacyComponent {}
