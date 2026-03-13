package com.autolink.services;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
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
import com.autolink.services.exceptions.PersonaExceptions;
import com.autolink.services.exceptions.PersonaNotFoundException;

import jakarta.transaction.Transactional;

@Service
public class PersonaService implements UserDetailsService {

	private final VehiculoRepository vehiculoRepository;

	@Autowired
	private PersonaRepository personaRepository;

	PersonaService(VehiculoRepository vehiculoRepository) {
		this.vehiculoRepository = vehiculoRepository;
	}

	// --- SEGURIDAD (Spring Security) ---

	@Override
	public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
		// Buscamos y si no existe lanzamos UsernameNotFoundException directamente
		Persona persona = this.personaRepository.findByCorreo(username)
				.orElseThrow(() -> new UsernameNotFoundException("El usuario con email " + username + " no existe."));

		if (Boolean.FALSE.equals(persona.getActivo())) {
			throw new UsernameNotFoundException("La cuenta del usuario " + username + " está desactivada.");
		}

		return User.builder().username(persona.getCorreo()).password(persona.getPassword())
				.roles(persona.getRol().name()).build();
	}

	// --- MÉTODOS DE NEGOCIO ---

	public List<Persona> findAll() {
		return this.personaRepository.findAll();
	}

	public List<Persona> findByActivo(boolean activo) {
		return this.personaRepository.findByActivo(activo);
	}

	public Persona findById(int idPersona) {
		// Buscamos por ID y si no existe lanzamos tu excepción personalizada
		return this.personaRepository.findById(idPersona).orElseThrow(
				() -> new PersonaNotFoundException("No es posible encontrar a la persona con ID: " + idPersona));
	}

	public Persona createPersona(Persona persona) {
		// Busca el correo y, sobre el resultado (Optional), pregunta si existe
		Optional<Persona> existenteOpt = this.personaRepository.findByCorreo(persona.getCorreo());

		if (existenteOpt.isPresent()) {
			Persona existente = existenteOpt.get();
			if (Boolean.TRUE.equals(existente.getActivo())) {
				throw new PersonaExceptions("El correo " + persona.getCorreo() + " ya está registrado.");
			} else {
				// Reactivación: Actualizamos los datos de la cuenta inactiva
				existente.setNombre(persona.getNombre());
				existente.setApellidos(persona.getApellidos());
				if (persona.getPassword() != null) {
					existente.setPassword(new BCryptPasswordEncoder().encode(persona.getPassword()));
				}
				existente.setRol(persona.getRol() != null ? persona.getRol() : Rol.CLIENTE);
				existente.setActivo(true);
				return this.personaRepository.save(existente);
			}
		}

		if (persona.getPassword() != null) {
			persona.setPassword(new BCryptPasswordEncoder().encode(persona.getPassword()));
		}

		if (persona.getRol() == null) {
			persona.setRol(Rol.CLIENTE);
		}
		
		persona.setActivo(true); // Aseguramos que sea activo al crear
		return this.personaRepository.save(persona);
	}

	public void deletePersona(int idPersona) {
		// Borrado lógico en lugar de físico
		this.darDeBajaUsuario(idPersona);
	}

	public Persona updatePerfil(Persona persona, int idPersona) {
		if (persona.getId() != idPersona) {
			throw new PersonaExceptions("Los IDs no coinciden");
		}

		// Reutilizamos findById que ya tiene el orElseThrow
		Persona personaBD = this.findById(idPersona);

		// Actualización selectiva
		if (persona.getNombre() != null && !persona.getNombre().isBlank())
			personaBD.setNombre(persona.getNombre());
		if (persona.getApellidos() != null && !persona.getApellidos().isBlank())
			personaBD.setApellidos(persona.getApellidos());
		if (persona.getCorreo() != null && !persona.getCorreo().isBlank()) {
			// Si el correo es distinto al que ya tenía, verificamos que no exista ya
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
		
		// Solo actualizamos el estado si viene explícitamente en el JSON (no es null)
		if (persona.getActivo() != null) {
			personaBD.setActivo(persona.getActivo());
		}

		return this.personaRepository.save(personaBD);
	}

	public Persona updateTipoUsuario(Rol nuevo, int idPersona) {
		Persona personaBD = this.findById(idPersona);
		personaBD.setRol(nuevo);
		return this.personaRepository.save(personaBD);
	}

	// --- MÉTODOS DE FILTRADO POR ROL ---

	// Encontrar vendedores
	public List<Persona> findByTipoVendedor() {
		List<Persona> vendedores = this.personaRepository.findByRol(Rol.VENDEDOR);
		if (vendedores == null || vendedores.isEmpty()) {
			throw new PersonaNotFoundException("No se han encontrado personas con el rol VENDEDOR");
		}
		return vendedores;
	}

	// Encontrar clientes
	public List<Persona> findByTipoCliente() {
		List<Persona> clientes = this.personaRepository.findByRol(Rol.CLIENTE);
		if (clientes == null || clientes.isEmpty()) {
			throw new PersonaNotFoundException("No se han encontrado personas con el rol CLIENTE");
		}
		return clientes;
	}

	// Encontrar administradores
	public List<Persona> findByTipoAdministrador() {
		// Asumiendo que tu Enum es ADMINISTRADOR (ajustar si es ADMIN)
		List<Persona> administradores = this.personaRepository.findByRol(Rol.ADMINISTRADOR);
		if (administradores == null || administradores.isEmpty()) {
			throw new PersonaNotFoundException("No se han encontrado personas con el rol ADMINISTRADOR");
		}
		return administradores;
	}

	// dar de baja
	@Transactional
	public void darDeBajaUsuario(int idUsuario) {
		// Se marca usuario como inactivo
		Persona usuario = personaRepository.findById(idUsuario).orElseThrow(
				() -> new PersonaNotFoundException("No se encontró el usuario con ID: " + idUsuario));
		usuario.setActivo(false);
		personaRepository.save(usuario);

		// Se asignan como no disponibles todos sus vehiculos para que el frontend no
		// tenga que mostrarlos
		vehiculoRepository.desactivarTodosPorVendedor(idUsuario);
	}

}