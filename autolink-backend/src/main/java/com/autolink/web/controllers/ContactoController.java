package com.autolink.web.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.autolink.persistence.entities.Persona;
import com.autolink.persistence.entities.Vehiculo;
import com.autolink.services.EmailService;
import com.autolink.services.PersonaService;
import com.autolink.services.VehiculoService;
import com.autolink.services.dto.ContactoDTO;
import com.autolink.services.exceptions.PersonaExceptions;

@RestController
@RequestMapping("/api/contacto")
@CrossOrigin(origins = "*") // Importante para que el Frontend pueda llamar aquí
public class ContactoController {

	@Autowired
	private EmailService emailService;

	@Autowired
	private PersonaService personaService;

	@Autowired
	private VehiculoService vehiculoService;

	@Autowired
	private com.autolink.services.RecaptchaService recaptchaService;

	@Value("${app.admin.email}")
	private String emailAdmin;

	@PostMapping
	public void recibirContacto(@RequestBody ContactoDTO contacto) {
		// Validar reCAPTCHA
		if (contacto.getRecaptchaToken() == null || !this.recaptchaService.validarToken(contacto.getRecaptchaToken())) {
			throw new PersonaExceptions(
					"La verificación de seguridad de reCAPTCHA ha fallado. Inténtalo de nuevo.");
		}

		String asuntoCorreo = "NUEVO CONTACTO: " + contacto.getAsunto();
		String cuerpo = "Has recibido un mensaje de: " + contacto.getNombre() + " (" + contacto.getEmail() + ")\n\n"
				+ "Mensaje:\n" + contacto.getMensaje();

		// Enviamos el correo al administrador definido en properties
		emailService.enviarCorreo(emailAdmin, asuntoCorreo, cuerpo);
	}

	@PostMapping("vehiculo/{idVehiculo}")
	public void contactarVendedor(@PathVariable int idVehiculo, @RequestBody ContactoDTO contacto) {
		// obtener cliente logueado
		String emailCliente = SecurityContextHolder.getContext().getAuthentication().getName();

		// 2. Cargamos las entidades usando sus servicios específicos
		Persona cliente = personaService.findByCorreoEntity(emailCliente);
		Vehiculo vehiculo = vehiculoService.findByIdEntity(idVehiculo);

		// 3. Delegamos el envío al servicio de email
		emailService.enviarCorreoInteresVehiculo(cliente, vehiculo, contacto.getMensaje());

	}
}
