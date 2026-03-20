package com.autolink.web.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.autolink.persistence.entities.Vehiculo;
import com.autolink.persistence.entities.enums.TipoVehiculo;
import com.autolink.persistence.entities.enums.CombustibleVehiculo;
import com.autolink.services.VehiculoService;
import com.autolink.services.dto.VehiculoDTO;

@RestController
@RequestMapping("/vehiculos")
public class VehiculoController {

	@Autowired
	private VehiculoService vehiculoService;

	@GetMapping
	public List<VehiculoDTO> obtenerTodos() {
		return this.vehiculoService.getAllVehiculos();
	}

	@GetMapping("/buscar-disponible")
	public ResponseEntity<?> buscarDisponible() {
		return ResponseEntity.ok(this.vehiculoService.getVehiculosDisponibles());
	}

	@GetMapping("/buscar")
	public ResponseEntity<?> buscarConFiltros(
	    @RequestParam(required = false) String marca,
	    @RequestParam(required = false) String modelo,
	    @RequestParam(required = false) TipoVehiculo tipo,
	    @RequestParam(required = false) CombustibleVehiculo combustible,
	    @RequestParam(required = false) String color,
	    @RequestParam(required = false) Integer minPotencia,
	    @RequestParam(required = false) Integer maxPrecio,
	    @RequestParam(required = false) Integer maxKm,
	    @RequestParam(required = false) Integer plazas,
	    @RequestParam(required = false) Integer anioFabricacion,
	    @RequestParam(defaultValue = "false") boolean disponible, 
	    @RequestParam(defaultValue = "false") boolean verificado,
	    @RequestParam(required = false) Boolean filterDisp,
	    @RequestParam(required = false) Boolean filterVerif
	) {
	    boolean aplicarDisp = (filterDisp != null);
	    boolean aplicarVerif = (filterVerif != null);

	    List<VehiculoDTO> resultados = this.vehiculoService.filtrarVehiculos(
	        marca, modelo, tipo, combustible, color, minPotencia, maxPrecio, maxKm, plazas, anioFabricacion,
	        disponible, aplicarDisp, verificado, aplicarVerif
	    );
	    return ResponseEntity.ok(resultados);
	}
	
	@GetMapping("/vendedor/{idVendedor}")
	public ResponseEntity<List<VehiculoDTO>> getByVendedor(@PathVariable int idVendedor) {
	    return ResponseEntity.ok(this.vehiculoService.getVehiculosPorVendedor(idVendedor));
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

	@PostMapping
	public ResponseEntity<VehiculoDTO> create(@RequestBody Vehiculo vehiculo) {
	    return ResponseEntity.status(HttpStatus.CREATED).body(this.vehiculoService.createVehiculo(vehiculo));
	}

	@DeleteMapping("/{idVehiculo}")
	public ResponseEntity<Void> delete(@PathVariable int idVehiculo) {
	    this.vehiculoService.deleteVehiculo(idVehiculo);
	    return ResponseEntity.noContent().build();
	}
}
