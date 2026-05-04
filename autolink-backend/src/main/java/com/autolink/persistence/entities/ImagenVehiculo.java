package com.autolink.persistence.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "imagenes_vehiculo")
@Getter
@Setter
@NoArgsConstructor
public class ImagenVehiculo {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int id;

	private String url; // url de la imagen

	@ManyToOne
	@JoinColumn(name = "id_vehiculo")
	@JsonIgnore
	private Vehiculo vehiculo;
}
