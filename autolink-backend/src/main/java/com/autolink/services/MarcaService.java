package com.autolink.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.autolink.persistence.entities.Marca;
import com.autolink.persistence.repositories.MarcaRepository;
import com.autolink.services.dto.MarcaDTO;
import com.autolink.services.exceptions.MarcaExceptions;
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
	@Transactional
	public MarcaDTO createMarca(MarcaDTO marcaDTO) {
		if (this.marcaRepository.existsByNombre(marcaDTO.getNombre())) {
			throw new MarcaExceptions("La marca '" + marcaDTO.getNombre() + "' ya está en el sistema");
		}

		Marca marca = marcaMapper.toEntity(marcaDTO);
		Marca guarda = this.marcaRepository.save(marca);

		return marcaMapper.toDto(guarda);
	}

	// eliminar
	@Transactional
	public void deleteMarca(int idMarca) {
		Marca marca = this.marcaRepository.findById(idMarca)
				.orElseThrow(() -> new MarcaNotFoundException("No es posible encontrar la marca con ID: " + idMarca));

		// Comprobamos si tiene vehículos asociados para evitar el error de integridad
		if (marca.getVehiculos() != null && !marca.getVehiculos().isEmpty()) {
			throw new MarcaExceptions("No se puede eliminar la marca '" + marca.getNombre() + "' porque tiene vehículos asociados");
		}

		this.marcaRepository.delete(marca);
	}
}
