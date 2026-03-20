package com.autolink.services.mappers;

import org.springframework.stereotype.Component;

import com.autolink.persistence.entities.Marca;
import com.autolink.services.dto.MarcaDTO;

@Component
public class MarcaMapper {

    public MarcaDTO toDto(Marca marca) {
        if (marca == null) {
            return null;
        }
        MarcaDTO dto = new MarcaDTO();
        dto.setIdMarca(marca.getIdMarca());
        dto.setNombre(marca.getNombre());
        return dto;
    }

    public Marca toEntity(MarcaDTO dto) {
        if (dto == null) {
            return null;
        }
        Marca marca = new Marca();
        marca.setIdMarca(dto.getIdMarca());
        marca.setNombre(dto.getNombre());
        return marca;
    }
}
