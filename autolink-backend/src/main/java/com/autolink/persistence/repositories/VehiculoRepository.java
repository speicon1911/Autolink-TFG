package com.autolink.persistence.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.autolink.persistence.entities.Vehiculo;
import com.autolink.persistence.entities.enums.CombustibleVehiculo;
import com.autolink.persistence.entities.enums.EtiquetaMedioambiental;
import com.autolink.persistence.entities.enums.TipoVehiculo;

import jakarta.transaction.Transactional;

public interface VehiculoRepository extends JpaRepository<Vehiculo, Integer> {

	// mostrar los vehiculos disponibles
	Page<Vehiculo> findByDisponibleTrue(Pageable pageable);

	Optional<Vehiculo> findByMatricula(String matricula);

	// filtro del catalogo
	@Query("SELECT v FROM Vehiculo v WHERE " + "(:marca IS NULL OR UPPER(v.marca.nombre) = UPPER(:marca)) AND "
			+ "(:modelo IS NULL OR UPPER(v.modelo) LIKE UPPER(CONCAT('%', :modelo, '%'))) AND "
			+ "(:tipo IS NULL OR v.tipoVehiculo = :tipo) AND "
			+ "(:combustible IS NULL OR v.combustible = :combustible) AND "
			+ "(:color IS NULL OR UPPER(v.color) = UPPER(:color)) AND "
			+ "(:minPotencia IS NULL OR v.potencia >= :minPotencia) AND "
			+ "(:maxPrecio IS NULL OR v.precio <= :maxPrecio) AND " + "(:maxKm IS NULL OR v.kilometraje <= :maxKm) AND "
			+ "(:plazas IS NULL OR v.plazas = :plazas) AND "
			+ "(:anioFabricacion IS NULL OR v.anioFabricacion >= :anioFabricacion) AND "
			+ "(:ciudad IS NULL OR UPPER(v.ciudad) = UPPER(:ciudad)) AND "
			+ "(:etiqueta IS NULL OR v.etiquetaMedioambiental = :etiqueta) AND "
			+ "(:aplicarDisp = false OR v.disponible = :disponible) AND "
			+ "(:aplicarVerif = false OR v.verificado = :verificado)")
	Page<Vehiculo> buscarConFiltros(@Param("marca") String marca, @Param("modelo") String modelo, @Param("tipo") TipoVehiculo tipo, 
			@Param("combustible") CombustibleVehiculo combustible, @Param("color") String color, @Param("minPotencia") Integer minPotencia, 
			@Param("maxPrecio") Integer maxPrecio, @Param("maxKm") Integer maxKm, @Param("plazas") Integer plazas, 
			@Param("anioFabricacion") Integer anioFabricacion, @Param("ciudad") String ciudad, @Param("etiqueta") EtiquetaMedioambiental etiqueta, 
			@Param("disponible") boolean disponible, @Param("aplicarDisp") boolean aplicarDisp, 
			@Param("verificado") boolean verificado, @Param("aplicarVerif") boolean aplicarVerif, Pageable pageable);

	// paginar los vehiculos de un vendedor
	Page<Vehiculo> findByVendedorId(int idVendedor, Pageable pageable);

	// para buscar
	List<Vehiculo> findByVendedorId(int idVendedor);

	@Modifying
	@Transactional
	@Query("UPDATE Vehiculo v SET v.disponible = false WHERE v.vendedor.id = :idVendedor")
	void desactivarTodosPorVendedor(@Param("idVendedor") int idVendedor);
}
