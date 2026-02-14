package com.autolink.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.autolink.persistence.entities.Persona;
import com.autolink.persistence.entities.enums.TipoUsuario;
import com.autolink.persistence.repositories.PersonaRepository;
import com.autolink.services.exceptions.PersonaExceptions;
import com.autolink.services.exceptions.PersonaNotFoundException;

@Service
public class PersonaService {

	@Autowired
	private PersonaRepository personaRepository;

	// Obtener todas las personas
	public List<Persona> findAll() {
		return this.personaRepository.findAll();
	}

	public Persona findById(int idPersona) {
		if (!this.personaRepository.existsById(idPersona)) {
			throw new PersonaNotFoundException("No es posible encontrar a la persona con ID: " + idPersona);
		}
		return this.personaRepository.findById(idPersona).get();
	}

	// Encontrar vendedores
	public List<Persona> findByTipoVendedor() {
		List<Persona> vendedores = this.personaRepository.findByTipoUsuario(TipoUsuario.VENDEDOR);
		if (vendedores.isEmpty()) {
			throw new PersonaNotFoundException("No se han encontrado vendedores");
		}
		return vendedores;
	}

	// Encontrar clientes
	public List<Persona> findByTipoCliente() {
		List<Persona> clientes = this.personaRepository.findByTipoUsuario(TipoUsuario.CLIENTE);
		if (clientes.isEmpty()) {
			throw new PersonaNotFoundException("No se han encontrado vendedores");
		}
		return clientes;
	}

	// Encontrar administradores
	public List<Persona> findByTipoAdministrador() {
		List<Persona> administrador = this.personaRepository.findByTipoUsuario(TipoUsuario.ADMINISTRADOR);
		if (administrador.isEmpty()) {
			throw new PersonaNotFoundException("No se han encontrado vendedores");
		}
		return administrador;
	}

	public Persona updatePerfil(Persona persona, int idPersona) {
		if (persona.getId() != idPersona) {
			throw new PersonaExceptions(
					String.format("El id introducido en el cuerpo (%d) y el de la ruta (%d) no coinciden",
							persona.getId(), idPersona));
		}
		if (!this.personaRepository.existsById(idPersona)) {
			throw new PersonaNotFoundException("No es posible encontrar a la persona con ID: " + idPersona);
		}
		if (persona.getComprasRealizadas() != null) {
			throw new PersonaExceptions("No se pueden modificar las compras realizadas");
		}
		if (persona.getVentasRealizadas() != null) {
			throw new PersonaExceptions("No se pueden modificar las ventas realizadas");
		}

//		en caso de error de Postman da error aunque no se quiera cambiar las compras, cambiar esos if por esto:
//		if(persona.getComprasRealizadas() != null && !persona.getComprasRealizadas().isEmpty()) {
//		    throw new PersonaExceptions("No se pueden modificar las compras realizadas");
//		}

		// Recuperamos la persona actual de la BD
		Persona personaBD = this.findById(idPersona);

		// Actualización selectiva (Solo si el dato es válido y no nulo)
		if (persona.getNombre() != null && !persona.getNombre().isBlank()) {
			personaBD.setNombre(persona.getNombre());
		}

		if (persona.getApellidos() != null && !persona.getApellidos().isBlank()) {
			personaBD.setApellidos(persona.getApellidos());
		}

		if (persona.getCorreo() != null && !persona.getCorreo().isBlank()) {
			personaBD.setCorreo(persona.getCorreo());
		}

		if (persona.getDNI() != null && !persona.getDNI().isBlank()) {
			personaBD.setDNI(persona.getDNI());
		}

		if (persona.getPassword() != null && !persona.getPassword().isBlank()) {
			personaBD.setPassword(persona.getPassword());
		}

		// Para campos numéricos como Salario o Teléfono, solo comprobamos que no sean
		// null
		if (persona.getSalarioAnual() != null) {
			personaBD.setSalarioAnual(persona.getSalarioAnual());
		}

		if (persona.getTelefono() != null) {
			personaBD.setTelefono(persona.getTelefono());
		}

		// Guardamos el objeto con los datos añadidos
		return this.personaRepository.save(personaBD);
	}

	// update TipoUsuario (solo administradores)
	public Persona updateTipoUsuario(TipoUsuario nuevo, int idPersona) {
		Persona personaBD = this.findById(idPersona);
		personaBD.setTipoUsuario(nuevo);

		return this.personaRepository.save(personaBD);

	}
}
