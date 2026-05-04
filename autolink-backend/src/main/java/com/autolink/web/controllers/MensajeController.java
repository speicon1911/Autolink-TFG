package com.autolink.web.controllers;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
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

@RestController
public class MensajeController {

    @Autowired
    private MensajeService mensajeService;

    @Autowired
    private PersonaService personaService;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @MessageMapping("/chat.enviar")
    public void processMessage(@Payload MensajeDTO mensajeDto) {
        Mensaje saved = mensajeService.enviarMensaje(
                mensajeDto.getIdRemitente(),
                mensajeDto.getIdDestinatario(),
                mensajeDto.getContenido()
        );

        MensajeDTO response = MensajeDTO.builder()
                .id(saved.getId())
                .idRemitente(saved.getRemitente().getId())
                .idDestinatario(saved.getDestinatario().getId())
                .nombreRemitente(saved.getRemitente().getNombre())
                .contenido(saved.getContenido())
                .fechaEnvio(saved.getFechaEnvio())
                .leido(saved.isLeido())
                .build();

        // Enviar al destinatario
        messagingTemplate.convertAndSendToUser(
                saved.getDestinatario().getCorreo(),
                "/queue/messages",
                response
        );
        
        // También enviar al remitente para confirmación (opcional si el front ya lo muestra)
        messagingTemplate.convertAndSendToUser(
                saved.getRemitente().getCorreo(),
                "/queue/messages",
                response
        );
    }

    @GetMapping("/mensajes/conversacion/{idOtro}")
    public List<MensajeDTO> getConversacion(@PathVariable Integer idOtro, Authentication auth) {
        Persona current = personaService.findByCorreoEntity(auth.getName());
        return mensajeService.getConversacion(current.getId(), idOtro).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @GetMapping("/mensajes/contactos")
    public List<Persona> getContactos(Authentication auth) {
        Persona current = personaService.findByCorreoEntity(auth.getName());
        return mensajeService.getContactos(current.getId());
    }

    @PutMapping("/mensajes/leer/{idRemitente}")
    public void marcarComoLeidos(@PathVariable Integer idRemitente, Authentication auth) {
        Persona current = personaService.findByCorreoEntity(auth.getName());
        mensajeService.marcarComoLeidos(idRemitente, current.getId());
    }

    private MensajeDTO convertToDto(Mensaje m) {
        return MensajeDTO.builder()
                .id(m.getId())
                .idRemitente(m.getRemitente().getId())
                .idDestinatario(m.getDestinatario().getId())
                .nombreRemitente(m.getRemitente().getNombre())
                .contenido(m.getContenido())
                .fechaEnvio(m.getFechaEnvio())
                .leido(m.isLeido())
                .build();
    }
}
