package com.autolink;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.web.config.EnableSpringDataWebSupport;
import org.springframework.data.web.config.EnableSpringDataWebSupport.PageSerializationMode;

@SpringBootApplication
//Esta anotación se usa para evitar el warning de Spring al devolver objetos Page.
//Por defecto, Spring serializa PageImpl directamente a JSON, lo cual no es recomendable
//porque su estructura interna no es estable y puede cambiar en futuras versiones.
//Con pageSerializationMode = VIA_DTO, Spring convierte automáticamente la paginación
//a un formato más estable y seguro para APIs REST.
@EnableSpringDataWebSupport(pageSerializationMode = PageSerializationMode.VIA_DTO)
public class AutolinkBackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(AutolinkBackendApplication.class, args);
	}

}
