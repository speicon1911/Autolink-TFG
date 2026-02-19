package com.autolink.web.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.autolink.persistence.entities.Venta;
import com.autolink.services.VentaService;

@RestController
@RequestMapping("/ventas")
public class VentaController {

	@Autowired
	private VentaService ventaService;
	
	@GetMapping
	public List<Venta> findAll(){
		return this.ventaService.findAll();
	}
	
	@GetMapping("/vendedor/{idVendedor}")
	public ResponseEntity<?> findByVendedor(@PathVariable int idVendedor){
		return ResponseEntity.ok(this.ventaService.findByVendedor(idVendedor));
	}
	
	@GetMapping("/cliente/{idCliente}")
	public ResponseEntity<?> findByCliente(@PathVariable int idCliente){
		return ResponseEntity.ok(this.ventaService.findByCliente(idCliente));
	}
	
	@PutMapping("/{idVenta}/actualizar-precio")
	public ResponseEntity<?> updatePrecio(@PathVariable int idVenta, @RequestBody Venta venta){
		return ResponseEntity.ok(this.ventaService.updatePrecioVenta(venta, idVenta));
	}
}
