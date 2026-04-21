package com.autolink.services;

import java.io.IOException;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.autolink.persistence.entities.ImagenVehiculo;
import com.autolink.persistence.entities.Vehiculo;
import com.autolink.persistence.entities.enums.CombustibleVehiculo;
import com.autolink.persistence.entities.enums.TipoVehiculo;
import com.autolink.persistence.repositories.ImagenVehiculoRepository;
import com.autolink.persistence.repositories.VehiculoRepository;
import com.autolink.services.dto.VehiculoDTO;
import com.autolink.services.exceptions.VehiculoExceptions;
import com.autolink.services.exceptions.VehiculoNotFoundException;
import com.autolink.services.mappers.VehiculoMapper;

import jakarta.transaction.Transactional;

@Service
public class VehiculoService {

	@Autowired
	private VehiculoRepository vehiculoRepository;

	@Autowired
	private VehiculoMapper vehiculoMapper;

	@Autowired
	private ImgBBService imgBBService;
	@Autowired
	private ImagenVehiculoRepository imagenVehiculoRepository;

	public List<VehiculoDTO> getAllVehiculos() {
		return this.vehiculoRepository.findAll().stream().map(vehiculoMapper::toDto).collect(Collectors.toList());
	}

	public VehiculoDTO findById(int idVehiculo) {
		Vehiculo vehiculo = this.vehiculoRepository.findById(idVehiculo).orElseThrow(
				() -> new VehiculoNotFoundException("No es posible encontrar el vehiculo con ID: " + idVehiculo));
		return vehiculoMapper.toDto(vehiculo);
	}

	public Page<VehiculoDTO> getVehiculosDisponibles(Pageable pageable) {
		Page<Vehiculo> vehiculos = this.vehiculoRepository.findByDisponibleTrue(pageable);
		if (vehiculos.isEmpty()) {
			throw new VehiculoNotFoundException("No se han encontrado vehiculos disponibles");
		}
		return vehiculos.map(vehiculoMapper::toDto);
	}

	public Page<VehiculoDTO> filtrarVehiculos(String marca, String modelo, TipoVehiculo tipo,
			CombustibleVehiculo combustible, String color, Integer minPotencia, Integer maxPrecio, Integer maxKm,
			Integer plazas, Integer anioFabricacion, boolean disponible, boolean aplicarDisp, boolean verificado,
			boolean aplicarVerif, Pageable pageable) {

		Page<Vehiculo> vehiculos = vehiculoRepository.buscarConFiltros(marca, modelo, tipo, combustible, color,
				minPotencia, maxPrecio, maxKm, plazas, anioFabricacion, disponible, aplicarDisp, verificado,
				aplicarVerif, pageable);

		if (vehiculos.isEmpty()) {
			throw new VehiculoNotFoundException("No se han encontrado vehiculos con los filtros asignados");
		}

		return vehiculos.map(vehiculoMapper::toDto);
	}

	public Page<VehiculoDTO> getVehiculosPorVendedorPaginado(int idVendedor, Pageable pageable) {
		Page<Vehiculo> vehiculos = this.vehiculoRepository.findByVendedorId(idVendedor, pageable);

		if (vehiculos.isEmpty()) {
			throw new VehiculoNotFoundException("Este vendedor no tiene vehículos asignados en stock");
		}

		return vehiculos.map(vehiculoMapper::toDto);
	}

	public VehiculoDTO createVehiculo(Vehiculo vehiculo) {
		if (vehiculo.getDisponible() == null) {
			vehiculo.setDisponible(true);
		}

		if (vehiculo.getVerificado() != null && vehiculo.getVerificado()) {
			vehiculo.setFechaVerificacion(LocalDate.now());
		}
		Vehiculo saved = this.vehiculoRepository.save(vehiculo);
		return vehiculoMapper.toDto(saved);
	}

	public void deleteVehiculo(int idVehiculo) {
		Vehiculo vehiculo = this.vehiculoRepository.findById(idVehiculo)
				.orElseThrow(() -> new VehiculoNotFoundException("No es posible encontrar un vehiculo con el ID: " + idVehiculo));

		// Verificación de seguridad
		String currentUserEmail = org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication().getName();
		boolean isAdmin = org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication().getAuthorities().stream()
				.anyMatch(a -> a.getAuthority().equals("ROLE_ADMINISTRADOR"));
		
		if (!isAdmin && !vehiculo.getVendedor().getCorreo().equals(currentUserEmail)) {
			throw new VehiculoExceptions("No tienes permiso para eliminar este vehículo");
		}

		this.vehiculoRepository.deleteById(idVehiculo);
	}

