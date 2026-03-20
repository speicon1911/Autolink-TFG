package com.autolink.services.dto;

import java.time.LocalDate;

import com.autolink.persistence.entities.enums.CombustibleVehiculo;
import com.autolink.persistence.entities.enums.TipoVehiculo;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class VehiculoDTO {
    private int idVehiculo;
    private Integer precio;
    private Integer plazas;
    private Integer potencia;
    private Integer puertas;
    private Integer kilometraje;
    private String color;
    private CombustibleVehiculo combustible;
    private TipoVehiculo tipoVehiculo;
    private MarcaDTO marca;
    private String modelo;
    private int anioFabricacion;
    private Boolean disponible;
    private Boolean verificado;
    private LocalDate fechaVerificacion;
    private PersonaDTO vendedor;
}
