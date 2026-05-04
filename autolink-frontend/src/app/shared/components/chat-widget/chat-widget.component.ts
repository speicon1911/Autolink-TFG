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
  public totalUnread = signal<number>(0);
  
  public currentUser = this.authService.currentUser$;
  private subs = new Subscription();

  constructor() {
    // Escuchar mensajes nuevos
    this.subs.add(
      this.chatService.mensajesNuevos$.subscribe((msg: Mensaje) => {
        if (msg) {
          const currentUserId = this.currentUser()?.id;
          const esDelOtro = msg.idRemitente !== currentUserId;
          
          if (this.selectedContact() && esDelOtro &&
              (msg.idRemitente === this.selectedContact().id || msg.idDestinatario === this.selectedContact().id)) {
            this.mensajes.update(ms => [...ms, msg]);
            this.chatService.marcarComoLeidos(msg.idRemitente).subscribe(() => {
              this.updateTotalUnread();
              this.loadContactos();
            });
          } else {
            this.updateTotalUnread();
            this.loadContactos();
          }
        }
      })
    );

    // Responder a solicitudes externas de apertura de chat
    effect(() => {
      const request = this.chatService.externalChatRequest();
      if (request) {
        this.isOpen.set(true);
        this.selectContact(request);
        this.chatService.resetRequest();
      }
    });
  }

  ngOnInit(): void {
    if (this.currentUser()) {
      this.loadContactos();
      this.updateTotalUnread();
    }
  }

  updateTotalUnread() {
    this.chatService.getTotalUnreadCount().subscribe(count => {
      this.totalUnread.set(count);
    });
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
      this.chatService.marcarComoLeidos(contacto.id).subscribe(() => {
        this.loadContactos();
        this.updateTotalUnread();
      });
    });
  }

  backToList() {
    this.selectedContact.set(null);
    this.mensajes.set([]);
    this.loadContactos();
  }

  enviar() {
    const contenido = this.nuevoMensaje().trim();
    if (!contenido || !this.selectedContact()) return;

    const user = this.currentUser();
    if (!user) return;

    // 1. Actualización optimista: mostrar el mensaje de inmediato
    const mensajeOptimista: Mensaje = {
      idRemitente: user.id,
      idDestinatario: this.selectedContact().id,
      contenido: contenido,
      fechaEnvio: new Date().toISOString(),
      leido: false
    };
    this.mensajes.update(ms => [...ms, mensajeOptimista]);
    this.nuevoMensaje.set('');

    // 2. Enviar por WebSocket (la confirmación del servidor se descartará para no duplicar)
    this.chatService.enviarMensaje(this.selectedContact().id, contenido);
  }

  getInitials(user: any): string {
    if (!user) return '?';
    const name = user.nombre || '';
    const surname = user.apellidos || '';
    return ((name.charAt(0) || '') + (surname.charAt(0) || '')).toUpperCase() || '?';
  }
}
