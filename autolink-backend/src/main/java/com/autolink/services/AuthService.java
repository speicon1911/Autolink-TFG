package com.autolink.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import com.autolink.persistence.entities.Persona;
import com.autolink.persistence.entities.enums.Rol;
import com.autolink.services.dto.LoginRequest;
import com.autolink.services.dto.LoginResponse;
import com.autolink.services.dto.RefreshDTO;
import com.autolink.services.dto.RegisterRequest;
import com.autolink.services.exceptions.PersonaExceptions;
import com.autolink.web.config.JwtUtils;

@Service
public class AuthService {

	@Autowired
	private AuthenticationManager authenticationManager;

	@Autowired
	private JwtUtils jwtUtil;

	@Autowired
	private PersonaService personaService;

	@Autowired
	private com.autolink.persistence.repositories.PersonaRepository personaRepository;

	// Login: El "username" de Spring Security mapea con el "email" de Persona.
	public LoginResponse login(LoginRequest request) {
		Authentication authentication = authenticationManager
				.authenticate(new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword()));

		UserDetails userDetails = (UserDetails) authentication.getPrincipal();

		String accessToken = jwtUtil.generateAccessToken(userDetails);
		String refreshToken = jwtUtil.generateRefreshToken(userDetails);

		LoginResponse response = new LoginResponse();
		response.setAccess(accessToken);
		response.setRefresh(refreshToken);

		// Fetch user profile info
		this.personaRepository.findByCorreo(userDetails.getUsername()).ifPresent(p -> {
			response.setId(p.getId());
			response.setNombre(p.getNombre());
			response.setApellidos(p.getApellidos());
			response.setCorreo(p.getCorreo());
			response.setRol(p.getRol().name());
			response.setFotoPerfil(p.getFotoPerfil());
		});

		return response;
	}

	// Registro corregido: Evitamos enviar la contraseña encriptada al
	// AuthenticationManager.
	public LoginResponse registrar(RegisterRequest request) {
		// 1. Validar contraseñas (Lógica propia de la petición de registro)
		if (request.getPassword1() == null || !request.getPassword1().equals(request.getPassword2())) {
			throw new PersonaExceptions("Las contraseñas no coinciden o están vacías.");
		}

		// 2. Crear y mapear la entidad Persona
		Persona nuevaPersona = new Persona();
		nuevaPersona.setNombre(request.getNombre().trim());
		nuevaPersona.setApellidos(request.getApellidos().trim());
		nuevaPersona.setCorreo(request.getEmail().trim().toLowerCase());
		nuevaPersona.setPassword(request.getPassword1().trim());
		if (request.getDNI() != null) {
			nuevaPersona.setDNI(request.getDNI().trim().toUpperCase());
		}

		// 3. Mapear el Rol
		if (request.getRol() != null) {
			try {
				nuevaPersona.setRol(Rol.valueOf(request.getRol().toUpperCase()));
			} catch (IllegalArgumentException e) {
				nuevaPersona.setRol(Rol.CLIENTE);
			}
		} else {
			nuevaPersona.setRol(Rol.CLIENTE);
		}

		// 4. Guardar en BD
		// AQUÍ es donde PersonaService validará si el correo existe y lanzará la
		// excepción si es necesario.
		this.personaService.createPersona(nuevaPersona);

		// 5. Autenticación automática
		LoginRequest loginRequest = new LoginRequest();
		loginRequest.setUsername(request.getEmail().trim().toLowerCase());
		loginRequest.setPassword(request.getPassword1().trim());

		return this.login(loginRequest);
	}

	// Refrescar tokens.

	public LoginResponse refresh(RefreshDTO dto) {
		String accessToken = jwtUtil.generateAccessToken(dto.getRefresh());
		String refreshToken = jwtUtil.generateRefreshToken(dto.getRefresh());
		String email = jwtUtil.extractUsername(dto.getRefresh());

		LoginResponse response = new LoginResponse();
		response.setAccess(accessToken);
		response.setRefresh(refreshToken);

		this.personaRepository.findByCorreo(email).ifPresent(p -> {
			response.setId(p.getId());
			response.setNombre(p.getNombre());
			response.setApellidos(p.getApellidos());
			response.setCorreo(p.getCorreo());
			response.setRol(p.getRol().name());
			response.setFotoPerfil(p.getFotoPerfil());
		});

		return response;
	}
}