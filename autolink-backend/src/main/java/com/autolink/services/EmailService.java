package com.autolink.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import com.autolink.persistence.entities.Persona;
import com.autolink.persistence.entities.Vehiculo;
import com.autolink.services.dto.PersonaDTO;
import com.autolink.services.dto.VehiculoDTO;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

@Service
public class EmailService {
	@Autowired
	private JavaMailSender mailSender;

	// Lee el correo del properties
	@Value("${spring.mail.username}")
	private String remitente;

	// Metodo general
	public void enviarCorreo(String destinatario, String asunto, String cuerpo) {
		SimpleMailMessage message = new SimpleMailMessage();
		message.setFrom(remitente);
		message.setTo(destinatario);
		message.setSubject(asunto);
		message.setText(cuerpo);
		mailSender.send(message);
	}

	// ofertas
	public void notificarNuevaOferta(String emailVendedor, String nombreCliente, String modeloVehiculo, Double precio) {
		String asunto = "Has recibido una nueva oferta sobre tu vehiculo";
		String cuerpo = "Hola,\n\n" + nombreCliente + " ha enviado una oferta de " + precio + "€ por tu "
				+ modeloVehiculo + ".\n" + "Revisa tu panel de vendedor para responder.";
		enviarCorreo(emailVendedor, asunto, cuerpo);
	}

	// Método para avisar de una respuesta (contraoferta o cambio de estado)
	public void notificarRespuestaOferta(String emailDestino, String nombreRemitente, String modeloVehiculo,
			Double nuevoPrecio) {
		String asunto = "Nueva respuesta a tu oferta por el " + modeloVehiculo;
		String cuerpo = "Hola,\n\n" + nombreRemitente + " ha actualizado la oferta por el " + modeloVehiculo + ".\n"
				+ "El nuevo precio propuesto es: " + nuevoPrecio + "€.\n"
				+ "Entra en Autolink para aceptar o realizar otra contraoferta.";
		enviarCorreo(emailDestino, asunto, cuerpo);
	}

	// Aviso de cambio de rol
	public void notificarCambioRol(String emailUsuario, String nuevoRol) {
		String asunto = "Actualización de tu cuenta en Autolink";
		String cuerpo = "Hola,\n\nTu cuenta ha sido actualizada. Ahora tienes el rol de: " + nuevoRol + ".";
		enviarCorreo(emailUsuario, asunto, cuerpo);
	}

	public void notificarOfertaAceptada(String emailDestino, String modeloVehiculo, Double precioFinal) {
		String asunto = "¡Venta Cerrada! - " + modeloVehiculo;
		String cuerpo = "Hola,\n\nTenemos excelentes noticias. La venta/compra por el vehículo " + modeloVehiculo
				+ " se ha cerrado formalmente con un precio final de " + precioFinal + "€.\n"
				+ "Por favor, ponte en contacto con la otra parte para organizar la entrega del vehículo.";
		enviarCorreo(emailDestino, asunto, cuerpo);
	}

	public void notificarOfertaCancelada(String emailDestino, String modeloVehiculo) {
		String asunto = "Oferta Anulada - " + modeloVehiculo;
		String cuerpo = "Hola,\n\nTe informamos de que la negociación abierta por el vehículo " + modeloVehiculo
				+ " ha sido cancelada o ya no está disponible.\n"
				+ "Si sigues interesado, busca otras opciones en nuestro catálogo.";
		enviarCorreo(emailDestino, asunto, cuerpo);
	}

	public void enviarCorreoInteresVehiculo(Persona cliente, Vehiculo vehiculo, String mensaje) {
		// 1. Validaciones de seguridad (comprobando objetos intermedios)
		if (vehiculo == null || vehiculo.getVendedor() == null || vehiculo.getVendedor().getCorreo() == null
				|| cliente == null || cliente.getCorreo() == null) {
			throw new RuntimeException("Datos de contacto insuficientes para enviar el email");
		}

		try {
			MimeMessage message = mailSender.createMimeMessage();
			MimeMessageHelper helper = new MimeMessageHelper(message, false, "UTF-8");

			helper.setFrom(remitente);
			helper.setTo(vehiculo.getVendedor().getCorreo());
			helper.setReplyTo(cliente.getCorreo());
			helper.setSubject("AutoLink: Interés en tu " + vehiculo.getModelo());

			// Para la marca también conviene ser precavido
			String nombreMarca = (vehiculo.getMarca() != null) ? vehiculo.getMarca().getNombre() : "Vehículo";

			String cuerpo = String.format(
					"Hola %s,\n\nEl usuario %s está interesado en tu %s %s.\n\nMensaje:\n%s\n\nPuedes responder directamente a este correo.",
					vehiculo.getVendedor().getNombre(), cliente.getNombre(), nombreMarca, vehiculo.getModelo(),
					mensaje);

			helper.setText(cuerpo);
			mailSender.send(message);
		} catch (MessagingException e) {
			throw new RuntimeException("Error técnico al enviar el email");
		}
	}

	public void notificarNuevoMensajeChat(String emailDestino, String nombreRemitente, String extracto) {
		String asunto = "Tienes un nuevo mensaje de chat de " + nombreRemitente;
		String cuerpo = "Hola,\n\nHas recibido un nuevo mensaje de " + nombreRemitente + " en Autolink.\n\n"
				+ "Mensaje: \"" + (extracto.length() > 50 ? extracto.substring(0, 50) + "..." : extracto) + "\"\n\n"
				+ "Entra en la aplicación para responder.";
		enviarCorreo(emailDestino, asunto, cuerpo);
	}
}
