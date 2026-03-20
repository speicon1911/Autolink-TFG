package com.autolink.services.mappers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.autolink.persistence.entities.Venta;
import com.autolink.services.dto.VentaDTO;

@Component
public class VentaMapper {

    @Autowired
    private PersonaMapper personaMapper;

    public VentaDTO toDto(Venta venta) {
        if (venta == null) {
            return null;
        }
        VentaDTO dto = new VentaDTO();
        dto.setIdVenta(venta.getIdVenta());
        dto.setFecha(venta.getFecha());
        dto.setEstadoVenta(venta.getEstadoVenta());
        dto.setPrecio(venta.getPrecio());
        dto.setVendedor(personaMapper.toDto(venta.getVendedor()));
        dto.setCliente(personaMapper.toDto(venta.getCliente()));
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
        venta.setVendedor(personaMapper.toEntity(dto.getVendedor()));
        venta.setCliente(personaMapper.toEntity(dto.getCliente()));
        return venta;
    }
}
