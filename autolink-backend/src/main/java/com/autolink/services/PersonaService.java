package com.autolink.services;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.autolink.persistence.entities.Persona;
import com.autolink.persistence.entities.enums.Rol;
import com.autolink.persistence.repositories.PersonaRepository;
import com.autolink.persistence.repositories.VehiculoRepository;
import com.autolink.services.dto.PersonaDTO;
import com.autolink.services.mappers.PersonaMapper;
import com.autolink.services.exceptions.PersonaExceptions;
import com.autolink.services.exceptions.PersonaNotFoundException;

import jakarta.transaction.Transactional;

@Service
public class PersonaService implements UserDetailsService {

	private final VehiculoRepository vehiculoRepository;

	@Autowired
	private PersonaRepository personaRepository;

	@Autowired
	private PersonaMapper personaMapper;

	PersonaService(VehiculoRepository vehiculoRepository) {
		this.vehiculoRepository = vehiculoRepository;
	}

	// --- SEGURIDAD (Spring Security) ---

	@Override
	public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
		Persona persona = this.personaRepository.findByCorreo(username)
				.orElseThrow(() -> new UsernameNotFoundException("El usuario con email " + username + " no existe."));

		if (Boolean.FALSE.equals(persona.getActivo())) {
			throw new UsernameNotFoundException("La cuenta del usuario " + username + " está desactivada.");
		}

