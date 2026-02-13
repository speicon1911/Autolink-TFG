package com.autolink.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.autolink.persistence.entities.Vehiculo;
import com.autolink.persistence.repositories.VehiculoRepository;
import com.autolink.services.exceptions.VehiculoNotFoundException;

@Service
public class VehiculoService {

	@Autowired
	private VehiculoRepository vehiculoRepository;
	public List<Vehiculo> getAllVehiculos() {
        return this.vehiculoRepository.findAll();
    }
	
	public List<Vehiculo> getVehiculosDisponibles() {
		List<Vehiculo> vehiculos = this.vehiculoRepository.findByDisponibleTrue();
		if(vehiculos.isEmpty()) {
			throw new VehiculoNotFoundException("No se han encontrado vehiculos disponibles");
		}
		return vehiculos;
	}
}
