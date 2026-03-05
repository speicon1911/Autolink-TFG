package com.autolink.web.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.autolink.services.AuthService;
import com.autolink.services.dto.LoginRequest;
import com.autolink.services.dto.LoginResponse;
import com.autolink.services.dto.RefreshDTO;
import com.autolink.services.dto.RegisterRequest;

@RestController
@RequestMapping("/auth")
public class AuthController {
	
	@Autowired
	private AuthService authService;
	
	@PostMapping("/login")
	public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest request) {
		return ResponseEntity.ok(this.authService.login(request));
	}

	@PostMapping("/register")
	public ResponseEntity<LoginResponse> register(@RequestBody RegisterRequest request) {
		// Corregido: Ahora recibe RegisterRequest para tener nombre, email, etc.
		return ResponseEntity.ok(this.authService.registrar(request));
	}
	
	@PostMapping("/refresh")
	public ResponseEntity<LoginResponse> refresh(@RequestBody RefreshDTO request) {
		return ResponseEntity.ok(this.authService.refresh(request));
	}
}