package com.autolink.services.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class RegisterRequest {

	private String nombre;
	private String apellidos;
	private String email;

	@JsonProperty("DNI")
	private String DNI;

	private String password1;
	private String password2;
	private String rol;
	private Integer telefono;
	private String recaptchaToken;

}
