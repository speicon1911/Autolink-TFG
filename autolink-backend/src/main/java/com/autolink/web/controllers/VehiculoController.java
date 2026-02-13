package com.autolink.web.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.autolink.persistence.entities.Vehiculo;
import com.autolink.services.VehiculoService;

@RestController
@RequestMapping("/vehiculos")
public class VehiculoController {

	@Autowired
	private VehiculoService vehiculoService;
	
	@GetMapping
    public List<Vehiculo> listarParaClientes() {
        return this.vehiculoService.getAllVehiculos();
    }
}
