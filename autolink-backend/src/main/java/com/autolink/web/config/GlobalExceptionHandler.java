package com.autolink.web.config;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;

import com.autolink.services.exceptions.VehiculoExceptions;
import com.autolink.services.exceptions.VehiculoNotFoundException;
import com.autolink.services.exceptions.VentaExceptions;
import com.autolink.services.exceptions.VentaNotFoundException;

@RestControllerAdvice
public class GlobalExceptionHandler {

	@ExceptionHandler(MethodArgumentTypeMismatchException.class)
	public ResponseEntity<String> handleEnumConversionError(MethodArgumentTypeMismatchException ex) {
		String paramName = ex.getName();
		String value = ex.getValue() != null ? ex.getValue().toString() : "null";
		String type = ex.getRequiredType() != null ? ex.getRequiredType().getSimpleName() : "Unknown";

		String message = String.format("El valor '%s' para el parámetro '%s' no es válido para '%s'.", value, paramName,
				type);

		return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(message);
	}
	
	// Vehiculos
	@ExceptionHandler(VehiculoNotFoundException.class)
	public ResponseEntity<String> handleNVehiculootFound(VehiculoNotFoundException ex){
		return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
	}
	
	@ExceptionHandler(VehiculoExceptions.class)
	public ResponseEntity<String> handleVehiculoException(VehiculoExceptions ex){
		return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ex.getMessage());
	}
	
	
	// ventas
	@ExceptionHandler(VentaNotFoundException.class)
	public ResponseEntity<String> handleVentasNotFound(VentaNotFoundException ex){
		return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
	}
	
	@ExceptionHandler(VentaExceptions.class)
	public ResponseEntity<String> handleVentasExceptions(VentaExceptions ex){
		return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ex.getMessage());
	}
}
