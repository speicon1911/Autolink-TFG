package com.autolink.services;

import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.autolink.persistence.entities.Vehiculo;
import com.autolink.persistence.entities.enums.TipoVehiculo;
import com.autolink.persistence.repositories.VehiculoRepository;
import com.autolink.services.exceptions.VehiculoExceptions;
import com.autolink.services.exceptions.VehiculoNotFoundException;

import jakarta.transaction.Transactional;

@Service
public class VehiculoService {

	@Autowired
	private VehiculoRepository vehiculoRepository;

	public List<Vehiculo> getAllVehiculos() {
		return this.vehiculoRepository.findAll();
	}

	public Vehiculo findById(int idVehiculo) {
		if (!this.vehiculoRepository.existsById(idVehiculo)) {
			throw new VehiculoNotFoundException("No es posible encontrar el vehiculo con ID: " + idVehiculo);
		}
		return this.vehiculoRepository.findById(idVehiculo).get();
	}

	// buscar vehiculos disponibles
	public List<Vehiculo> getVehiculosDisponibles() {
		List<Vehiculo> vehiculos = this.vehiculoRepository.findByDisponibleTrue();
		if (vehiculos.isEmpty()) {
			throw new VehiculoNotFoundException("No se han encontrado vehiculos disponibles");
		}
		return vehiculos;
	}

	// buscar vehiculos por filtro
	public List<Vehiculo> filtrarVehiculos(String marca, String modelo, TipoVehiculo tipo, String color,
			Integer minPotencia, Integer maxPrecio, Integer maxKm, Integer plazas, boolean disponible,
			boolean aplicarDisp, boolean verificado, boolean aplicarVerif) {

		// Pasamos los flags "aplicar" al repositorio
		List<Vehiculo> vehiculos = vehiculoRepository.buscarConFiltros(marca, modelo, tipo, color, minPotencia,
				maxPrecio, maxKm, plazas, disponible, aplicarDisp, verificado, aplicarVerif);

		if (vehiculos.isEmpty()) {
			throw new VehiculoNotFoundException("No se han encontrado vehiculos con los filtros asignados");
		}

		return vehiculos;
	}

	// obtener vehículos por vendedor
	public List<Vehiculo> getVehiculosPorVendedor(int idVendedor) {
		List<Vehiculo> vehiculos = this.vehiculoRepository.findByVendedorId(idVendedor);

		if (vehiculos.isEmpty()) {
			throw new VehiculoNotFoundException("Este vendedor no tiene vehículos asignados en stock");
		}

		return vehiculos;
	}

	// crear
	public Vehiculo createVehiculo(Vehiculo vehiculo) {
		if(vehiculo.getDisponible() == null) {
			vehiculo.setDisponible(true);
		}

		if(vehiculo.getVerificado() != null && vehiculo.getVerificado()) {
			vehiculo.setFechaVerificacion(LocalDate.now());
		}
		return this.vehiculoRepository.save(vehiculo);
	}

	// eliminar
	public void deleteVehiculo(int idVehiculo) {
		if(!this.vehiculoRepository.existsById(idVehiculo)) {
			throw new VehiculoNotFoundException("No es posible encontrar un vehiculo con el ID: " + idVehiculo);
		}
		this.vehiculoRepository.deleteById(idVehiculo);
	}

	// actualizar datos de coche
	public Vehiculo updateVehiculo(Vehiculo vehiculoRequest, int idVehiculo) {
		// 1. Buscamos el vehículo existente
		Vehiculo vehiculoBD = vehiculoRepository.findById(idVehiculo)
				.orElseThrow(() -> new VehiculoNotFoundException("Vehículo no encontrado"));

		// 2. Actualización selectiva de campos simples
		if (vehiculoRequest.getPrecio() != null)
			vehiculoBD.setPrecio(vehiculoRequest.getPrecio());
		if (vehiculoRequest.getPlazas() != null)
			vehiculoBD.setPlazas(vehiculoRequest.getPlazas());
		if (vehiculoRequest.getPotencia() != null)
			vehiculoBD.setPotencia(vehiculoRequest.getPotencia());
		if (vehiculoRequest.getColor() != null)
			vehiculoBD.setColor(vehiculoRequest.getColor());
		if (vehiculoRequest.getModelo() != null)
			vehiculoBD.setModelo(vehiculoRequest.getModelo());
		if (vehiculoRequest.getKilometraje() != null)
			vehiculoBD.setKilometraje(vehiculoRequest.getKilometraje());
		if (vehiculoRequest.getPuertas() != null)
			vehiculoBD.setPuertas(vehiculoRequest.getPuertas());
		if (vehiculoRequest.getTipoVehiculo() != null)
			vehiculoBD.setTipoVehiculo(vehiculoRequest.getTipoVehiculo());
		if (vehiculoRequest.getFechaFabricacion() != null)
			vehiculoBD.setFechaFabricacion(vehiculoRequest.getFechaFabricacion());
		if (vehiculoRequest.getDisponible() != null)
			vehiculoBD.setDisponible(vehiculoRequest.getDisponible());

		// 3. Manejo de la Marca (si envías una nueva marca)
		if (vehiculoRequest.getMarca() != null) {
			vehiculoBD.setMarca(vehiculoRequest.getMarca());
		}

		// 4. Guardamos los cambios
		return vehiculoRepository.save(vehiculoBD);
	}

	// actualizar disponible
	public Vehiculo updateDisponible(boolean disponible, int idVehiculo) {
		Vehiculo vehiculoBD = this.findById(idVehiculo);

		boolean estadoActual = vehiculoBD.getDisponible();

		if (estadoActual == disponible) {
			throw new VehiculoExceptions("El vehículo ya se encuentra en el estado introducido");
		}

		vehiculoBD.setDisponible(disponible);
		return this.vehiculoRepository.save(vehiculoBD);
	}

	// atualizar verificado
	public Vehiculo updateVerificado(Boolean verificado, int idVehiculo) {
		// 1. Validar que el valor no sea nulo para este proceso
		if (verificado == null) {
			throw new VehiculoExceptions("El estado de verificación no puede ser nulo");
		}

		Vehiculo vehiculoBD = this.findById(idVehiculo);

		// 2. Obtener estado actual (manejando el posible null inicial de la BD)
		boolean estadoActual = (vehiculoBD.getVerificado() != null) && vehiculoBD.getVerificado();

		// 3. No permitir volver de true a false
		if (estadoActual && !verificado) {
			throw new VehiculoExceptions("Un vehículo verificado no puede volver a no verificado");
		}

		// 4. No permitir mismo estado
		if (estadoActual == verificado) {
			throw new VehiculoExceptions("El vehículo ya se encuentra en el estado introducido");
		}

		// 5. Aplicar cambios
		vehiculoBD.setVerificado(verificado);

		// 6. Asignar fecha automática solo si el nuevo estado es true
		if (verificado) {
			vehiculoBD.setFechaVerificacion(LocalDate.now());
		}

		return this.vehiculoRepository.save(vehiculoBD);
	}
	
	// asiganar no disponibles todos los vehiculos de un vendedor de baja
	@Transactional
	public void desactivarVehiculosVendedor(int idVendedor) {
		List<Vehiculo> vehiculos = this.vehiculoRepository.findByVendedorId(idVendedor);
		
		if(!vehiculos.isEmpty()) {
			this.vehiculoRepository.desactivarTodosPorVendedor(idVendedor);
		}
	}
}
