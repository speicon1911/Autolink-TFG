package com.autolink.services;

import java.io.IOException;
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
import org.springframework.web.multipart.MultipartFile;

import com.autolink.persistence.entities.Persona;
import com.autolink.persistence.entities.enums.Rol;
import com.autolink.persistence.repositories.PersonaRepository;
import com.autolink.persistence.repositories.VehiculoRepository;
import com.autolink.services.dto.PersonaDTO;
import com.autolink.services.exceptions.PersonaExceptions;
import com.autolink.services.exceptions.PersonaNotFoundException;
import com.autolink.services.mappers.PersonaMapper;

import jakarta.transaction.Transactional;

@Service
public class PersonaService implements UserDetailsService {

	@Autowired
	private VehiculoRepository vehiculoRepository;

	@Autowired
	private PersonaRepository personaRepository;

	@Autowired
	private PersonaMapper personaMapper;

	@Autowired
	private ImgBBService imgBBService;

	@Autowired
	private EmailService emailService;

	// tipos permitidos de imagenes
	private static final List<String> TIPOS_PERMITIDOS = List.of("image/jpeg", "image/png", "image/webp");

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
		return this.personaRepository.findAll().stream().map(personaMapper::toDto).collect(Collectors.toList());
	}

	public List<PersonaDTO> findByActivo(boolean activo) {
		return this.personaRepository.findByActivo(activo).stream().map(personaMapper::toDto)
				.collect(Collectors.toList());
	}

	public PersonaDTO findById(int idPersona) {
		Persona persona = this.personaRepository.findById(idPersona).orElseThrow(
				() -> new PersonaNotFoundException("No es posible encontrar a la persona con ID: " + idPersona));
		return personaMapper.toDto(persona);
	}

	public PersonaDTO createPersona(Persona persona) {
		// Validaciones básicas
		if (persona.getDNI() != null) {
			if (persona.getDNI().length() != 9) {
				throw new PersonaExceptions("El DNI debe tener exactamente 9 caracteres.");
			}
			if (this.personaRepository.existsByDNI(persona.getDNI())) {
				throw new PersonaExceptions("El DNI " + persona.getDNI() + " ya está registrado.");
			}
		}

		if (persona.getTelefono() != null && this.personaRepository.existsByTelefono(persona.getTelefono())) {
			throw new PersonaExceptions("El número de teléfono " + persona.getTelefono() + " ya está en uso.");
		}

		Optional<Persona> existenteOpt = this.personaRepository.findByCorreo(persona.getCorreo());

		if (existenteOpt.isPresent()) {
			Persona existente = existenteOpt.get();
			if (Boolean.TRUE.equals(existente.getActivo())) {
				throw new PersonaExceptions("El correo " + persona.getCorreo() + " ya está registrado.");
			} else {
				// Reactivación de usuario
				existente.setNombre(persona.getNombre());
				existente.setApellidos(persona.getApellidos());
				if (persona.getPassword() != null) {
					existente.setPassword(new BCryptPasswordEncoder().encode(persona.getPassword()));
				}
				existente.setRol(persona.getRol() != null ? persona.getRol() : Rol.CLIENTE);
				
				if (persona.getTelefono() != null) existente.setTelefono(persona.getTelefono());
				if (persona.getSalarioAnual() != null) existente.setSalarioAnual(persona.getSalarioAnual());
				if (persona.getDNI() != null) existente.setDNI(persona.getDNI());

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
					&& personaRepository.existsByCorreo(persona.getCorreo())) {
				throw new PersonaExceptions("Ese correo ya está en uso por otro usuario");
			}
			personaBD.setCorreo(persona.getCorreo());
		}

		if (persona.getDNI() != null && !persona.getDNI().isBlank()) {
			if (!persona.getDNI().equalsIgnoreCase(personaBD.getDNI())
					&& personaRepository.existsByDNI(persona.getDNI())) {
				throw new PersonaExceptions("Ese DNI ya está en uso por otro usuario");
			}
			personaBD.setDNI(persona.getDNI());
		}

		if (persona.getPassword() != null && !persona.getPassword().isBlank()) {
			personaBD.setPassword(new BCryptPasswordEncoder().encode(persona.getPassword()));
		}

		if (persona.getSalarioAnual() != null)
			personaBD.setSalarioAnual(persona.getSalarioAnual());
		if (persona.getTelefono() != null) {
			if (!persona.getTelefono().equals(personaBD.getTelefono())
					&& personaRepository.existsByTelefono(persona.getTelefono())) {
				throw new PersonaExceptions("Ese número de teléfono ya está en uso por otro usuario");
			}
			personaBD.setTelefono(persona.getTelefono());
		}
		if (persona.getCiudadAsignada() != null)
			personaBD.setCiudadAsignada(persona.getCiudadAsignada());

		if (persona.getActivo() != null) {
			personaBD.setActivo(persona.getActivo());
		}

		return personaMapper.toDto(this.personaRepository.save(personaBD));
	}

	public PersonaDTO updateTipoUsuario(Rol nuevo, int idPersona) {
		Persona personaBD = this.personaRepository.findById(idPersona).orElseThrow(
				() -> new PersonaNotFoundException("No es posible encontrar a la persona con ID: " + idPersona));

		// 1. Cambiamos el rol y guardamos
		personaBD.setRol(nuevo);
		Persona personaGuardada = this.personaRepository.save(personaBD);
		// 2. Enviamos la notificación
		emailService.notificarCambioRol(personaGuardada.getCorreo(), nuevo.name());
		// 3. Devolvemos el DTO
		return personaMapper.toDto(personaGuardada);
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
		Persona usuario = personaRepository.findById(idUsuario)
				.orElseThrow(() -> new PersonaNotFoundException("No se encontró el usuario con ID: " + idUsuario));
		usuario.setActivo(false);
		personaRepository.save(usuario);
		vehiculoRepository.desactivarTodosPorVendedor(idUsuario);
	}

	// actualizar foto perfil
	@Transactional
	public PersonaDTO actualizarFotoPerfil(int idPersona, MultipartFile archivo) throws IOException {
		Persona persona = personaRepository.findById(idPersona)
				.orElseThrow(() -> new PersonaNotFoundException("Usuario no encontrado"));

		// validar tipo
		String contentType = archivo.getContentType();
		if (contentType == null || !TIPOS_PERMITIDOS.contains(contentType)) {
			throw new PersonaExceptions("El archivo no es una imagen válida (solo JPG, PNG, WEBP).");
		}

		// validar tamaño (5MB)
		if (archivo.getSize() > 5 * 1024 * 1024) {
			throw new PersonaExceptions("La imagen es demasiado grande (máx 5MB).");
		}

		String urlFoto = imgBBService.subirAImgBB(archivo);

		persona.setFotoPerfil(urlFoto);
		personaRepository.save(persona);

		return personaMapper.toDto(persona);
	}

	// correo
	public Persona findByCorreoEntity(String correo) {
		return personaRepository.findByCorreo(correo)
				.orElseThrow(() -> new PersonaNotFoundException("Usuario no encontrado"));
	}

	// paginados
	public Page<PersonaDTO> getPersonasPaginadas(Rol rol, Boolean activo, Pageable pageable) {
		Page<Persona> resultado;
		if (rol != null && activo != null) {
			resultado = this.personaRepository.findByRolAndActivo(rol, activo, pageable);
		} else if (rol != null) {
			resultado = this.personaRepository.findByRol(rol, pageable);
		} else if (activo != null) {
			resultado = this.personaRepository.findByActivo(activo, pageable);
		} else {
			resultado = this.personaRepository.findAll(pageable);
		}
		return resultado.map(personaMapper::toDto);
	}

}