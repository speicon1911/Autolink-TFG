package com.autolink.web.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.autolink.persistence.entities.Vehiculo;
import com.autolink.persistence.entities.enums.MarcaVehiculos;
import com.autolink.persistence.entities.enums.TipoVehiculo;
import com.autolink.services.VehiculoService;

@RestController
@RequestMapping("/vehiculos")
public class VehiculoController {

	@Autowired
	private VehiculoService vehiculoService;

	@GetMapping
	public List<Vehiculo> obtenerTodos() {
		return this.vehiculoService.getAllVehiculos();
	}

	@GetMapping("/buscar-disponible")
	public ResponseEntity<?> buscarDisponible() {
		return ResponseEntity.ok(this.vehiculoService.getVehiculosDisponibles());
	}

	@GetMapping("/buscar")
	public ResponseEntity<?> buscarConFiltros(@RequestParam(required = false) MarcaVehiculos marca,
			@RequestParam(required = false) String modelo, @RequestParam(required = false) TipoVehiculo tipo,
			@RequestParam(required = false) String color, @RequestParam(required = false) Integer minPotencia,
			@RequestParam(required = false) Integer maxPrecio, @RequestParam(required = false) Integer maxKm,
			@RequestParam(required = false) Integer plazas, @RequestParam(required = false) Boolean disponible) {
		List<Vehiculo> resultados = this.vehiculoService.filtrarVehiculos(marca, modelo, tipo, color, minPotencia,
				maxPrecio, maxKm, plazas, disponible);
		return ResponseEntity.ok(resultados);
	}

	@PutMapping("/{idVehiculo}")
	public ResponseEntity<?> updateVehiculo(@PathVariable int idVehiculo, @RequestBody Vehiculo vehiculo) {
		return ResponseEntity.ok(this.vehiculoService.updateVehiculo(vehiculo, idVehiculo));
	}

	@PutMapping("/{idVehiculo}/disponible")
	public ResponseEntity<?> updateDisponible(@PathVariable int idVehiculo, @RequestBody Boolean disponible) {
		return ResponseEntity.ok(this.vehiculoService.updateDisponible(disponible, idVehiculo));
	}

	@PutMapping("/{idVehiculo}/verificado")
	public ResponseEntity<?> updateVerificado(@PathVariable int idVehiculo, @RequestBody Boolean verificado) {
		return ResponseEntity.ok(this.vehiculoService.updateVerificado(verificado, idVehiculo));
	}

}
