package com.autolink.web.config;

import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
@EnableWebSecurity
public class SecurityConfig {
	
	
	
	@Autowired
	private JwtFilter jwtFilter;
	
	@Bean
	SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
		http
			.csrf(csrf -> csrf.disable())
			.cors(cors -> cors.configurationSource(corsConfigurationSource()))
			.sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
			.authorizeHttpRequests(auth -> auth
				// --- 1. AUTH & PÚBLICO ---
				.requestMatchers("/auth/**").permitAll()
				.requestMatchers(HttpMethod.GET, "/marcas").permitAll()
				.requestMatchers(HttpMethod.GET, "/vehiculos").permitAll()
				.requestMatchers(HttpMethod.GET, "/vehiculos/buscar**").permitAll()
				.requestMatchers(HttpMethod.GET, "/vehiculos/buscar-disponible").permitAll()

				// --- 2. PERSONAS (PersonaController) ---
				.requestMatchers(HttpMethod.GET, "/personas").hasRole("ADMINISTRADOR")
				.requestMatchers(HttpMethod.GET, "/personas/vendedor", "/personas/cliente", "/personas/admin").hasRole("ADMINISTRADOR")
				.requestMatchers(HttpMethod.PUT, "/personas/*/tipo-usuario").hasRole("ADMINISTRADOR")
				.requestMatchers(HttpMethod.DELETE, "/personas/*").hasRole("ADMINISTRADOR")
				.requestMatchers("/personas/**").authenticated() // Ver perfil propio y updatePerfil

				// --- 3. VEHÍCULOS (VehiculoController) ---
				.requestMatchers(HttpMethod.POST, "/vehiculos").hasAnyRole("VENDEDOR", "ADMINISTRADOR")
				.requestMatchers(HttpMethod.PUT, "/vehiculos/{idVehiculo}").hasAnyRole("VENDEDOR", "ADMINISTRADOR")
				.requestMatchers(HttpMethod.PUT, "/vehiculos/*/disponible").hasAnyRole("VENDEDOR", "ADMINISTRADOR")
				.requestMatchers(HttpMethod.PUT, "/vehiculos/*/verificado").hasRole("ADMINISTRADOR") // Solo Admin verifica autenticidad
				.requestMatchers(HttpMethod.DELETE, "/vehiculos/*").hasAnyRole("VENDEDOR", "ADMINISTRADOR")
				.requestMatchers(HttpMethod.GET, "/vehiculos/vendedor/*").authenticated()

				// --- 4. VENTAS (VentaController) ---
				.requestMatchers(HttpMethod.POST, "/ventas").hasAnyRole("VENDEDOR", "ADMINISTRADOR")
				.requestMatchers(HttpMethod.GET, "/ventas").hasRole("ADMINISTRADOR")
				.requestMatchers(HttpMethod.GET, "/ventas/vendedor/*").hasAnyRole("VENDEDOR", "ADMINISTRADOR")
				.requestMatchers(HttpMethod.GET, "/ventas/cliente/*").authenticated()
				.requestMatchers(HttpMethod.DELETE, "/ventas/*").hasRole("ADMINISTRADOR")

				// --- 5. MARCAS (MarcaController) ---
				.requestMatchers(HttpMethod.POST, "/marcas").hasRole("ADMINISTRADOR")
				.requestMatchers(HttpMethod.DELETE, "/marcas/*").hasRole("ADMINISTRADOR")

				.anyRequest().authenticated()
			)
			.addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);
			
		return http.build();
	}
	
	@Bean
	PasswordEncoder passwordEncoder() {
		return new BCryptPasswordEncoder();
	}
	
    @Bean
    CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.asList("http://localhost:4200"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type", "Accept"));
        configuration.setExposedHeaders(List.of("Authorization"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
    
    @Bean
    AuthenticationManager authenticationManager(AuthenticationConfiguration configuration) throws Exception {
        return configuration.getAuthenticationManager();
    }	
}