package com.autolink.persistence.repositories;

import java.util.List;

import org.springframework.data.repository.ListCrudRepository;

import com.autolink.persistence.entities.Persona;
import com.autolink.persistence.entities.enums.TipoUsuario;

public interface PersonaRepository extends ListCrudRepository<Persona, Integer>{
	
//	List<Persona> findById(int idPersona);
	
	List<Persona> findByTipoUsuario(TipoUsuario tipoUsuario);

}
