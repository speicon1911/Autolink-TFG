package com.autolink.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Value;

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
	public void notificarRespuestaOferta(String emailDestino, String nombreRemitente, String modeloVehiculo, Double nuevoPrecio) {
	    String asunto = "Nueva respuesta a tu oferta por el " + modeloVehiculo;
	    String cuerpo = "Hola,\n\n" + nombreRemitente + " ha actualizado la oferta por el " + modeloVehiculo + ".\n" +
	                    "El nuevo precio propuesto es: " + nuevoPrecio + "€.\n" +
	                    "Entra en Autolink para aceptar o realizar otra contraoferta.";
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
		String cuerpo = "Hola,\n\nTenemos excelentes noticias. La venta/compra por el vehículo " + modeloVehiculo + 
		                " se ha cerrado formalmente con un precio final de " + precioFinal + "€.\n" +
		                "Por favor, ponte en contacto con la otra parte para organizar la entrega del vehículo.";
		enviarCorreo(emailDestino, asunto, cuerpo);
	}

	public void notificarOfertaCancelada(String emailDestino, String modeloVehiculo) {
		String asunto = "Oferta Anulada - " + modeloVehiculo;
		String cuerpo = "Hola,\n\nTe informamos de que la negociación abierta por el vehículo " + modeloVehiculo +
		                " ha sido cancelada o ya no está disponible.\n" +
		                "Si sigues interesado, busca otras opciones en nuestro catálogo.";
		enviarCorreo(emailDestino, asunto, cuerpo);
	}
}
