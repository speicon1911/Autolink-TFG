export interface Mensaje {
  id?: number;
  idRemitente: number;
  idDestinatario: number;
  nombreRemitente?: string;
  contenido: string;
  fechaEnvio?: string;
  leido: boolean;
}

export interface ConversacionResumen {
  idOtro: number;
  nombreOtro: string;
  ultimoMensaje: string;
  fechaUltimoMensaje: string;
  mensajesNoLeidos: number;
}
