package com.autolink.services.dto;

import java.time.LocalDate;

import com.autolink.persistence.entities.enums.EstadoVenta;
import com.autolink.persistence.entities.enums.Rol;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class VentaDTO {
    private int idVenta;
    private LocalDate fecha;
    private EstadoVenta estadoVenta;
    private Double precio;
    private Rol rolUltimoModificador;
    private PersonaDTO vendedor;
    private PersonaDTO cliente;
    private VehiculoDTO vehiculo;
}
