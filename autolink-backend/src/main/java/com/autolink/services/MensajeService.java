package com.autolink.services;

import java.time.LocalDateTime;
import java.util.List;

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

        return mensajeRepository.save(mensaje);
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

    public List<Persona> getContactos(Integer userId) {
        return mensajeRepository.findContactos(userId);
    }
}
