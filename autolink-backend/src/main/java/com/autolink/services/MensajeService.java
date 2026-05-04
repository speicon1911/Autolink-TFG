package com.autolink.services;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import com.autolink.services.dto.ChatContactoDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.autolink.persistence.entities.Mensaje;
import com.autolink.persistence.entities.Persona;
import com.autolink.persistence.repositories.MensajeRepository;
import com.autolink.persistence.repositories.PersonaRepository;

@Service
public class MensajeService {

    @Autowired
    private MensajeRepository mensajeRepository;

    @Autowired
    private PersonaRepository personaRepository;

    @Autowired
    private EmailService emailService;

    @Transactional
    public Mensaje enviarMensaje(Integer idRemitente, Integer idDestinatario, String contenido) {
        Persona remitente = personaRepository.findById(idRemitente)
                .orElseThrow(() -> new RuntimeException("Remitente no encontrado"));
        Persona destinatario = personaRepository.findById(idDestinatario)
                .orElseThrow(() -> new RuntimeException("Destinatario no encontrado"));

        Mensaje mensaje = Mensaje.builder()
                .remitente(remitente)
                .destinatario(destinatario)
                .contenido(contenido)
                .fechaEnvio(LocalDateTime.now())
                .leido(false)
                .build();

        Mensaje saved = mensajeRepository.save(mensaje);

        // Notificar por email de forma asíncrona (aproximada, sin complicar la arquitectura)
        try {
            emailService.notificarNuevoMensajeChat(
                destinatario.getCorreo(), 
                remitente.getNombre() + " " + remitente.getApellidos(), 
                contenido
            );
        } catch (Exception e) {
            // Ignoramos errores de email para no bloquear el chat en tiempo real
            System.err.println("Error enviando notificación de chat: " + e.getMessage());
        }

        return saved;
    }

    public List<Mensaje> getConversacion(Integer user1, Integer user2) {
        // Al obtener la conversación, podríamos marcar como leídos los mensajes que el usuario actual recibe
        List<Mensaje> mensajes = mensajeRepository.findConversacion(user1, user2);
        return mensajes;
    }

    @Transactional
    public void marcarComoLeidos(Integer idRemitente, Integer idDestinatario) {
        List<Mensaje> mensajes = mensajeRepository.findConversacion(idRemitente, idDestinatario);
        for (Mensaje m : mensajes) {
            if (m.getDestinatario().getId() == idDestinatario && !m.isLeido()) {
                m.setLeido(true);
            }
        }
        mensajeRepository.saveAll(mensajes);
    }

    public List<ChatContactoDTO> getChatContactos(Integer userId) {
        List<Persona> personas = mensajeRepository.findContactos(userId);
        List<ChatContactoDTO> dtos = new ArrayList<>();
        
        for (Persona p : personas) {
            long unread = mensajeRepository.countUnreadFromSpecificUser(userId, p.getId());
            dtos.add(ChatContactoDTO.builder()
                    .persona(p)
                    .mensajesNoLeidos(unread)
                    .build());
        }
        return dtos;
    }

    public long getTotalUnreadCount(Integer userId) {
        return mensajeRepository.countTotalUnread(userId);
    }
}
