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

import com.autolink.persistence.entities.Persona;
import com.autolink.persistence.entities.enums.Rol;
import com.autolink.services.PersonaService;
import com.autolink.services.dto.PersonaDTO;

@RestController
@RequestMapping("/personas")
public class PersonaController {

	@Autowired
	private PersonaService personaService;

	@GetMapping
	public ResponseEntity<List<PersonaDTO>> list() {
		return ResponseEntity.status(HttpStatus.OK).body(this.personaService.findAll());
	}

	@GetMapping("/{idPersona}")
	public ResponseEntity<?> findById(@PathVariable int idPersona) {
		return ResponseEntity.ok(this.personaService.findById(idPersona));
	}

	@GetMapping("/vendedor")
	public ResponseEntity<?> listTipoVendedor() {
		return ResponseEntity.ok(this.personaService.findByTipoVendedor());
	}

	@GetMapping("/cliente")
	public ResponseEntity<?> listTipoCliente() {
		return ResponseEntity.ok(this.personaService.findByTipoCliente());
	}

	@GetMapping("/admin")
	public ResponseEntity<?> listTipoAdministrador() {
		return ResponseEntity.ok(this.personaService.findByTipoAdministrador());
	}

	@PutMapping("/{idPersona}")
	public ResponseEntity<?> updatePerfil(@PathVariable int idPersona, @RequestBody Persona persona) {
		return ResponseEntity.ok(this.personaService.updatePerfil(persona, idPersona));
	}

	@PutMapping("/{idPersona}/tipo-usuario")
	public ResponseEntity<?> updateTipoUsuario(@PathVariable int idPersona, @RequestBody Persona persona) {
		return ResponseEntity.ok(this.personaService.updateTipoUsuario(persona.getRol(), idPersona));
	}

	@PostMapping
	public ResponseEntity<PersonaDTO> create(@RequestBody Persona persona) {
		return ResponseEntity.status(HttpStatus.CREATED).body(this.personaService.createPersona(persona));
	}

	@DeleteMapping("/{idPersona}")
	public ResponseEntity<Void> delete(@PathVariable int idPersona) {
		this.personaService.deletePersona(idPersona);
		return ResponseEntity.noContent().build();
	}

	@PostMapping("/{idPersona}/foto")
	public ResponseEntity<PersonaDTO> subirFotoPerfil(@PathVariable int idPersona,
			@RequestPart("archivo") MultipartFile archivo) throws IOException {
		return ResponseEntity.ok(personaService.actualizarFotoPerfil(idPersona, archivo));
	}

	// metodo paginado
	@GetMapping("/paged")
	public ResponseEntity<Page<PersonaDTO>> listPaged(@RequestParam(defaultValue = "0") int page,
			@RequestParam(defaultValue = "10") int size, @RequestParam(required = false) Rol rol,
			@RequestParam(required = false) Boolean activo) {
		Pageable pageable = PageRequest.of(page, size, Sort.by("id").descending());
		return ResponseEntity.ok(this.personaService.getPersonasPaginadas(rol, activo, pageable));

	}
}
