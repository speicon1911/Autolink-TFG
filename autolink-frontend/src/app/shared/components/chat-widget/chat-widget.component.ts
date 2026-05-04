import { Component, OnInit, OnDestroy, inject, signal, effect, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatService } from '../../../core/services/chat.service';
import { AuthService } from '../../../core/services/auth.service';
import { Mensaje } from '../../../core/models/mensaje.model';
import { User } from '../../../core/models/user.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-chat-widget',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat-widget.component.html',
  styleUrl: './chat-widget.component.css'
})
export class ChatWidgetComponent implements OnInit, OnDestroy, AfterViewChecked {
  private readonly chatService = inject(ChatService);
  private readonly authService = inject(AuthService);

  @ViewChild('scrollMe') private myScrollContainer!: ElementRef;

  public isOpen = signal<boolean>(false);
  public selectedContact = signal<any | null>(null);
  public contactos = signal<any[]>([]);
  public mensajes = signal<Mensaje[]>([]);
  public nuevoMensaje = signal<string>('');
  
  public currentUser = this.authService.currentUser$;
  private subs = new Subscription();

  constructor() {
    // Escuchar mensajes nuevos
    this.subs.add(
      this.chatService.mensajesNuevos$.subscribe((msg: Mensaje) => {
        if (msg) {
          // Si es el chat abierto, añadirlo
          if (this.selectedContact() && (msg.idRemitente === this.selectedContact().id || msg.idDestinatario === this.selectedContact().id)) {
            this.mensajes.update(ms => [...ms, msg]);
            if (msg.idRemitente === this.selectedContact().id) {
              this.chatService.marcarComoLeidos(msg.idRemitente).subscribe();
            }
          }
          // Recargar lista de contactos para actualizar últimos mensajes/leídos
          this.loadContactos();
        }
      })
    );
  }

  ngOnInit(): void {
    if (this.currentUser()) {
      this.loadContactos();
    }
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  scrollToBottom(): void {
    try {
      this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
    } catch(err) { }
  }

  toggleChat() {
    this.isOpen.update(v => !v);
    if (this.isOpen() && !this.selectedContact()) {
      this.loadContactos();
    }
  }

  loadContactos() {
    this.chatService.getContactos().subscribe((res: any[]) => {
      this.contactos.set(res);
    });
  }

  selectContact(contacto: any) {
    this.selectedContact.set(contacto);
    this.chatService.getConversacion(contacto.id).subscribe((res: Mensaje[]) => {
      this.mensajes.set(res);
      this.chatService.marcarComoLeidos(contacto.id).subscribe(() => this.loadContactos());
    });
  }

  backToList() {
    this.selectedContact.set(null);
    this.mensajes.set([]);
    this.loadContactos();
  }

  enviar() {
    if (!this.nuevoMensaje().trim() || !this.selectedContact()) return;

    this.chatService.enviarMensaje(this.selectedContact().id, this.nuevoMensaje());
    
    // El mensaje nos llegará de vuelta por el WebSocket y se añadirá solo
    this.nuevoMensaje.set('');
  }
}
