package com.autolink.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.autolink.persistence.entities.Vehiculo;
import com.autolink.persistence.entities.enums.MarcaVehiculos;
import com.autolink.persistence.entities.enums.TipoVehiculo;
import com.autolink.persistence.repositories.VehiculoRepository;
import com.autolink.services.exceptions.VehiculoExceptions;
import com.autolink.services.exceptions.VehiculoNotFoundException;

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
	public List<Vehiculo> filtrarVehiculos(MarcaVehiculos marca, String modelo, TipoVehiculo tipo,
			String color, Integer minPotencia, Integer maxPrecio, Integer maxKm,
			Integer plazas, boolean disponible, boolean verificado) {
		List<Vehiculo> vehiculos = vehiculoRepository.buscarConFiltros(marca, modelo, tipo, color, minPotencia,
				maxPrecio, maxKm, plazas,
				disponible, verificado);
		if (vehiculos.isEmpty()) {
			throw new VehiculoNotFoundException("No se han encontrado vehiculos con los filtros asiganados");
		}

		return vehiculos;
	}

	// actualizar datos de coche
	public Vehiculo updateVehiculo(Vehiculo vehiculo, int idVehiculo) {
		if (vehiculo.getIdVehiculo() != idVehiculo) {
			throw new VehiculoExceptions("El id introducido en el cuerpo y el de la ruta no coinciden");
		}
		if (!this.vehiculoRepository.existsById(idVehiculo)) {
			throw new VehiculoNotFoundException("No es posible encontrar el vehiculo con ID: " + idVehiculo);
		}

		Vehiculo vehiculoBD = this.findById(idVehiculo);

		vehiculoBD.setKilometraje(vehiculo.getKilometraje());
		vehiculoBD.setPrecio(vehiculo.getPrecio());
		vehiculoBD.setColor(vehiculo.getColor());
		vehiculoBD.setPlazas(vehiculo.getPlazas());
		vehiculoBD.setPotencia(vehiculo.getPotencia());
		vehiculoBD.setPuertas(vehiculo.getPuertas());

		return this.vehiculoRepository.save(vehiculoBD);
	}

	// actualizar disponible
	public Vehiculo updateDisponible(boolean disponible, int idVehiculo) {
		Vehiculo vehiculoBD = this.findById(idVehiculo);

		boolean estadoActual = vehiculoBD.isDisponible();

		if (estadoActual == disponible) {
			throw new VehiculoExceptions("El vehículo ya se encuentra en el estado introducido");
		}

		vehiculoBD.setDisponible(disponible);
		return this.vehiculoRepository.save(vehiculoBD);
	}

	// atualizar verificado
	public Vehiculo updateVerificado(boolean verificado, int idVehiculo) {
		Vehiculo vehiculoBD = this.findById(idVehiculo);

		boolean estadoActual = vehiculoBD.isVerificado();

		// No permitir volver de true a false
		if (estadoActual && !verificado) {
			throw new VehiculoExceptions("Un vehículo verificado no puede volver a no verificado");
		}

		// No permitir mismo estado
		if (estadoActual == verificado) {
			throw new VehiculoExceptions("El vehículo ya se encuentra en el estado introducido");
		}

		vehiculoBD.setVerificado(verificado);
		return this.vehiculoRepository.save(vehiculoBD);
	}
}
