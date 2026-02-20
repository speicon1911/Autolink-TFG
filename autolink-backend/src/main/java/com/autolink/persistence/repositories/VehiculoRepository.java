package com.autolink.persistence.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.autolink.persistence.entities.Vehiculo;
import com.autolink.persistence.entities.enums.MarcaVehiculos;
import com.autolink.persistence.entities.enums.TipoVehiculo;

public interface VehiculoRepository extends JpaRepository<Vehiculo, Integer> {

	List<Vehiculo> findByDisponibleTrue();

	// filtro
	@Query("SELECT v FROM Vehiculo v WHERE " + "(:marca IS NULL OR v.marca.nombre = :marca) AND " +
	// Convertimos la columna y el parámetro a MAYÚSCULAS
			"(:modelo IS NULL OR UPPER(v.modelo) LIKE UPPER(CONCAT('%', :modelo, '%'))) AND "
			+ "(:tipo IS NULL OR v.tipoVehiculo = :tipo) AND "
			+ "(:color IS NULL OR UPPER(v.color) = UPPER(:color)) AND "
			+ "(:minPotencia IS NULL OR v.potencia >= :minPotencia) AND "
			+ "(:maxPrecio IS NULL OR v.precio <= :maxPrecio) AND " + "(:maxKm IS NULL OR v.kilometraje <= :maxKm) AND "
			+ "(:plazas IS NULL OR v.plazas = :plazas) AND " + "(:disponible IS NULL OR v.disponible = :disponible)")
	List<Vehiculo> buscarConFiltros(@Param("marca") MarcaVehiculos marca, @Param("modelo") String modelo,
			@Param("tipo") TipoVehiculo tipo, @Param("color") String color, @Param("minPotencia") Integer minPotencia,
			@Param("maxPrecio") Integer maxPrecio, @Param("maxKm") Integer maxKm, @Param("plazas") Integer plazas,
			@Param("disponible") boolean disponible, @Param("verificado") boolean verificado);
}