		return User.builder().username(persona.getCorreo()).password(persona.getPassword())
				.roles(persona.getRol().name()).build();
	}

	// --- MÉTODOS DE NEGOCIO ---

	public List<PersonaDTO> findAll() {
		return this.personaRepository.findAll().stream()
				.map(personaMapper::toDto)
				.collect(Collectors.toList());
	}

	public List<PersonaDTO> findByActivo(boolean activo) {
		return this.personaRepository.findByActivo(activo).stream()
				.map(personaMapper::toDto)
				.collect(Collectors.toList());
	}

	public PersonaDTO findById(int idPersona) {
		Persona persona = this.personaRepository.findById(idPersona).orElseThrow(
				() -> new PersonaNotFoundException("No es posible encontrar a la persona con ID: " + idPersona));
		return personaMapper.toDto(persona);
	}

	public PersonaDTO createPersona(Persona persona) {
		Optional<Persona> existenteOpt = this.personaRepository.findByCorreo(persona.getCorreo());

		if (existenteOpt.isPresent()) {
			Persona existente = existenteOpt.get();
			if (Boolean.TRUE.equals(existente.getActivo())) {
				throw new PersonaExceptions("El correo " + persona.getCorreo() + " ya está registrado.");
			} else {
				existente.setNombre(persona.getNombre());
				existente.setApellidos(persona.getApellidos());
				if (persona.getPassword() != null) {
					existente.setPassword(new BCryptPasswordEncoder().encode(persona.getPassword()));
				}
				existente.setRol(persona.getRol() != null ? persona.getRol() : Rol.CLIENTE);
				existente.setActivo(true);
				return personaMapper.toDto(this.personaRepository.save(existente));
			}
		}

		if (persona.getPassword() != null) {
			persona.setPassword(new BCryptPasswordEncoder().encode(persona.getPassword()));
		}

		if (persona.getRol() == null) {
			persona.setRol(Rol.CLIENTE);
		}
		
		persona.setActivo(true);
		return personaMapper.toDto(this.personaRepository.save(persona));
	}

	public void deletePersona(int idPersona) {
		this.darDeBajaUsuario(idPersona);
	}

	public PersonaDTO updatePerfil(Persona persona, int idPersona) {
		if (persona.getId() != idPersona && persona.getId() != 0) {
			throw new PersonaExceptions("Los IDs no coinciden");
		}

		Persona personaBD = this.personaRepository.findById(idPersona).orElseThrow(
				() -> new PersonaNotFoundException("No es posible encontrar a la persona con ID: " + idPersona));

		if (persona.getNombre() != null && !persona.getNombre().isBlank())
			personaBD.setNombre(persona.getNombre());
		if (persona.getApellidos() != null && !persona.getApellidos().isBlank())
			personaBD.setApellidos(persona.getApellidos());
		if (persona.getCorreo() != null && !persona.getCorreo().isBlank()) {
			if (!persona.getCorreo().equalsIgnoreCase(personaBD.getCorreo())
					&& personaRepository.findByCorreo(persona.getCorreo()).isPresent()) {
				throw new PersonaExceptions("Ese correo ya está en uso por otro usuario");
			}
			personaBD.setCorreo(persona.getCorreo());
		}

		if (persona.getPassword() != null && !persona.getPassword().isBlank()) {
			personaBD.setPassword(new BCryptPasswordEncoder().encode(persona.getPassword()));
		}

		if (persona.getSalarioAnual() != null)
			personaBD.setSalarioAnual(persona.getSalarioAnual());
		if (persona.getTelefono() != null)
			personaBD.setTelefono(persona.getTelefono());
		
		if (persona.getActivo() != null) {
			personaBD.setActivo(persona.getActivo());
		}

		return personaMapper.toDto(this.personaRepository.save(personaBD));
	}

	public PersonaDTO updateTipoUsuario(Rol nuevo, int idPersona) {
		Persona personaBD = this.personaRepository.findById(idPersona).orElseThrow(
				() -> new PersonaNotFoundException("No es posible encontrar a la persona con ID: " + idPersona));
		personaBD.setRol(nuevo);
		return personaMapper.toDto(this.personaRepository.save(personaBD));
	}

	public List<PersonaDTO> findByTipoVendedor() {
		List<Persona> vendedores = this.personaRepository.findByRol(Rol.VENDEDOR);
		if (vendedores == null || vendedores.isEmpty()) {
			throw new PersonaNotFoundException("No se han encontrado personas con el rol VENDEDOR");
		}
		return vendedores.stream().map(personaMapper::toDto).collect(Collectors.toList());
	}

	public List<PersonaDTO> findByTipoCliente() {
		List<Persona> clientes = this.personaRepository.findByRol(Rol.CLIENTE);
		if (clientes == null || clientes.isEmpty()) {
			throw new PersonaNotFoundException("No se han encontrado personas con el rol CLIENTE");
		}
		return clientes.stream().map(personaMapper::toDto).collect(Collectors.toList());
	}

	public List<PersonaDTO> findByTipoAdministrador() {
		List<Persona> administradores = this.personaRepository.findByRol(Rol.ADMINISTRADOR);
		if (administradores == null || administradores.isEmpty()) {
			throw new PersonaNotFoundException("No se han encontrado personas con el rol ADMINISTRADOR");
		}
		return administradores.stream().map(personaMapper::toDto).collect(Collectors.toList());
	}

	@Transactional
	public void darDeBajaUsuario(int idUsuario) {
		Persona usuario = personaRepository.findById(idUsuario).orElseThrow(
				() -> new PersonaNotFoundException("No se encontró el usuario con ID: " + idUsuario));
		usuario.setActivo(false);
		personaRepository.save(usuario);
		vehiculoRepository.desactivarTodosPorVendedor(idUsuario);
	}
	
	// paginados
//	public Page<PersonaDTO> findAllPaged(Pageable pageable){
//		return this.personaRepository.findAll(pageable).map(personaMapper::toDto);
//	}
//	
//	public Page<PersonaDTO> findByRolPaged(Rol rol, Pageable pageable){
//		return this.personaRepository.findByRol(rol, pageable).map(personaMapper::toDto);
//	}
	
	public Page<PersonaDTO> getPersonasPaginadas(Rol rol, Boolean activo, Pageable pageable){
		Page<Persona> resultado;
		if(rol != null && activo != null) {
			resultado = this.personaRepository.findByRolAndActivo(rol, activo, pageable);
		} else if(rol != null) {
			resultado = this.personaRepository.findByRol(rol, pageable);
		} else if(activo != null) {
			resultado = this.personaRepository.findByActivo(activo, pageable);
		} else {
			resultado = this.personaRepository.findAll(pageable);
		}
		return resultado.map(personaMapper::toDto);
	}

}