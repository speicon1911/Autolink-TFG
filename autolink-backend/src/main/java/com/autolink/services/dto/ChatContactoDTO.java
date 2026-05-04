package com.autolink.services.dto;

import com.autolink.persistence.entities.Persona;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChatContactoDTO {
	private Persona persona;
	private long mensajesNoLeidos;
	private String ultimoMensaje;
}
