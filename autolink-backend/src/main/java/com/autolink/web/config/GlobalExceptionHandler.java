package com.autolink.web.config;

import java.io.IOException;
import java.util.Map;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;
import org.springframework.web.multipart.MaxUploadSizeExceededException;

import com.autolink.services.exceptions.MarcaExceptions;
import com.autolink.services.exceptions.MarcaNotFoundException;
import com.autolink.services.exceptions.PersonaExceptions;
import com.autolink.services.exceptions.PersonaNotFoundException;
import com.autolink.services.exceptions.MatriculaDuplicadaException;
import com.autolink.services.exceptions.VehiculoExceptions;
import com.autolink.services.exceptions.VehiculoNotFoundException;
import com.autolink.services.exceptions.VehiculoValidationException;
import com.autolink.services.exceptions.VentaExceptions;
import com.autolink.services.exceptions.VentaNotFoundException;

@RestControllerAdvice
public class GlobalExceptionHandler {

	// --- EXCEPCIONES DE SEGURIDAD ---

	@ExceptionHandler(AuthenticationException.class)
	public ResponseEntity<Map<String, String>> handleAuthenticationException(AuthenticationException ex) {
		return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "Usuario o contraseña incorrectos."));
	}

	@ExceptionHandler(AccessDeniedException.class)
	public ResponseEntity<Map<String, String>> handleAccessDeniedException(AccessDeniedException ex) {
		return ResponseEntity.status(HttpStatus.FORBIDDEN)
				.body(Map.of("message", "No tienes permisos suficientes para realizar esta acción."));
	}

	// --- EXCEPCIONES DE PARÁMETROS ---

	@ExceptionHandler(MethodArgumentTypeMismatchException.class)
	public ResponseEntity<String> handleEnumConversionError(MethodArgumentTypeMismatchException ex) {
		return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ex.getMessage());
	}

	// --- EXCEPCIONES DE PERSONAS ---

	@ExceptionHandler(PersonaExceptions.class)
	public ResponseEntity<Map<String, String>> handlePersonaExceptions(PersonaExceptions ex) {
		return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", ex.getMessage()));
	}

	@ExceptionHandler(PersonaNotFoundException.class)
	public ResponseEntity<Map<String, String>> handlePersonaNotFoundException(PersonaNotFoundException ex) {
		return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", ex.getMessage()));
	}

	// --- EXCEPCIONES DE VEHÍCULOS ---

	@ExceptionHandler(VehiculoNotFoundException.class)
	public ResponseEntity<Map<String, String>> handleVehiculoNotFound(VehiculoNotFoundException ex) {
		return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", ex.getMessage()));
	}

	@ExceptionHandler(VehiculoExceptions.class)
	public ResponseEntity<Map<String, String>> handleVehiculoExceptions(VehiculoExceptions ex) {
		return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", ex.getMessage()));
	}

	@ExceptionHandler(MatriculaDuplicadaException.class)
	public ResponseEntity<Map<String, String>> handleMatriculaDuplicada(MatriculaDuplicadaException ex) {
		return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("message", ex.getMessage()));
	}

	@ExceptionHandler(VehiculoValidationException.class)
	public ResponseEntity<Map<String, String>> handleVehiculoValidation(VehiculoValidationException ex) {
		return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", ex.getMessage()));
	}

	// --- EXCEPCIONES DE VENTAS ---

	@ExceptionHandler(VentaNotFoundException.class)
	public ResponseEntity<Map<String, String>> handleVentaNotFound(VentaNotFoundException ex) {
		return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", ex.getMessage()));
	}

	@ExceptionHandler(VentaExceptions.class)
	public ResponseEntity<Map<String, String>> handleVentaExceptions(VentaExceptions ex) {
		return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", ex.getMessage()));
	}

	// --- EXCEPCIONES DE MARCAS ---

	@ExceptionHandler(MarcaNotFoundException.class)
	public ResponseEntity<Map<String, String>> handleMarcaNotFound(MarcaNotFoundException ex) {
		return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", ex.getMessage()));
	}

	@ExceptionHandler(MarcaExceptions.class)
	public ResponseEntity<Map<String, String>> handleMarcaExceptions(MarcaExceptions ex) {
		return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", ex.getMessage()));
	}

	@ExceptionHandler(DataIntegrityViolationException.class)
	public ResponseEntity<Map<String, String>> handleDataIntegrityViolation(DataIntegrityViolationException ex) {
		return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("message",
				"Error de integridad de datos: Es posible que el registro esté siendo utilizado por otras entidades."));
	}

	// --- EXCEPCIONES DE ARCHIVOS / SUBIDA ---ç
	@ExceptionHandler(MaxUploadSizeExceededException.class)
	public ResponseEntity<Map<String, String>> handleMaxUploadSizeExceededException(MaxUploadSizeExceededException ex) {
		return ResponseEntity.status(HttpStatus.PAYLOAD_TOO_LARGE)
				.body(Map.of("message", "El archivo es demasiado grande. El límite máximo permitido es de 5MB por foto."));
	}

	@ExceptionHandler(IOException.class)
	public ResponseEntity<Map<String, String>> handleIOException(IOException ex) {
		ex.printStackTrace(); // Log the error for the developer
		return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
				.body(Map.of("message", "Error al procesar el archivo o al conectar con el servidor de imágenes: " + ex.getMessage()));
	}

	@ExceptionHandler(Exception.class)
	public ResponseEntity<Map<String, String>> handleGenericException(Exception ex) {
		ex.printStackTrace(); // Log the error for the developer
		return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
				.body(Map.of("message", "Ha ocurrido un error inesperado: " + ex.getMessage()));
	}

}