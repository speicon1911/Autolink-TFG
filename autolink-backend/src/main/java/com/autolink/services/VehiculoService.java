package com.autolink.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.autolink.persistence.entities.Vehiculo;
import com.autolink.persistence.repositories.VehiculoRepository;

@Service
public class VehiculoService {

	@Autowired
	private VehiculoRepository vehiculoRepository;
	public List<Vehiculo> getAllVehiculos() {
        return this.vehiculoRepository.findAll();
    }
}
