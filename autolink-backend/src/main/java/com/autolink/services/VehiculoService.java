package com.autolink.services;

import java.io.IOException;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.autolink.persistence.entities.ImagenVehiculo;
import com.autolink.persistence.entities.Vehiculo;
import com.autolink.persistence.entities.enums.CombustibleVehiculo;
import com.autolink.persistence.entities.enums.EtiquetaMedioambiental;
import com.autolink.persistence.entities.enums.EstadoVerificacion;
import com.autolink.persistence.entities.enums.TipoVehiculo;
import com.autolink.persistence.repositories.ImagenVehiculoRepository;
import com.autolink.persistence.repositories.VehiculoRepository;
import com.autolink.services.dto.NotificationDTO;
import com.autolink.services.dto.VehiculoDTO;
import com.autolink.services.exceptions.MatriculaDuplicadaException;
import com.autolink.services.exceptions.VehiculoExceptions;
import com.autolink.services.exceptions.VehiculoNotFoundException;
import com.autolink.services.exceptions.VehiculoValidationException;
import com.autolink.services.mappers.VehiculoMapper;

import jakarta.transaction.Transactional;

@Service
public class VehiculoService {

	@Autowired
	private VehiculoRepository vehiculoRepository;

	@Autowired
	private VehiculoMapper vehiculoMapper;

	@Autowired
//	private ImgBBService imgBBService;
	private ImagenOptimizadaService imagenOptimizadaService;
	@Autowired
	private ImagenVehiculoRepository imagenVehiculoRepository;

	@Autowired
	private SimpMessagingTemplate messagingTemplate;

