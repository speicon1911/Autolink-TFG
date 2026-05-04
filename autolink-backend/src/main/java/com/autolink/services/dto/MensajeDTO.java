package com.autolink.services.dto;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MensajeDTO {
	private Integer id;
	private Integer idRemitente;
	private Integer idDestinatario;
	private String nombreRemitente;
	private String contenido;
	private LocalDateTime fechaEnvio;
	private boolean leido;
}
