package com.autolink.services.dto;

import com.autolink.persistence.entities.enums.Rol;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class PersonaDTO {
	private int id;
	private String nombre;
	private String apellidos;
	private String DNI;
	private String correo;
	private Rol rol;
	private Integer telefono;
	private Double salarioAnual;
	private String ciudadAsignada;
	private Boolean activo;
	private String fotoPerfil;
}
