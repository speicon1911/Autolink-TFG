package com.autolink.persistence.repositories;

import java.util.List;
import org.springframework.data.repository.ListCrudRepository;

import com.autolink.persistence.entities.Venta;

public interface VentaRepository extends ListCrudRepository<Venta, Integer>{

	List<Venta> findByVendedor_Id(int idVendedor);
	List<Venta> findByCliente_Id(int idCliente);
	List<Venta> findByVehiculo_IdVehiculo(int idVehiculo);
}
