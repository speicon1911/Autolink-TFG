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
import org.springframework.web.bind.annotation.RestController;

import com.autolink.persistence.entities.Venta;
import com.autolink.services.VentaService;
import com.autolink.services.dto.VentaDTO;

@RestController
@RequestMapping("/ventas")
public class VentaController {

	@Autowired
	private VentaService ventaService;

	@GetMapping
	public List<VentaDTO> findAll() {
		return this.ventaService.findAll();
	}

	@GetMapping("/vendedor/{idVendedor}")
	public ResponseEntity<?> findByVendedor(@PathVariable int idVendedor) {
		return ResponseEntity.ok(this.ventaService.findByVendedor(idVendedor));
	}

	@GetMapping("/cliente/{idCliente}")
	public ResponseEntity<?> findByCliente(@PathVariable int idCliente) {
		return ResponseEntity.ok(this.ventaService.findByCliente(idCliente));
	}

	@GetMapping("/vehiculo/{idVehiculo}")
	public ResponseEntity<?> findByVehiculo(@PathVariable int idVehiculo) {
		return ResponseEntity.ok(this.ventaService.findByVehiculo(idVehiculo));
	}

	@PutMapping("/{idVenta}/actualizar-precio")
	public ResponseEntity<?> updatePrecio(@PathVariable int idVenta, @RequestBody Venta venta) {
		return ResponseEntity.ok(this.ventaService.updatePrecioVenta(venta, idVenta));
	}

	@PostMapping
	public ResponseEntity<VentaDTO> create(@RequestBody Venta venta) {
		return ResponseEntity.status(HttpStatus.CREATED).body(this.ventaService.createVenta(venta));
	}

	@DeleteMapping("/{idVenta}")
	public ResponseEntity<Void> delete(@PathVariable int idVenta) {
		this.ventaService.deleteVenta(idVenta);
		return ResponseEntity.noContent().build();
	}

	@PutMapping("/{idVenta}/anular")
	public ResponseEntity<Void> anular(@PathVariable int idVenta) {
		this.ventaService.anularVenta(idVenta);
		return ResponseEntity.ok().build();
	}

	@PutMapping("/{idVenta}/completar")
	public ResponseEntity<Void> completar(@PathVariable int idVenta) {
		this.ventaService.completarVenta(idVenta);
		return ResponseEntity.ok().build();
	}
}
