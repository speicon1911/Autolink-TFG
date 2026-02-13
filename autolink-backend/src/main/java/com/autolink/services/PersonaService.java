package com.autolink.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.autolink.persistence.entities.Persona;
import com.autolink.persistence.repositories.PersonaRepository;
import com.autolink.services.exceptions.PersonaNotFoundException;

@Service
public class PersonaService {

	@Autowired
	private PersonaRepository personaRepository;
	
	// Obtener todas las personas
	public List<Persona> findAll(){
		return this.personaRepository.findAll();
	}
	
	public Persona findById(int idPersona) {
		if(!this.personaRepository.existsById(idPersona)) {
			throw new PersonaNotFoundException("No es posible encontrar a la persona con ID: " + idPersona);
		}
		return this.personaRepository.findById(idPersona).get();
	}
}
