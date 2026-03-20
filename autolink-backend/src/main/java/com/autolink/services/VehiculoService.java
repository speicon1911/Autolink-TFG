package com.autolink.services;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.autolink.persistence.entities.Vehiculo;
import com.autolink.persistence.entities.enums.TipoVehiculo;
import com.autolink.persistence.entities.enums.CombustibleVehiculo;
import com.autolink.persistence.repositories.VehiculoRepository;
import com.autolink.services.dto.VehiculoDTO;
import com.autolink.services.mappers.VehiculoMapper;
import com.autolink.services.mappers.MarcaMapper;
import com.autolink.services.exceptions.VehiculoExceptions;
import com.autolink.services.exceptions.VehiculoNotFoundException;

import jakarta.transaction.Transactional;

@Service
public class VehiculoService {

	@Autowired
	private VehiculoRepository vehiculoRepository;

	@Autowired
	private VehiculoMapper vehiculoMapper;
	
	@Autowired
	private MarcaMapper marcaMapper;

	public List<VehiculoDTO> getAllVehiculos() {
		return this.vehiculoRepository.findAll().stream()
				.map(vehiculoMapper::toDto)
				.collect(Collectors.toList());
	}

	public VehiculoDTO findById(int idVehiculo) {
		Vehiculo vehiculo = this.vehiculoRepository.findById(idVehiculo).orElseThrow(
				() -> new VehiculoNotFoundException("No es posible encontrar el vehiculo con ID: " + idVehiculo));
		return vehiculoMapper.toDto(vehiculo);
	}

	public List<VehiculoDTO> getVehiculosDisponibles() {
		List<Vehiculo> vehiculos = this.vehiculoRepository.findByDisponibleTrue();
		if (vehiculos.isEmpty()) {
			throw new VehiculoNotFoundException("No se han encontrado vehiculos disponibles");
		}
		return vehiculos.stream().map(vehiculoMapper::toDto).collect(Collectors.toList());
	}

	public List<VehiculoDTO> filtrarVehiculos(String marca, String modelo, TipoVehiculo tipo, CombustibleVehiculo combustible, String color,
			Integer minPotencia, Integer maxPrecio, Integer maxKm, Integer plazas, Integer anioFabricacion, boolean disponible,
			boolean aplicarDisp, boolean verificado, boolean aplicarVerif) {

		List<Vehiculo> vehiculos = vehiculoRepository.buscarConFiltros(marca, modelo, tipo, combustible, color, minPotencia,
				maxPrecio, maxKm, plazas, anioFabricacion, disponible, aplicarDisp, verificado, aplicarVerif);

		if (vehiculos.isEmpty()) {
			throw new VehiculoNotFoundException("No se han encontrado vehiculos con los filtros asignados");
		}

		return vehiculos.stream().map(vehiculoMapper::toDto).collect(Collectors.toList());
	}

	public List<VehiculoDTO> getVehiculosPorVendedor(int idVendedor) {
		List<Vehiculo> vehiculos = this.vehiculoRepository.findByVendedorId(idVendedor);

		if (vehiculos.isEmpty()) {
			throw new VehiculoNotFoundException("Este vendedor no tiene vehículos asignados en stock");
		}

		return vehiculos.stream().map(vehiculoMapper::toDto).collect(Collectors.toList());
	}

	public VehiculoDTO createVehiculo(Vehiculo vehiculo) {
		if(vehiculo.getDisponible() == null) {
			vehiculo.setDisponible(true);
		}

		if(vehiculo.getVerificado() != null && vehiculo.getVerificado()) {
			vehiculo.setFechaVerificacion(LocalDate.now());
		}
		Vehiculo saved = this.vehiculoRepository.save(vehiculo);
		return vehiculoMapper.toDto(saved);
	}

	public void deleteVehiculo(int idVehiculo) {
		if(!this.vehiculoRepository.existsById(idVehiculo)) {
			throw new VehiculoNotFoundException("No es posible encontrar un vehiculo con el ID: " + idVehiculo);
		}
		this.vehiculoRepository.deleteById(idVehiculo);
	}

	public VehiculoDTO updateVehiculo(Vehiculo vehiculoRequest, int idVehiculo) {
		Vehiculo vehiculoBD = vehiculoRepository.findById(idVehiculo)
				.orElseThrow(() -> new VehiculoNotFoundException("Vehículo no encontrado"));

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
		if (vehiculoRequest.getCombustible() != null)
			vehiculoBD.setCombustible(vehiculoRequest.getCombustible());
		if (vehiculoRequest.getAnioFabricacion() != 0)
			vehiculoBD.setAnioFabricacion(vehiculoRequest.getAnioFabricacion());
		if (vehiculoRequest.getDisponible() != null)
			vehiculoBD.setDisponible(vehiculoRequest.getDisponible());
		if (vehiculoRequest.getMarca() != null) {
			vehiculoBD.setMarca(vehiculoRequest.getMarca());
		}

		Vehiculo saved = vehiculoRepository.save(vehiculoBD);
		return vehiculoMapper.toDto(saved);
	}

	public VehiculoDTO updateDisponible(boolean disponible, int idVehiculo) {
		Vehiculo vehiculoBD = this.vehiculoRepository.findById(idVehiculo).orElseThrow(
				() -> new VehiculoNotFoundException("No es posible encontrar el vehiculo con ID: " + idVehiculo));

		boolean estadoActual = vehiculoBD.getDisponible();

		if (estadoActual == disponible) {
			throw new VehiculoExceptions("El vehículo ya se encuentra en el estado introducido");
		}

		vehiculoBD.setDisponible(disponible);
		Vehiculo saved = this.vehiculoRepository.save(vehiculoBD);
		return vehiculoMapper.toDto(saved);
	}

	public VehiculoDTO updateVerificado(Boolean verificado, int idVehiculo) {
		if (verificado == null) {
			throw new VehiculoExceptions("El estado de verificación no puede ser nulo");
		}

		Vehiculo vehiculoBD = this.vehiculoRepository.findById(idVehiculo).orElseThrow(
				() -> new VehiculoNotFoundException("No es posible encontrar el vehiculo con ID: " + idVehiculo));

		boolean estadoActual = (vehiculoBD.getVerificado() != null) && vehiculoBD.getVerificado();

		if (estadoActual && !verificado) {
			throw new VehiculoExceptions("Un vehículo verificado no puede volver a no verificado");
		}

		if (estadoActual == verificado) {
			throw new VehiculoExceptions("El vehículo ya se encuentra en el estado introducido");
		}

		vehiculoBD.setVerificado(verificado);

		if (verificado) {
			vehiculoBD.setFechaVerificacion(LocalDate.now());
		}

		Vehiculo saved = this.vehiculoRepository.save(vehiculoBD);
		return vehiculoMapper.toDto(saved);
	}
	
	@Transactional
	public void desactivarVehiculosVendedor(int idVendedor) {
		List<Vehiculo> vehiculos = this.vehiculoRepository.findByVendedorId(idVendedor);
		
		if(!vehiculos.isEmpty()) {
			this.vehiculoRepository.desactivarTodosPorVendedor(idVendedor);
		}
	}
}
