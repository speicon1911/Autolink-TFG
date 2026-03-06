package com.autolink.services.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class LoginResponse {

	private String access;
	private String refresh;

	// User profile info to avoid 403 on /personas
	private int id;
	private String nombre;
	private String apellidos;
	private String correo;
	private String rol;

}