	private void notifyPublic(String type, String message, Object data) {
		NotificationDTO notification = NotificationDTO.builder().type(type).message(message).data(data).build();
		messagingTemplate.convertAndSend("/topic/vehiculos", notification);
	}

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
			Integer plazas, Integer anioFabricacion, String ciudad, EtiquetaMedioambiental etiqueta, boolean disponible,
			boolean aplicarDisp, EstadoVerificacion verificado, boolean aplicarVerif, Pageable pageable) {

		Page<Vehiculo> vehiculos = vehiculoRepository.buscarConFiltros(marca, modelo, tipo, combustible, color,
				minPotencia, maxPrecio, maxKm, plazas, anioFabricacion, ciudad, etiqueta, disponible, aplicarDisp,
				verificado, aplicarVerif, pageable);

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

		if (vehiculo.getVerificado() == null) {
			vehiculo.setVerificado(EstadoVerificacion.PENDIENTE);
		}

		if (vehiculo.getVerificado() == EstadoVerificacion.VERIFICADO) {
			vehiculo.setFechaVerificacion(LocalDate.now());
		}

		validarVehiculo(vehiculo, null);

		Vehiculo saved = this.vehiculoRepository.save(vehiculo);
		VehiculoDTO dto = vehiculoMapper.toDto(saved);
		String marcaNombre = (dto.getMarca() != null) ? dto.getMarca().getNombre() : "Desconocida";
		notifyPublic("VEHICLE_CREATED", "Nuevo vehículo publicado: " + marcaNombre + " " + dto.getModelo(), dto);
		return dto;
	}

	public void deleteVehiculo(int idVehiculo) {
		Vehiculo vehiculo = this.vehiculoRepository.findById(idVehiculo).orElseThrow(
				() -> new VehiculoNotFoundException("No es posible encontrar un vehiculo con el ID: " + idVehiculo));

		// Verificación de seguridad
		String currentUserEmail = SecurityContextHolder.getContext().getAuthentication().getName();
		boolean isAdmin = SecurityContextHolder.getContext().getAuthentication().getAuthorities().stream()
				.anyMatch(a -> a.getAuthority().equals("ROLE_ADMINISTRADOR"));

		if (!isAdmin && !vehiculo.getVendedor().getCorreo().equals(currentUserEmail)) {
			throw new VehiculoExceptions("No tienes permiso para eliminar este vehículo");
		}

		this.vehiculoRepository.deleteById(idVehiculo);
		notifyPublic("VEHICLE_DELETED", "Vehículo retirado del catálogo", idVehiculo);
	}

	public VehiculoDTO updateVehiculo(Vehiculo vehiculoRequest, int idVehiculo) {
		Vehiculo vehiculoBD = vehiculoRepository.findById(idVehiculo)
				.orElseThrow(() -> new VehiculoNotFoundException("Vehículo no encontrado"));

		// Verificación de seguridad
		String currentUserEmail = SecurityContextHolder.getContext().getAuthentication().getName();
		boolean isAdmin = SecurityContextHolder.getContext().getAuthentication().getAuthorities().stream()
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
		if (vehiculoRequest.getMatricula() != null)
			vehiculoBD.setMatricula(vehiculoRequest.getMatricula());
		if (vehiculoRequest.getFechaMatriculacion() != null)
			vehiculoBD.setFechaMatriculacion(vehiculoRequest.getFechaMatriculacion());
		if (vehiculoRequest.getVencimientoItv() != null)
			vehiculoBD.setVencimientoItv(vehiculoRequest.getVencimientoItv());
		if (vehiculoRequest.getEtiquetaMedioambiental() != null)
			vehiculoBD.setEtiquetaMedioambiental(vehiculoRequest.getEtiquetaMedioambiental());
		if (vehiculoRequest.getDescripcion() != null)
			vehiculoBD.setDescripcion(vehiculoRequest.getDescripcion());
		if (vehiculoRequest.getCiudad() != null)
			vehiculoBD.setCiudad(vehiculoRequest.getCiudad());

		validarVehiculo(vehiculoBD, idVehiculo);

		Vehiculo saved = vehiculoRepository.save(vehiculoBD);
		VehiculoDTO dto = vehiculoMapper.toDto(saved);
		notifyPublic("VEHICLE_UPDATED", "Vehículo actualizado: " + dto.getModelo(), dto);
		return dto;
	}

	public VehiculoDTO updateDisponible(boolean disponible, int idVehiculo) {
		Vehiculo vehiculoBD = this.vehiculoRepository.findById(idVehiculo).orElseThrow(
				() -> new VehiculoNotFoundException("No es posible encontrar el vehiculo con ID: " + idVehiculo));

		// Verificación de seguridad
		String currentUserEmail = SecurityContextHolder.getContext().getAuthentication().getName();
		boolean isAdmin = SecurityContextHolder.getContext().getAuthentication().getAuthorities().stream()
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
		VehiculoDTO dto = vehiculoMapper.toDto(saved);
		notifyPublic("VEHICLE_UPDATED", "Disponibilidad de vehículo cambiada", dto);
		return dto;
	}

	public VehiculoDTO updateVerificado(EstadoVerificacion verificado, int idVehiculo) {
		if (verificado == null) {
			throw new VehiculoExceptions("El estado de verificación no puede ser nulo");
		}

		Vehiculo vehiculoBD = this.vehiculoRepository.findById(idVehiculo).orElseThrow(
				() -> new VehiculoNotFoundException("No es posible encontrar el vehiculo con ID: " + idVehiculo));

		EstadoVerificacion estadoActual = vehiculoBD.getVerificado();

		if (estadoActual == EstadoVerificacion.VERIFICADO && verificado != EstadoVerificacion.VERIFICADO) {
			throw new VehiculoExceptions("Un vehículo verificado no puede volver a otro estado");
		}

		if (estadoActual == verificado) {
			throw new VehiculoExceptions("El vehículo ya se encuentra en el estado introducido");
		}

		vehiculoBD.setVerificado(verificado);

		if (verificado == EstadoVerificacion.VERIFICADO) {
			vehiculoBD.setFechaVerificacion(LocalDate.now());
		}

		Vehiculo saved = this.vehiculoRepository.save(vehiculoBD);
		VehiculoDTO dto = vehiculoMapper.toDto(saved);
		notifyPublic("VEHICLE_UPDATED", "Estado de verificación cambiado", dto);
		return dto;
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
		String currentUserEmail = SecurityContextHolder.getContext().getAuthentication().getName();
		boolean isAdmin = SecurityContextHolder.getContext().getAuthentication().getAuthorities().stream()
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
			if (archivo.getSize() > 5 * 1024 * 1024) {
				throw new VehiculoExceptions(
						"La imagen " + archivo.getOriginalFilename() + " es demasiado grande (máx 5MB).");
			}
//			String urlPublica = imgBBService.subirAImgBB(archivo);
//			Se procesa la foto localmente con compresion extrema (800px y 60% calidad)
			String base64DataUri = imagenOptimizadaService.optimizarYconvertirABase64(archivo);

			ImagenVehiculo nuevaImg = new ImagenVehiculo();
			nuevaImg.setUrl(base64DataUri);
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

	private void validarVehiculo(Vehiculo v, Integer currentId) {
		// 1. Validar Matrícula Duplicada
		if (v.getMatricula() != null && !v.getMatricula().isBlank()) {
			vehiculoRepository.findByMatricula(v.getMatricula()).ifPresent(existing -> {
				if (currentId == null || existing.getIdVehiculo() != currentId) {
					throw new MatriculaDuplicadaException(v.getMatricula());
				}
			});
		}

		// 2. Validar Fechas
		if (v.getFechaMatriculacion() != null) {
			if (v.getFechaMatriculacion().isAfter(LocalDate.now())) {
				throw new VehiculoValidationException("La fecha de matriculación no puede ser futura.");
			}
		}

		if (v.getVencimientoItv() != null && v.getFechaMatriculacion() != null) {
			if (v.getVencimientoItv().isBefore(v.getFechaMatriculacion())) {
				throw new VehiculoValidationException("El vencimiento de la ITV no puede ser anterior a la fecha de matriculación.");
			}
		}

		// 3. Validar que la fecha de matriculación no sea anterior al año de fabricación
		if (v.getFechaMatriculacion() != null && v.getAnioFabricacion() != 0) {
			if (v.getFechaMatriculacion().getYear() < v.getAnioFabricacion()) {
				throw new VehiculoValidationException("La fecha de matriculación no puede ser anterior al año de fabricación (" + v.getAnioFabricacion() + ").");
			}
		}

		// 4. Validar Longitud Descripción
		if (v.getDescripcion() != null && v.getDescripcion().length() > 1000) {
			throw new VehiculoValidationException("La descripción no puede exceder los 1000 caracteres.");
		}
	}
}
