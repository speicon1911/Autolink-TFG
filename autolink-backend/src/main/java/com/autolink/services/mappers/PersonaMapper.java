package com.autolink.services.mappers;

import org.springframework.stereotype.Component;

import com.autolink.persistence.entities.Persona;
import com.autolink.services.dto.PersonaDTO;

@Component
public class PersonaMapper {

    public PersonaDTO toDto(Persona persona) {
        if (persona == null) {
            return null;
        }
        PersonaDTO dto = new PersonaDTO();
        dto.setId(persona.getId());
        dto.setNombre(persona.getNombre());
        dto.setApellidos(persona.getApellidos());
        dto.setDNI(persona.getDNI());
        dto.setCorreo(persona.getCorreo());
        dto.setRol(persona.getRol());
        dto.setTelefono(persona.getTelefono());
        dto.setSalarioAnual(persona.getSalarioAnual());
        dto.setCiudadAsignada(persona.getCiudadAsignada());
        dto.setActivo(persona.getActivo());
        return dto;
    }

    public Persona toEntity(PersonaDTO dto) {
        if (dto == null) {
            return null;
        }
        Persona persona = new Persona();
        persona.setId(dto.getId());
        persona.setNombre(dto.getNombre());
        persona.setApellidos(dto.getApellidos());
        persona.setDNI(dto.getDNI());
        persona.setCorreo(dto.getCorreo());
        persona.setRol(dto.getRol());
        persona.setTelefono(dto.getTelefono());
        persona.setSalarioAnual(dto.getSalarioAnual());
        persona.setCiudadAsignada(dto.getCiudadAsignada());
        persona.setActivo(dto.getActivo());
        return persona;
    }
}
