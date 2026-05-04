package com.autolink.services.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class ContactoDTO {
	private String nombre;
	private String email;
	private String asunto;
	private String mensaje;
}
