package com.autolink.persistence.repositories;

import org.springframework.data.repository.ListCrudRepository;

import com.autolink.persistence.entities.Persona;

public interface PersonaRepository extends ListCrudRepository<Persona, Integer>{
	
//	List<Persona> findById(int idPersona);

}
