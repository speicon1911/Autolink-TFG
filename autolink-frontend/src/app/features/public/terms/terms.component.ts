import { Component } from '@angular/core';

@Component({
  selector: 'app-terms',
  standalone: true,
  template: `
    <div class="min-h-screen bg-dark-teal-950 text-pitch-black-50 py-20 px-4">
      <div class="max-w-3xl mx-auto space-y-8">
        <header class="space-y-4">
          <h1 class="text-4xl font-black tracking-tight text-white italic">Términos de Servicio</h1>
          <p class="text-baltic-blue-300/60 font-medium">Última actualización: 16 de marzo de 2026</p>
        </header>

        <section class="space-y-4 bg-white/5 p-8 rounded-2xl border border-white/10 backdrop-blur-sm">
          <h2 class="text-2xl font-bold text-dark-amaranth-400">1. Aceptación de términos</h2>
          <p class="leading-relaxed text-pitch-black-200">
            Al acceder y utilizar AutoLink, aceptas cumplir con estos términos y condiciones. Si no estás de acuerdo con alguna parte, por favor, no utilices el servicio.
          </p>
        </section>

        <section class="space-y-4 bg-white/5 p-8 rounded-2xl border border-white/10 backdrop-blur-sm">
          <h2 class="text-2xl font-bold text-dark-amaranth-400">2. Responsabilidades del usuario</h2>
          <p class="leading-relaxed text-pitch-black-200">
            Los usuarios son responsables de la veracidad de la información proporcionada al publicar vehículos. AutoLink no se hace responsable de las transacciones privadas entre usuarios, actuando únicamente como plataforma de contacto.
          </p>
        </section>

        <section class="space-y-4 bg-white/5 p-8 rounded-2xl border border-white/10 backdrop-blur-sm">
          <h2 class="text-2xl font-bold text-dark-amaranth-400">3. Propiedad intelectual</h2>
          <p class="leading-relaxed text-pitch-black-200">
            Todo el contenido presente en esta plataforma, incluyendo logos, diseños y software, es propiedad de AutoLink o sus licenciantes y está protegido por las leyes de propiedad intelectual.
          </p>
        </section>

        <footer class="pt-8 border-t border-white/10">
          <p class="text-sm text-baltic-blue-300/40">
            Nos reservamos el derecho de modificar estos términos en cualquier momento. El uso continuado de la plataforma implica la aceptación de los nuevos términos.
          </p>
        </footer>
      </div>
    </div>
  `
})
export class TermsComponent {}
