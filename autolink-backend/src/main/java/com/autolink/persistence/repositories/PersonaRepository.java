package com.autolink.persistence.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.repository.ListCrudRepository;

import com.autolink.persistence.entities.Persona;
import com.autolink.persistence.entities.enums.Rol;

public interface PersonaRepository extends ListCrudRepository<Persona, Integer>{
	
//	List<Persona> findById(int idPersona);
	
	List<Persona> findByRol(Rol rol);
	Optional<Persona> findByCorreo(String correo);
	List<Persona> findByActivo(boolean activo);

}
