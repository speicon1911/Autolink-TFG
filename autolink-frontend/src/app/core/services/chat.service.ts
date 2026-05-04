import { Injectable, inject, signal, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';
import { Mensaje, ConversacionResumen } from '../models/mensaje.model';
import { Client, IMessage } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { environment } from '../../../environments/environment';
import { BehaviorSubject, Observable, filter, map } from 'rxjs';
import { toObservable } from '@angular/core/rxjs-interop';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private readonly http = inject(HttpClient);
  private readonly authService = inject(AuthService);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly apiUrl = environment.apiUrl;

  private stompClient: Client | null = null;
  private mensajesNuevosSubject = new BehaviorSubject<Mensaje | null>(null);
  public mensajesNuevos$ = this.mensajesNuevosSubject.asObservable().pipe(filter(m => m !== null));

  private connected = signal<boolean>(false);
  public isConnected = this.connected.asReadonly();

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      toObservable(this.authService.currentUser$).subscribe(user => {
        if (user) {
          this.connect();
        } else {
          this.disconnect();
        }
      });
    }
  }

  private connect() {
    if (this.stompClient && this.stompClient.connected) return;

    const token = this.authService.getAccessToken();
    if (!token) return;

    this.stompClient = new Client({
      webSocketFactory: () => new SockJS(`${this.apiUrl}/ws`),
      connectHeaders: {
        Authorization: `Bearer ${token}`
      },
      debug: (str) => {
        // console.log(str);
      },
      onConnect: () => {
        this.connected.set(true);
        this.subscribeToPrivateMessages();
      },
      onStompError: (frame) => {
        console.error('Broker reported error: ' + frame.headers['message']);
        console.error('Additional details: ' + frame.body);
        this.connected.set(false);
      },
      onDisconnect: () => {
        this.connected.set(false);
      }
    });

    this.stompClient.activate();
  }

  private disconnect() {
    if (this.stompClient) {
      this.stompClient.deactivate();
      this.connected.set(false);
    }
  }

  private subscribeToPrivateMessages() {
    const user = this.authService.currentUser$();
    if (!user || !this.stompClient) return;

    // Suscribirse a la cola de usuario del backend
    // En el backend enviamos a /user/{email}/queue/messages
    this.stompClient.subscribe(`/user/queue/messages`, (message: IMessage) => {
      if (message.body) {
        const msg: Mensaje = JSON.parse(message.body);
        this.mensajesNuevosSubject.next(msg);
      }
    });
  }

  enviarMensaje(idDestinatario: number, contenido: string) {
    const user = this.authService.currentUser$();
    if (!user || !this.stompClient || !this.connected()) return;

    const mensaje: Mensaje = {
      idRemitente: user.id,
      idDestinatario: idDestinatario,
      contenido: contenido,
      leido: false
    };

    this.stompClient.publish({
      destination: '/app/chat.enviar',
      body: JSON.stringify(mensaje)
    });
  }

  getConversacion(idOtro: number): Observable<Mensaje[]> {
    return this.http.get<Mensaje[]>(`${this.apiUrl}/mensajes/conversacion/${idOtro}`);
  }

  getContactos(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/mensajes/contactos`);
  }

  marcarComoLeidos(idRemitente: number): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/mensajes/leer/${idRemitente}`, {});
  }
}
