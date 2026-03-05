package com.autolink.services.dto;

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
	private String password1;
	private String password2;
	private String rol;

}
