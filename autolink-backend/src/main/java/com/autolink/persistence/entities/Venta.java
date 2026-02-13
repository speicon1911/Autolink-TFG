package com.autolink.persistence.entities;

import java.time.LocalDate;

import com.autolink.persistence.entities.enums.EstadoVenta;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
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
@Table(name = "venta")
@Getter
@Setter
@NoArgsConstructor
public class Venta {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "id_venta")
	private int idVenta;
	
	private LocalDate fecha;
	
	@Enumerated(value = EnumType.STRING)
	@Column(name = "estado")
	private EstadoVenta estadoVenta;
	
	private Double precio;
	
	@ManyToOne
	@JoinColumn(name = "id_vendedor", nullable = false)
	private Persona vendedor;
	
	@ManyToOne
	@JoinColumn(name = "id_cliente", nullable = false)
	private Persona cliente;

	
}
