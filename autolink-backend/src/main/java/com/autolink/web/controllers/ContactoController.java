package com.autolink.web.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.*;
import com.autolink.services.dto.ContactoDTO;
import com.autolink.services.EmailService;

@RestController
@RequestMapping("/api/contacto")
@CrossOrigin(origins = "*") // Importante para que el Frontend pueda llamar aquí
public class ContactoController {

    @Autowired
    private EmailService emailService;

    @Value("${app.admin.email}")
    private String emailAdmin;

    @PostMapping
    public void recibirContacto(@RequestBody ContactoDTO contacto) {
        String asuntoCorreo = "NUEVO CONTACTO: " + contacto.getAsunto();
        String cuerpo = "Has recibido un mensaje de: " + contacto.getNombre() + " (" + contacto.getEmail() + ")\n\n" +
                        "Mensaje:\n" + contacto.getMensaje();
        
        // Enviamos el correo al administrador definido en properties
        emailService.enviarCorreo(emailAdmin, asuntoCorreo, cuerpo);
    }
}
