package com.autolink.web.config;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;
import org.springframework.dao.DataIntegrityViolationException;

import com.autolink.services.exceptions.MarcaExceptions;
import com.autolink.services.exceptions.MarcaNotFoundException;
import com.autolink.services.exceptions.PersonaExceptions;
import com.autolink.services.exceptions.PersonaNotFoundException;
import com.autolink.services.exceptions.VehiculoExceptions;
import com.autolink.services.exceptions.VehiculoNotFoundException;
import com.autolink.services.exceptions.VentaExceptions;
import com.autolink.services.exceptions.VentaNotFoundException;

@RestControllerAdvice
public class GlobalExceptionHandler {

	// --- EXCEPCIONES DE SEGURIDAD ---

	@ExceptionHandler(AuthenticationException.class)
	public ResponseEntity<String> handleAuthenticationException(AuthenticationException ex) {
		return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Usuario o contraseña incorrectos.");
	}

	@ExceptionHandler(AccessDeniedException.class)
	public ResponseEntity<String> handleAccessDeniedException(AccessDeniedException ex) {
		return ResponseEntity.status(HttpStatus.FORBIDDEN).body("No tienes permisos suficientes para realizar esta acción.");
	}

	// --- EXCEPCIONES DE PARÁMETROS ---

	@ExceptionHandler(MethodArgumentTypeMismatchException.class)
	public ResponseEntity<String> handleEnumConversionError(MethodArgumentTypeMismatchException ex) {
		return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ex.getMessage());
	}

	// --- EXCEPCIONES DE PERSONAS ---

	@ExceptionHandler(PersonaExceptions.class)
	public ResponseEntity<String> handlePersonaExceptions(PersonaExceptions ex) {
		return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ex.getMessage());
	}

	@ExceptionHandler(PersonaNotFoundException.class)
	public ResponseEntity<String> handlePersonaNotFoundException(PersonaNotFoundException ex) {
		return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
	}

	// --- EXCEPCIONES DE VEHÍCULOS ---

	@ExceptionHandler(VehiculoNotFoundException.class)
	public ResponseEntity<String> handleVehiculoNotFound(VehiculoNotFoundException ex) {
		return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
	}

	@ExceptionHandler(VehiculoExceptions.class)
	public ResponseEntity<String> handleVehiculoExceptions(VehiculoExceptions ex) {
		return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ex.getMessage());
	}

	// --- EXCEPCIONES DE VENTAS ---

	@ExceptionHandler(VentaNotFoundException.class)
	public ResponseEntity<String> handleVentaNotFound(VentaNotFoundException ex) {
		return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
	}

	@ExceptionHandler(VentaExceptions.class)
	public ResponseEntity<String> handleVentaExceptions(VentaExceptions ex) {
		return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ex.getMessage());
	}
	
	// --- EXCEPCIONES DE MARCAS ---

	@ExceptionHandler(MarcaNotFoundException.class)
	public ResponseEntity<String> handleMarcaNotFound(MarcaNotFoundException ex){
		return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
	}

	@ExceptionHandler(MarcaExceptions.class)
	public ResponseEntity<String> handleMarcaExceptions(MarcaExceptions ex){
		return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ex.getMessage());
	}

	@ExceptionHandler(DataIntegrityViolationException.class)
	public ResponseEntity<String> handleDataIntegrityViolation(DataIntegrityViolationException ex) {
		return ResponseEntity.status(HttpStatus.CONFLICT).body("Error de integridad de datos: Es posible que el registro esté siendo utilizado por otras entidades.");
	}
}