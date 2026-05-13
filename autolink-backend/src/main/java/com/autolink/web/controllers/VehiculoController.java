package com.autolink.web.controllers;

import java.io.IOException;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
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
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.autolink.persistence.entities.Vehiculo;
import com.autolink.persistence.entities.enums.CombustibleVehiculo;
import com.autolink.persistence.entities.enums.EtiquetaMedioambiental;
import com.autolink.persistence.entities.enums.EstadoVerificacion;
import com.autolink.persistence.entities.enums.TipoVehiculo;
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

	@GetMapping("/{idVehiculo}")
	public ResponseEntity<VehiculoDTO> findById(@PathVariable int idVehiculo) {
		return ResponseEntity.ok(this.vehiculoService.findById(idVehiculo));
	}

	@GetMapping("/buscar-disponible")
	public ResponseEntity<?> buscarDisponible(@RequestParam(defaultValue = "0") int page,
			@RequestParam(defaultValue = "12") int size) {
		Pageable pageable = PageRequest.of(page, size, Sort.by("id").descending());
		return ResponseEntity.ok(this.vehiculoService.getVehiculosDisponibles(pageable));
	}

	@GetMapping("/buscar")
	public ResponseEntity<Page<VehiculoDTO>> buscarConFiltros(@RequestParam(required = false) String marca,
			@RequestParam(required = false) String modelo, @RequestParam(required = false) TipoVehiculo tipo,
			@RequestParam(required = false) CombustibleVehiculo combustible,
			@RequestParam(required = false) String color, @RequestParam(required = false) Integer minPotencia,
			@RequestParam(required = false) Integer maxPrecio, @RequestParam(required = false) Integer maxKm,
			@RequestParam(required = false) Integer plazas, @RequestParam(required = false) Integer anioFabricacion,
			@RequestParam(required = false) String ciudad,
			@RequestParam(required = false) EtiquetaMedioambiental etiqueta,
			@RequestParam(defaultValue = "false") boolean disponible,
			@RequestParam(required = false) EstadoVerificacion verificado,
			@RequestParam(required = false) Boolean filterDisp, @RequestParam(required = false) Boolean filterVerif,
			@RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "10") int size) {
		boolean aplicarDisp = (filterDisp != null);
		boolean aplicarVerif = (filterVerif != null);

		Pageable pageable = PageRequest.of(page, size);

		Page<VehiculoDTO> resultados = this.vehiculoService.filtrarVehiculos(marca, modelo, tipo, combustible, color,
				minPotencia, maxPrecio, maxKm, plazas, anioFabricacion, ciudad, etiqueta, disponible, aplicarDisp,
				verificado, aplicarVerif, pageable);
		return ResponseEntity.ok(resultados);
	}

	@GetMapping("/vendedor/{idVendedor}")
	public ResponseEntity<Page<VehiculoDTO>> getByVendedor(@PathVariable int idVendedor,
			@RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "10") int size) {

		Pageable pageable = PageRequest.of(page, size);
		return ResponseEntity.ok(this.vehiculoService.getVehiculosPorVendedorPaginado(idVendedor, pageable));
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
	public ResponseEntity<?> updateVerificado(@PathVariable int idVehiculo, @RequestBody EstadoVerificacion verificado) {
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

	@PostMapping("/{idVehiculo}/fotos")
	public ResponseEntity<VehiculoDTO> subirFotos(@PathVariable int idVehiculo,
			@RequestPart("archivos") MultipartFile[] archivos) throws IOException {
		VehiculoDTO dto = vehiculoService.subirFotos(idVehiculo, archivos);
		return ResponseEntity.ok(dto);

	}

	@DeleteMapping("/fotos/{idFoto}")
	public ResponseEntity<Void> eliminarFoto(@PathVariable int idFoto) {
		this.vehiculoService.deleteFoto(idFoto);
		return ResponseEntity.noContent().build();
	}
}