	public VehiculoDTO updateVehiculo(Vehiculo vehiculoRequest, int idVehiculo) {
		Vehiculo vehiculoBD = vehiculoRepository.findById(idVehiculo)
				.orElseThrow(() -> new VehiculoNotFoundException("Vehículo no encontrado"));

		// Verificación de seguridad
		String currentUserEmail = org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication().getName();
		boolean isAdmin = org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication().getAuthorities().stream()
				.anyMatch(a -> a.getAuthority().equals("ROLE_ADMINISTRADOR"));
		
		if (!isAdmin && !vehiculoBD.getVendedor().getCorreo().equals(currentUserEmail)) {
			throw new VehiculoExceptions("No tienes permiso para modificar este vehículo");
		}

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

		// Verificación de seguridad
		String currentUserEmail = org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication().getName();
		boolean isAdmin = org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication().getAuthorities().stream()
				.anyMatch(a -> a.getAuthority().equals("ROLE_ADMINISTRADOR"));
		
		if (!isAdmin && !vehiculoBD.getVendedor().getCorreo().equals(currentUserEmail)) {
			throw new VehiculoExceptions("No tienes permiso para cambiar la disponibilidad de este vehículo");
		}

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

	// desactivar los vehiculos de un vendedor cuando es inactivo
	@Transactional
	public void desactivarVehiculosVendedor(int idVendedor) {
		List<Vehiculo> vehiculos = this.vehiculoRepository.findByVendedorId(idVendedor);

		if (!vehiculos.isEmpty()) {
			this.vehiculoRepository.desactivarTodosPorVendedor(idVendedor);
		}
	}

	// definicion de tipos de archivos de imagen
	public static final List<String> TIPOS_PERMITIDOS = List.of("image/jpeg", "image/png", "image/webp");

	// subir imagenes del vehiculo
	@Transactional
	public VehiculoDTO subirFotos(int idVehiculo, MultipartFile[] archivos) throws IOException {

		// buscar vehiculo por el id
		Vehiculo vehiculo = vehiculoRepository.findById(idVehiculo)
				.orElseThrow(() -> new VehiculoNotFoundException("Vehiculo no se encuentra."));
		
		// Verificación de seguridad
		String currentUserEmail = org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication().getName();
		boolean isAdmin = org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication().getAuthorities().stream()
				.anyMatch(a -> a.getAuthority().equals("ROLE_ADMINISTRADOR"));
		
		if (!isAdmin && !vehiculo.getVendedor().getCorreo().equals(currentUserEmail)) {
			throw new VehiculoExceptions("No tienes permiso para subir fotos a este vehículo");
		}
		// validar max 5 imagenes
		if (vehiculo.getImagenes().size() + archivos.length > 5) {
			throw new VehiculoExceptions("El vehiculo no puede tener mas de 5 imagenes. ");

		}
		for (MultipartFile archivo : archivos) {
			// validar tipo de archivo subido
			String contentType = archivo.getContentType();
			if (contentType == null || !TIPOS_PERMITIDOS.contains(contentType)) {
				throw new VehiculoExceptions("El archivo " + archivo.getOriginalFilename()
						+ " no es una imagen válida (solo JPG, PNG, WEBP).");
			}
			
			// validar tamaño
			if(archivo.getSize() > 5 * 1024 * 1024) {
				throw new VehiculoExceptions("La imagen " + archivo.getOriginalFilename() + " es demasiado grande (máx 5MB).");
			}
			String urlPublica = imgBBService.subirAImgBB(archivo);

			ImagenVehiculo nuevaImg = new ImagenVehiculo();
			nuevaImg.setUrl(urlPublica);
			nuevaImg.setVehiculo(vehiculo);

			// guardar
			imagenVehiculoRepository.save(nuevaImg);

			// actualizar lista en e vehiculo en memoria
			vehiculo.getImagenes().add(nuevaImg);

		}
		return vehiculoMapper.toDto(vehiculo);
	}

	// borrar una imagen especifica
	@Transactional
	public void deleteFoto(int idFoto) {
		if (!this.imagenVehiculoRepository.existsById(idFoto)) {
			throw new VehiculoExceptions("No existe la imagen con ID: " + idFoto);
		}
		this.imagenVehiculoRepository.deleteById(idFoto);
	}
	
	// correo
	public Vehiculo findByIdEntity(int id) {
	    return vehiculoRepository.findById(id)
	        .orElseThrow(() -> new VehiculoNotFoundException("Vehículo no encontrado"));
	}
}
