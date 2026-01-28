package com.autolink.persistence.entities;

import java.time.LocalDate;

import com.autolink.persistence.entities.personas.Persona;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
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
@Table(name = "mensaje")
@Getter
@Setter
@NoArgsConstructor
public class Mensaje {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_mensaje")
    private int id;

    private LocalDate fecha;
    private String asunto;

    // Relacion con persona
    // Muchos mensajes son enviados por UNA Persona
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "remitente_id") // Nombre de la columna en BD
    private Persona remitente;

    // Muchos mensajes son recibidos por UNA Persona
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "destinatario_id") // Nombre de la columna en BD
    private Persona destinatario;
}
