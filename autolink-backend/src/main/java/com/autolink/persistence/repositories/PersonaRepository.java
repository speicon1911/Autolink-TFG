package com.autolink.persistence.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.autolink.persistence.entities.Persona;
import com.autolink.persistence.entities.enums.Rol;

public interface PersonaRepository extends JpaRepository<Persona, Integer>{
	
	// Paginados
	Page<Persona> findByRol(Rol rol, Pageable pageable);
	Page<Persona> findByActivo(boolean activo, Pageable pageable);
	Page<Persona> findByRolAndActivo(Rol rol, boolean activo, Pageable pageable);
	
	// Listas
	List<Persona> findByRol(Rol rol);
	List<Persona> findByActivo(boolean activo);

	// otros metodos
	Optional<Persona> findByCorreo(String correo);
	boolean existsByDNI(String DNI);
	boolean existsByCorreo(String correo);
}
