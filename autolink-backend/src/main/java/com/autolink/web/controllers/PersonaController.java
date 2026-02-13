package com.autolink.web.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.autolink.persistence.entities.Persona;
import com.autolink.services.PersonaService;
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
}
