package com.autolink.services.mappers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.autolink.persistence.entities.Vehiculo;
import com.autolink.services.dto.ImagenVehiculoDTO;
import com.autolink.services.dto.VehiculoDTO;

@Component
public class VehiculoMapper {

    @Autowired
    private MarcaMapper marcaMapper;

    @Autowired
    private PersonaMapper personaMapper;

    public VehiculoDTO toDto(Vehiculo vehiculo) {
        if (vehiculo == null) {
            return null;
        }
        VehiculoDTO dto = new VehiculoDTO();
        dto.setIdVehiculo(vehiculo.getIdVehiculo());
        dto.setPrecio(vehiculo.getPrecio());
        dto.setPlazas(vehiculo.getPlazas());
        dto.setPotencia(vehiculo.getPotencia());
        dto.setPuertas(vehiculo.getPuertas());
        dto.setKilometraje(vehiculo.getKilometraje());
        dto.setColor(vehiculo.getColor());
        dto.setCombustible(vehiculo.getCombustible());
        dto.setTipoVehiculo(vehiculo.getTipoVehiculo());
        dto.setModelo(vehiculo.getModelo());
        dto.setAnioFabricacion(vehiculo.getAnioFabricacion());
        dto.setDisponible(vehiculo.getDisponible());
        dto.setVerificado(vehiculo.getVerificado());
        dto.setFechaVerificacion(vehiculo.getFechaVerificacion());
        dto.setMarca(marcaMapper.toDto(vehiculo.getMarca()));
        dto.setVendedor(personaMapper.toDto(vehiculo.getVendedor()));
        if (vehiculo.getImagenes() != null) {
            dto.setImagenes(vehiculo.getImagenes().stream()
                .map(img -> {
                    ImagenVehiculoDTO imgDto = new ImagenVehiculoDTO();
                    imgDto.setId(img.getId());
                    imgDto.setUrl(img.getUrl());
                    return imgDto;
                }).toList());
        }
        return dto;
    }

    public Vehiculo toEntity(VehiculoDTO dto) {
        if (dto == null) {
            return null;
        }
        Vehiculo vehiculo = new Vehiculo();
        vehiculo.setIdVehiculo(dto.getIdVehiculo());
        vehiculo.setPrecio(dto.getPrecio());
        vehiculo.setPlazas(dto.getPlazas());
        vehiculo.setPotencia(dto.getPotencia());
        vehiculo.setPuertas(dto.getPuertas());
        vehiculo.setKilometraje(dto.getKilometraje());
        vehiculo.setColor(dto.getColor());
        vehiculo.setCombustible(dto.getCombustible());
        vehiculo.setTipoVehiculo(dto.getTipoVehiculo());
        vehiculo.setModelo(dto.getModelo());
        vehiculo.setAnioFabricacion(dto.getAnioFabricacion());
        vehiculo.setDisponible(dto.getDisponible());
        vehiculo.setVerificado(dto.getVerificado());
        vehiculo.setFechaVerificacion(dto.getFechaVerificacion());
        vehiculo.setMarca(marcaMapper.toEntity(dto.getMarca()));
        vehiculo.setVendedor(personaMapper.toEntity(dto.getVendedor()));
        return vehiculo;
    }
}
