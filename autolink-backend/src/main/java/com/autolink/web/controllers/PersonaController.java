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
import com.autolink.services.exceptions.PersonaExceptions;
import com.autolink.services.exceptions.PersonaNotFoundException;

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
		try {
			return ResponseEntity.ok(this.personaService.findById(idPersona));
		}catch (PersonaNotFoundException ex) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
		}
	}
	
	@GetMapping("/vendedor")
	public ResponseEntity<?> listTipoVendedor(){
		try {
			return ResponseEntity.ok(this.personaService.findByTipoVendedor());
		}catch (PersonaNotFoundException ex) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
		}
	}
	
	@GetMapping("/cliente")
	public ResponseEntity<?> listTipoCliente(){
		try {
			return ResponseEntity.ok(this.personaService.findByTipoCliente());
		}catch (PersonaNotFoundException ex) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
		}
	}
	
	@GetMapping("/admin")
	public ResponseEntity<?> listTipoAdministrador(){
		try {
			return ResponseEntity.ok(this.personaService.findByTipoAdministrador());
		}catch (PersonaNotFoundException ex) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
		}
	}
	
	@PutMapping("/{idPersona}")
	public ResponseEntity<?> updatePerfil(@PathVariable int idPersona, @RequestBody Persona persona){
		try {
			return ResponseEntity.ok(this.personaService.updatePerfil(persona, idPersona));
		}catch (PersonaNotFoundException ex) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
		}catch (PersonaExceptions ex) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ex.getMessage());
		}
	}
	
	@PutMapping("/{idPersona}/tipo-usuario")
	public ResponseEntity<?> updateTipoUsuario(@PathVariable int idPersona, @RequestBody Persona persona){
		try {
			return ResponseEntity.ok(this.personaService.updateTipoUsuario(persona.getTipoUsuario(), idPersona));
		}catch (PersonaNotFoundException ex) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
		}
	}
}
