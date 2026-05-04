import { Injectable, inject, signal, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';
import { Mensaje, ConversacionResumen } from '../models/mensaje.model';
import { Client, IMessage } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { environment } from '../../../environments/environment';
import { BehaviorSubject, Observable, filter, map, catchError, of } from 'rxjs';
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

  // Estado para controlar apertura desde otros componentes
  private requestedContact = signal<any | null>(null);
  public externalChatRequest = this.requestedContact.asReadonly();

  // Notificaciones de ofertas y vehículos
  private ofertasSubject = new BehaviorSubject<any>(null);
  public ofertasUpdates$ = this.ofertasSubject.asObservable().pipe(filter(o => o !== null));

  private vehiculosSubject = new BehaviorSubject<any>(null);
  public vehiculosUpdates$ = this.vehiculosSubject.asObservable().pipe(filter(v => v !== null));

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

  public abrirChatCon(contacto: any) {
    this.requestedContact.set(contacto);
  }

  public resetRequest() {
    this.requestedContact.set(null);
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

    // 1. Chat
    this.stompClient.subscribe(`/user/queue/messages`, (message: IMessage) => {
      if (message.body) {
        try {
          const msg: Mensaje = JSON.parse(message.body);
          this.mensajesNuevosSubject.next(msg);
        } catch (e) {
          console.error('Error parseando mensaje chat:', e);
        }
      }
    });

    // 2. Notificaciones privadas (Ofertas)
    this.stompClient.subscribe(`/user/queue/notifications`, (message: IMessage) => {
      if (message.body) {
        try {
          const note = JSON.parse(message.body);
          this.ofertasSubject.next(note);
        } catch (e) {
          console.error('Error parseando notificación oferta:', e);
        }
      }
    });

    // 3. Notificaciones públicas (Vehículos)
    this.stompClient.subscribe(`/topic/vehiculos`, (message: IMessage) => {
      if (message.body) {
        try {
          const note = JSON.parse(message.body);
          this.vehiculosSubject.next(note);
        } catch (e) {
          console.error('Error parseando notificación vehículo:', e);
        }
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

    try {
      this.stompClient.publish({
        destination: '/app/chat.enviar',
        body: JSON.stringify(mensaje)
      });
    } catch (e) {
      console.error('Error publicando mensaje:', e);
    }
  }

  getConversacion(idOtro: number): Observable<Mensaje[]> {
    return this.http.get<Mensaje[]>(`${this.apiUrl}/mensajes/conversacion/${idOtro}`).pipe(
      catchError(err => {
        console.error('Error cargando conversación:', err);
        return of([]);
      })
    );
  }

  getContactos(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/mensajes/contactos`).pipe(
      catchError(err => {
        console.error('Error cargando contactos:', err);
        return of([]);
      })
    );
  }

  getTotalUnreadCount(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/mensajes/sin-leer/total`).pipe(
      catchError(err => {
        console.error('Error cargando total sin leer:', err);
        return of(0);
      })
    );
  }

  marcarComoLeidos(idRemitente: number): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/mensajes/leer/${idRemitente}`, {}).pipe(
      catchError(err => {
        console.error('Error marcando como leídos:', err);
        return of(null);
      })
    );
  }
}
