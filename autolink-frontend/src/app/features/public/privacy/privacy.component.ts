import { Component } from '@angular/core';

@Component({
  selector: 'app-privacy',
  standalone: true,
  template: `
    <div class="min-h-screen bg-dark-teal-950 text-pitch-black-50 py-20 px-4">
      <div class="max-w-3xl mx-auto space-y-8">
        <header class="space-y-4">
          <h1 class="text-4xl font-black tracking-tight text-white italic">Política de Privacidad</h1>
          <p class="text-baltic-blue-300/60 font-medium">Última actualización: 16 de marzo de 2026</p>
        </header>

        <section class="space-y-4 bg-white/5 p-8 rounded-2xl border border-white/10 backdrop-blur-sm">
          <h2 class="text-2xl font-bold text-baltic-blue-400">1. Información que recopilamos</h2>
          <p class="leading-relaxed text-pitch-black-200">
            En AutoLink, nos tomamos muy en serio la privacidad de tus datos. Recopilamos información personal básica como tu nombre, correo electrónico y número de teléfono cuando te registras en nuestra plataforma.
          </p>
        </section>

        <section class="space-y-4 bg-white/5 p-8 rounded-2xl border border-white/10 backdrop-blur-sm">
          <h2 class="text-2xl font-bold text-baltic-blue-400">2. Uso de la información</h2>
          <p class="leading-relaxed text-pitch-black-200">
            Utilizamos tus datos exclusivamente para gestionar tu cuenta, facilitar la comunicación entre compradores y vendedores, y mejorar la experiencia de usuario en nuestra plataforma de compraventa de vehículos.
          </p>
        </section>

        <section class="space-y-4 bg-white/5 p-8 rounded-2xl border border-white/10 backdrop-blur-sm">
          <h2 class="text-2xl font-bold text-baltic-blue-400">3. Protección de datos</h2>
          <p class="leading-relaxed text-pitch-black-200">
            Implementamos medidas de seguridad técnicas y organizativas para proteger tus datos contra el acceso no autorizado, la pérdida o la alteración.
          </p>
        </section>

        <footer class="pt-8 border-t border-white/10">
          <p class="text-sm text-baltic-blue-300/40">
            Si tienes alguna duda sobre nuestra política de privacidad, puedes contactarnos a través de nuestra sección de soporte.
          </p>
        </footer>
      </div>
    </div>
  `
})
export class PrivacyComponent {}
