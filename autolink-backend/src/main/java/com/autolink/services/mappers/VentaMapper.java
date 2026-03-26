package com.autolink.services.mappers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.autolink.persistence.entities.Venta;
import com.autolink.services.dto.VentaDTO;

@Component
public class VentaMapper {

    @Autowired
    private PersonaMapper personaMapper;

    @Autowired
    private VehiculoMapper vehiculoMapper;

    public VentaDTO toDto(Venta venta) {
        if (venta == null) {
            return null;
        }
        VentaDTO dto = new VentaDTO();
        dto.setIdVenta(venta.getIdVenta());
        dto.setFecha(venta.getFecha());
        dto.setEstadoVenta(venta.getEstadoVenta());
        dto.setPrecio(venta.getPrecio());
        dto.setRolUltimoModificador(venta.getRolUltimoModificador());
        dto.setVendedor(personaMapper.toDto(venta.getVendedor()));
        dto.setCliente(personaMapper.toDto(venta.getCliente()));
        dto.setVehiculo(vehiculoMapper.toDto(venta.getVehiculo()));
        return dto;
    }

    public Venta toEntity(VentaDTO dto) {
        if (dto == null) {
            return null;
        }
        Venta venta = new Venta();
        venta.setIdVenta(dto.getIdVenta());
        venta.setFecha(dto.getFecha());
        venta.setEstadoVenta(dto.getEstadoVenta());
        venta.setPrecio(dto.getPrecio());
        venta.setRolUltimoModificador(dto.getRolUltimoModificador());
        venta.setVendedor(personaMapper.toEntity(dto.getVendedor()));
        venta.setCliente(personaMapper.toEntity(dto.getCliente()));
        venta.setVehiculo(vehiculoMapper.toEntity(dto.getVehiculo()));
        return venta;
    }
}
