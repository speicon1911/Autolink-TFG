package com.autolink.web.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.autolink.persistence.entities.Marca;
import com.autolink.services.MarcaService;

@RestController
@RequestMapping("/marcas")
public class MarcaController {
	@Autowired
	private MarcaService marcaService;
	
	@GetMapping
	public List<Marca> findAll(){
		return this.marcaService.findAll();
	}
	
	@PostMapping
	public ResponseEntity<Marca> create(@RequestBody Marca marca) {
	    return ResponseEntity.status(HttpStatus.CREATED).body(this.marcaService.createMarca(marca));
	}

	@DeleteMapping("/{idMarca}")
	public ResponseEntity<Void> delete(@PathVariable int idMarca) {
	    this.marcaService.deleteMarca(idMarca);
	    return ResponseEntity.noContent().build();
	}
}
