package com.autolink.web.controllers;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RestController;

import com.autolink.persistence.entities.Mensaje;
import com.autolink.persistence.entities.Persona;
import com.autolink.services.MensajeService;
import com.autolink.services.PersonaService;
import com.autolink.services.dto.MensajeDTO;
import com.autolink.services.dto.ChatContactoDTO;

import lombok.extern.slf4j.Slf4j;

@RestController
@Slf4j
public class MensajeController {

	@Autowired
	private MensajeService mensajeService;

	@Autowired
	private PersonaService personaService;

	@Autowired
	private SimpMessagingTemplate messagingTemplate;

	@MessageMapping("/chat.enviar")
	public void processMessage(@Payload MensajeDTO mensajeDto) {
		try {
			Mensaje saved = mensajeService.enviarMensaje(mensajeDto.getIdRemitente(), mensajeDto.getIdDestinatario(),
					mensajeDto.getContenido());

			MensajeDTO response = convertToDto(saved);

			// Enviar al destinatario
			messagingTemplate.convertAndSendToUser(saved.getDestinatario().getCorreo(), "/queue/messages", response);

			// También enviar al remitente para confirmación
			messagingTemplate.convertAndSendToUser(saved.getRemitente().getCorreo(), "/queue/messages", response);
		} catch (Exception e) {
			log.error("Error procesando mensaje WebSocket: {}", e.getMessage());
		}
	}

	@GetMapping("/mensajes/conversacion/{idOtro}")
	public ResponseEntity<List<MensajeDTO>> getConversacion(@PathVariable Integer idOtro, Authentication auth) {
		try {
			Persona current = personaService.findByCorreoEntity(auth.getName());
			if (current == null)
				return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();

			List<MensajeDTO> mensajes = mensajeService.getConversacion(current.getId(), idOtro).stream()
					.map(this::convertToDto).collect(Collectors.toList());
			return ResponseEntity.ok(mensajes);
		} catch (Exception e) {
			log.error("Error obteniendo conversación: {}", e.getMessage());
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Collections.emptyList());
		}
	}

	@GetMapping("/mensajes/contactos")
	public ResponseEntity<List<ChatContactoDTO>> getContactos(Authentication auth) {
		try {
			Persona current = personaService.findByCorreoEntity(auth.getName());
			if (current == null)
				return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();

			return ResponseEntity.ok(mensajeService.getChatContactos(current.getId()));
		} catch (Exception e) {
			log.error("Error obteniendo contactos: {}", e.getMessage());
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Collections.emptyList());
		}
	}

	@GetMapping("/mensajes/sin-leer/total")
	public ResponseEntity<Long> getTotalUnread(Authentication auth) {
		try {
			Persona current = personaService.findByCorreoEntity(auth.getName());
			if (current == null)
				return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();

			return ResponseEntity.ok(mensajeService.getTotalUnreadCount(current.getId()));
		} catch (Exception e) {
			log.error("Error obteniendo total de mensajes no leídos: {}", e.getMessage());
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(0L);
		}
	}

	@PutMapping("/mensajes/leer/{idRemitente}")
	public ResponseEntity<Void> marcarComoLeidos(@PathVariable Integer idRemitente, Authentication auth) {
		try {
			Persona current = personaService.findByCorreoEntity(auth.getName());
			if (current == null)
				return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();

			mensajeService.marcarComoLeidos(idRemitente, current.getId());
			return ResponseEntity.ok().build();
		} catch (Exception e) {
			log.error("Error marcando mensajes como leídos: {}", e.getMessage());
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
		}
	}

	private MensajeDTO convertToDto(Mensaje m) {
		return MensajeDTO.builder().id(m.getId()).idRemitente(m.getRemitente().getId())
				.idDestinatario(m.getDestinatario().getId()).nombreRemitente(m.getRemitente().getNombre())
				.contenido(m.getContenido()).fechaEnvio(m.getFechaEnvio()).leido(m.isLeido()).build();
	}
}
