package com.autolink.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.autolink.persistence.entities.Marca;
import com.autolink.persistence.repositories.MarcaRepository;
import com.autolink.services.dto.MarcaDTO;
import com.autolink.services.exceptions.MarcaNotFoundException;
import com.autolink.services.mappers.MarcaMapper;

@Service
public class MarcaService {

	@Autowired
	private MarcaRepository marcaRepository;

	@Autowired
	private MarcaMapper marcaMapper;

	public Page<MarcaDTO> findAll(Pageable pageable) {
		Page<Marca> resultado = this.marcaRepository.findAll(pageable);
		return resultado.map(marcaMapper::toDto);
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
