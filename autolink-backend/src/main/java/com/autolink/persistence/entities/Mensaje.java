package com.autolink.persistence.entities;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "mensajes")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Mensaje {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer id;

	@ManyToOne
	@JoinColumn(name = "remitente_id", nullable = false)
	private Persona remitente;

	@ManyToOne
	@JoinColumn(name = "destinatario_id", nullable = false)
	private Persona destinatario;

	@Column(nullable = false, length = 1000)
	private String contenido;

	@Column(name = "fecha_envio", nullable = false)
	private LocalDateTime fechaEnvio;

	@Column(nullable = false)
	private boolean leido;
}
