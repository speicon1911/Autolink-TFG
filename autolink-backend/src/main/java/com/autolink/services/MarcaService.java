package com.autolink.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.autolink.persistence.entities.Marca;
import com.autolink.persistence.repositories.MarcaRepository;
import com.autolink.services.exceptions.MarcaNotFoundException;

@Service
public class MarcaService {

	@Autowired
	private MarcaRepository marcaRepository;

	public List<Marca> findAll() {
		return this.marcaRepository.findAll();
	}

	// crear
	public Marca createMarca(Marca marca) {
        return this.marcaRepository.save(marca);
    }
	
	// eliminar
	public void deleteMarca(int idMarca) {
        if (!this.marcaRepository.existsById(idMarca)) {
            throw new MarcaNotFoundException("No es posible eliminar la marca con ID: " + idMarca);
        }
        this.marcaRepository.deleteById(idMarca);
    }

}
