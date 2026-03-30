package com.autolink.persistence.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.autolink.persistence.entities.Marca;

public interface MarcaRepository extends JpaRepository<Marca, Integer>{

	boolean existsByNombre(String nombre);
	
}
