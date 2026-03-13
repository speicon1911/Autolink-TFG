package com.autolink.persistence.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.autolink.persistence.entities.Vehiculo;
import com.autolink.persistence.entities.enums.TipoVehiculo;

import jakarta.transaction.Transactional;

public interface VehiculoRepository extends JpaRepository<Vehiculo, Integer> {

	List<Vehiculo> findByDisponibleTrue();

	// filtro
	@Query("SELECT v FROM Vehiculo v WHERE " + "(:marca IS NULL OR UPPER(v.marca.nombre) = UPPER(:marca)) AND "
			+ "(:modelo IS NULL OR UPPER(v.modelo) LIKE UPPER(CONCAT('%', :modelo, '%'))) AND "
			+ "(:tipo IS NULL OR v.tipoVehiculo = :tipo) AND "
			+ "(:color IS NULL OR UPPER(v.color) = UPPER(:color)) AND "
			+ "(:minPotencia IS NULL OR v.potencia >= :minPotencia) AND "
			+ "(:maxPrecio IS NULL OR v.precio <= :maxPrecio) AND " + "(:maxKm IS NULL OR v.kilometraje <= :maxKm) AND "
			+ "(:plazas IS NULL OR v.plazas = :plazas) AND "
			+ "(:aplicarDisp = false OR v.disponible = :disponible) AND "
			+ "(:aplicarVerif = false OR v.verificado = :verificado)")
	List<Vehiculo> buscarConFiltros(String marca, String modelo, TipoVehiculo tipo, String color, Integer minPotencia,
			Integer maxPrecio, Integer maxKm, Integer plazas, boolean disponible, boolean aplicarDisp,
			boolean verificado, boolean aplicarVerif);

	List<Vehiculo> findByVendedorId(int idVendedor);
	
	@Modifying
	@Transactional
	@Query("UPDATE Vehiculo v SET v.disponible = false WHERE v.vendedor.id = :idVendedor")
	void desactivarTodosPorVendedor(@Param("idVendedor") int idVendedor);
}
