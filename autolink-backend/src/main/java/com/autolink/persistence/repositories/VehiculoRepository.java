package com.autolink.persistence.repositories;

import java.util.List;

import org.springframework.data.repository.ListCrudRepository;

import com.autolink.persistence.entities.Vehiculo;

public interface VehiculoRepository extends ListCrudRepository<Vehiculo, Integer>{

	List<Vehiculo> findByDisponibleTrue();
}
