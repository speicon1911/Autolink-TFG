package com.autolink.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.autolink.persistence.entities.Persona;
import com.autolink.persistence.entities.enums.Rol;
import com.autolink.persistence.repositories.PersonaRepository;
import com.autolink.services.exceptions.PersonaExceptions;
import com.autolink.services.exceptions.PersonaNotFoundException;

@Service
public class PersonaService implements UserDetailsService {

	@Autowired
	private PersonaRepository personaRepository;

//	@Autowired
//	@Lazy
//	private PasswordEncoder passwordEncoder;

	// --- SEGURIDAD (Spring Security) ---

	
	@Override
	public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
		// Buscamos y si no existe lanzamos UsernameNotFoundException directamente
		Persona persona = this.personaRepository.findByCorreo(email)
				.orElseThrow(() -> new UsernameNotFoundException("El usuario con email " + email + " no existe."));

		return User.builder()
				.username(persona.getCorreo())
				.password(persona.getPassword())
				.roles(persona.getRol().name())
				.build();
	}

	// --- MÉTODOS DE NEGOCIO ---

	public List<Persona> findAll() {
		return this.personaRepository.findAll();
	}

	public Persona findById(int idPersona) {
		// Buscamos por ID y si no existe lanzamos tu excepción personalizada
		return this.personaRepository.findById(idPersona)
				.orElseThrow(() -> new PersonaNotFoundException("No es posible encontrar a la persona con ID: " + idPersona));
	}

	public Persona createPersona(Persona persona) {
		if (persona.getPassword() != null && !persona.getPassword().isBlank()) {
			persona.setPassword(new org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder().encode(persona.getPassword()));
		}
		
		if (persona.getRol() == null) {
			persona.setRol(Rol.CLIENTE);
		}
		
		return this.personaRepository.save(persona);
	}

	public void deletePersona(int idPersona) {
		// Aquí usamos existsById antes de borrar
		if (!this.personaRepository.existsById(idPersona)) {
			throw new PersonaNotFoundException("No es posible eliminar la persona con ID: " + idPersona);
		}
		this.personaRepository.deleteById(idPersona);
	}

	public Persona updatePerfil(Persona persona, int idPersona) {
		if (persona.getId() != idPersona) {
			throw new PersonaExceptions("Los IDs no coinciden");
		}

		// Reutilizamos findById que ya tiene el orElseThrow
		Persona personaBD = this.findById(idPersona);

		// Actualización selectiva
		if (persona.getNombre() != null && !persona.getNombre().isBlank()) personaBD.setNombre(persona.getNombre());
		if (persona.getApellidos() != null && !persona.getApellidos().isBlank()) personaBD.setApellidos(persona.getApellidos());
		if (persona.getCorreo() != null && !persona.getCorreo().isBlank()) personaBD.setCorreo(persona.getCorreo());
		
		if (persona.getPassword() != null && !persona.getPassword().isBlank()) {
			personaBD.setPassword(new org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder().encode(persona.getPassword()));
		}

		if (persona.getSalarioAnual() != null) personaBD.setSalarioAnual(persona.getSalarioAnual());
		if (persona.getTelefono() != null) personaBD.setTelefono(persona.getTelefono());

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
}