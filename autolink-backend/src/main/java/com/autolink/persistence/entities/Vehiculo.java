package com.autolink.persistence.entities;

import java.time.LocalDate;

import com.autolink.persistence.entities.enums.TipoVehiculo;
import com.fasterxml.jackson.annotation.JsonIgnore;

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

@Table(name = "vehiculo")
@Getter
@Setter
@NoArgsConstructor
@Entity
public class Vehiculo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_vehiculo")
    private int idVehiculo;

    private Integer precio;

    private Integer plazas;

    private Integer potencia;

    private Integer puertas;

    private Integer kilometraje;

    private String color;

    @Column(name = "tipo_vehiculo")
    @Enumerated(EnumType.STRING)
    private TipoVehiculo tipoVehiculo;

    @ManyToOne
    @JoinColumn(name = "id_marca")
    @JsonIgnore
    private Marca marca;

    private String modelo;

    @Column(name = "fecha_fabricacion")
    private LocalDate fechaFabricacion;

    private boolean disponible;

    private boolean verificado;

}
