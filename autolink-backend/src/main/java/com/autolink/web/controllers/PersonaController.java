package com.autolink.web.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.autolink.persistence.entities.Persona;
import com.autolink.services.PersonaService;

@RestController
@RequestMapping("/personas")
public class PersonaController {

	@Autowired
	private PersonaService personaService;
	
	@GetMapping
	public ResponseEntity<List<Persona>> list(){
		return ResponseEntity.status(HttpStatus.OK).body(this.personaService.findAll());
	}
	
	
	@GetMapping("/{idPersona}")
	public ResponseEntity<?> findById(@PathVariable int idPersona){
			return ResponseEntity.ok(this.personaService.findById(idPersona));
	}
	
	@GetMapping("/vendedor")
	public ResponseEntity<?> listTipoVendedor(){
			return ResponseEntity.ok(this.personaService.findByTipoVendedor());
	}
	
	@GetMapping("/cliente")
	public ResponseEntity<?> listTipoCliente(){
			return ResponseEntity.ok(this.personaService.findByTipoCliente());
	}
	
	@GetMapping("/admin")
	public ResponseEntity<?> listTipoAdministrador(){
			return ResponseEntity.ok(this.personaService.findByTipoAdministrador());
	}
	
	@PutMapping("/{idPersona}")
	public ResponseEntity<?> updatePerfil(@PathVariable int idPersona, @RequestBody Persona persona){
			return ResponseEntity.ok(this.personaService.updatePerfil(persona, idPersona));
	}
	
	@PutMapping("/{idPersona}/tipo-usuario")
	public ResponseEntity<?> updateTipoUsuario(@PathVariable int idPersona, @RequestBody Persona persona){
			return ResponseEntity.ok(this.personaService.updateTipoUsuario(persona.getTipoUsuario(), idPersona));
	}
}
