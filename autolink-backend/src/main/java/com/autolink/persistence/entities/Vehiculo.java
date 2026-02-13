package com.autolink.persistence.entities;

import com.autolink.persistence.entities.enums.MarcaVehiculos;
import com.autolink.persistence.entities.enums.TipoVehiculo;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
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

    @Enumerated(EnumType.STRING)
    private MarcaVehiculos marca;

    private String modelo;
    
    private Boolean disponible;

}
