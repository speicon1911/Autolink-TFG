package com.autolink.services;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.autolink.persistence.entities.Marca;
import com.autolink.persistence.repositories.MarcaRepository;
import com.autolink.services.dto.MarcaDTO;
import com.autolink.services.mappers.MarcaMapper;
import com.autolink.services.exceptions.MarcaNotFoundException;

@Service
public class MarcaService {

	@Autowired
	private MarcaRepository marcaRepository;

	@Autowired
	private MarcaMapper marcaMapper;

	public List<MarcaDTO> findAll() {
		return this.marcaRepository.findAll().stream()
				.map(marcaMapper::toDto)
				.collect(Collectors.toList());
	}

	// crear
	public MarcaDTO createMarca(MarcaDTO marcaDTO) {
		Marca marca = marcaMapper.toEntity(marcaDTO);
        return marcaMapper.toDto(this.marcaRepository.save(marca));
    }
	
	// eliminar
	public void deleteMarca(int idMarca) {
        if (!this.marcaRepository.existsById(idMarca)) {
            throw new MarcaNotFoundException("No es posible eliminar la marca con ID: " + idMarca);
        }
        this.marcaRepository.deleteById(idMarca);
    }
}
