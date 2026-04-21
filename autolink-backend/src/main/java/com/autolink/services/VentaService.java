package com.autolink.services;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.autolink.persistence.entities.Persona;
import com.autolink.persistence.entities.Vehiculo;
import com.autolink.persistence.entities.Venta;
import com.autolink.persistence.entities.enums.EstadoVenta;
import com.autolink.persistence.entities.enums.Rol;
import com.autolink.persistence.repositories.PersonaRepository;
import com.autolink.persistence.repositories.VehiculoRepository;
import com.autolink.persistence.repositories.VentaRepository;
import com.autolink.services.dto.VentaDTO;
import com.autolink.services.exceptions.VehiculoNotFoundException;
import com.autolink.services.exceptions.VentaExceptions;
import com.autolink.services.exceptions.VentaNotFoundException;
import com.autolink.services.mappers.VentaMapper;

import jakarta.transaction.Transactional;

@Service
public class VentaService {

	@Autowired
	private VentaRepository ventaRepository;

	@Autowired
	private VehiculoRepository vehiculoRepository;

	@Autowired
	private PersonaRepository personaRepository;

	@Autowired
	private VentaMapper ventaMapper;

	@Autowired
	private EmailService emailService;

	@Transactional
	public List<VentaDTO> findAll() {
		return this.ventaRepository.findAll().stream().map(ventaMapper::toDto).collect(Collectors.toList());
	}

	@Transactional
	public List<VentaDTO> findByVendedor(int idVendedor) {
		// Verificación de seguridad
		String currentUserEmail = org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication().getName();
		boolean isAdmin = org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication().getAuthorities().stream()
				.anyMatch(a -> a.getAuthority().equals("ROLE_ADMINISTRADOR"));
		
		// Buscar al vendedor para comparar el correo
		Persona vendedor = personaRepository.findById(idVendedor)
				.orElseThrow(() -> new com.autolink.services.exceptions.PersonaNotFoundException("Vendedor no encontrado"));

		if (!isAdmin && !vendedor.getCorreo().equals(currentUserEmail)) {
			throw new VentaExceptions("No tienes permiso para ver las ventas de este usuario");
		}

		List<Venta> ventas = this.ventaRepository.findByVendedor_Id(idVendedor);
		return ventas.stream().map(ventaMapper::toDto).collect(Collectors.toList());
	}

	@Transactional
	public List<VentaDTO> findByCliente(int idCliente) {
		// Verificación de seguridad
		String currentUserEmail = org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication().getName();
		boolean isAdmin = org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication().getAuthorities().stream()
				.anyMatch(a -> a.getAuthority().equals("ROLE_ADMINISTRADOR"));
		
		// Buscar al cliente para comparar el correo
		Persona cliente = personaRepository.findById(idCliente)
				.orElseThrow(() -> new com.autolink.services.exceptions.PersonaNotFoundException("Cliente no encontrado"));

		if (!isAdmin && !cliente.getCorreo().equals(currentUserEmail)) {
			throw new VentaExceptions("No tienes permiso para ver las ventas de este usuario");
		}

		List<Venta> compras = this.ventaRepository.findByCliente_Id(idCliente);
		return compras.stream().map(ventaMapper::toDto).collect(Collectors.toList());
	}

	@Transactional
	public List<VentaDTO> findByVehiculo(int idVehiculo) {
		List<Venta> ventas = this.ventaRepository.findByVehiculo_IdVehiculo(idVehiculo);
		return ventas.stream().map(ventaMapper::toDto).collect(Collectors.toList());
	}

	public VentaDTO createVenta(Venta venta) {
		if (venta.getVendedor() == null || venta.getCliente() == null || venta.getVehiculo() == null) {
			throw new VentaExceptions("La venta debe estar asociada a un vendedor, un cliente y un vehículo");
		}

		// Recuperar entidades reales de la BD para asegurar persistencia correcta
		Persona vendedorActual = personaRepository.findById(venta.getVendedor().getId()).orElseThrow(
				() -> new VentaNotFoundException("Vendedor no encontrado: " + venta.getVendedor().getId()));
		Persona clienteActual = personaRepository.findById(venta.getCliente().getId())
				.orElseThrow(() -> new VentaNotFoundException("Cliente no encontrado: " + venta.getCliente().getId()));
		Vehiculo vehiculoActual = vehiculoRepository.findById(venta.getVehiculo().getIdVehiculo()).orElseThrow(
				() -> new VehiculoNotFoundException("Vehículo no encontrado: " + venta.getVehiculo().getIdVehiculo()));

		venta.setVendedor(vendedorActual);
		venta.setCliente(clienteActual);
		venta.setVehiculo(vehiculoActual);

		// Validaciones de negocio
		if (vendedorActual.getId() == clienteActual.getId()) {
			throw new VentaExceptions("No puedes comprar tu propio vehículo");
		}

		if (Boolean.FALSE.equals(vehiculoActual.getDisponible())) {
			throw new VentaExceptions("El vehículo ya no está disponible para la venta");
		}

		if (venta.getFecha() == null) {
			venta.setFecha(LocalDate.now());
		}

		venta.setEstadoVenta(EstadoVenta.EN_PROGRESO);
		venta.setRolUltimoModificador(Rol.CLIENTE);

		// 1. Guardamos primero
		Venta ventaGuardada = this.ventaRepository.save(venta);

		// 2. Enviamos el correo (ahora que sabemos que se ha guardado bien)
		emailService.notificarNuevaOferta(vendedorActual.getCorreo(), clienteActual.getNombre(),
				vehiculoActual.getModelo(), venta.getPrecio());

		// 3. Devolvemos el resultado
		return ventaMapper.toDto(ventaGuardada);
	}

	@Transactional
	public void anularVenta(int idVenta) {
		Venta venta = this.ventaRepository.findById(idVenta)
				.orElseThrow(() -> new VentaNotFoundException("No es posible encontrar la venta con ID: " + idVenta));

		// Verificación de seguridad: Solo el comprador, el vendedor o un admin pueden anular
		String currentUserEmail = org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication().getName();
		boolean isAdmin = org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication().getAuthorities().stream()
				.anyMatch(a -> a.getAuthority().equals("ROLE_ADMINISTRADOR"));
		
		if (!isAdmin && !venta.getVendedor().getCorreo().equals(currentUserEmail) && !venta.getCliente().getCorreo().equals(currentUserEmail)) {
			throw new VentaExceptions("No tienes permiso para anular esta oferta");
		}

		venta.setEstadoVenta(EstadoVenta.ANULADA);

		// Asegurar que el vehículo esté disponible (por si acaso estaba en otro estado)
		if (venta.getVehiculo() != null) {
			Vehiculo vehiculo = venta.getVehiculo();
			vehiculo.setDisponible(true);
			vehiculoRepository.save(vehiculo);
		}

		this.ventaRepository.save(venta);
		
		// Notificamos a las partes que la venta ha sido cancelada
		emailService.notificarOfertaCancelada(venta.getVendedor().getCorreo(), venta.getVehiculo().getModelo());
		emailService.notificarOfertaCancelada(venta.getCliente().getCorreo(), venta.getVehiculo().getModelo());
	}

	@Transactional
	public void completarVenta(int idVenta) {
		Venta venta = this.ventaRepository.findById(idVenta)
				.orElseThrow(() -> new VentaNotFoundException("Venta no encontrada"));

		if (venta.getEstadoVenta() != EstadoVenta.EN_PROGRESO) {
			throw new VentaExceptions("Solo se pueden completar ofertas que estén en progreso");
		}

		// Verificación de seguridad
		String currentUserEmail = org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication().getName();
		boolean isAdmin = org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication().getAuthorities().stream()
				.anyMatch(a -> a.getAuthority().equals("ROLE_ADMINISTRADOR"));
		
		if (!isAdmin && !venta.getVendedor().getCorreo().equals(currentUserEmail) && !venta.getCliente().getCorreo().equals(currentUserEmail)) {
			throw new VentaExceptions("No tienes permiso para completar esta oferta");
		}

		// 1. Marcar el vehículo como vendido
		Vehiculo vehiculo = venta.getVehiculo();
		vehiculo.setDisponible(false);
		this.vehiculoRepository.save(vehiculo);

		// 2. Marcar esta venta como REALIZADA
		venta.setEstadoVenta(EstadoVenta.REALIZADA);
		this.ventaRepository.save(venta);
		
		// Avisar de venta confirmada
		emailService.notificarOfertaAceptada(venta.getCliente().getCorreo(), vehiculo.getModelo(), venta.getPrecio());
		emailService.notificarOfertaAceptada(venta.getVendedor().getCorreo(), vehiculo.getModelo(), venta.getPrecio());

		// 3. ANULAR automáticamente todas las demás ofertas EN_PROGRESO para este mismo vehículo
		List<Venta> otrasOfertas = this.ventaRepository.findByVehiculo_IdVehiculo(vehiculo.getIdVehiculo());
		for (Venta v : otrasOfertas) {
			if (v.getIdVenta() != idVenta && v.getEstadoVenta() == EstadoVenta.EN_PROGRESO) {
				v.setEstadoVenta(EstadoVenta.ANULADA);
				this.ventaRepository.save(v);
				
				// Avisar al otro cliente de que este coche ya se ha vendido
				emailService.notificarOfertaCancelada(v.getCliente().getCorreo(), vehiculo.getModelo());
			}
		}
	}

	public void deleteVenta(int idVenta) {
		if (!this.ventaRepository.existsById(idVenta)) {
			throw new VentaNotFoundException("No es posible eliminar la venta con ID: " + idVenta);
		}
		this.ventaRepository.deleteById(idVenta);
	}

	public VentaDTO updatePrecioVenta(Venta venta, int idVenta) {
		if (venta.getIdVenta() != idVenta) {
			throw new VentaExceptions(
					String.format("El id introducido en el cuerpo (%d) y el de la ruta (%d) no coinciden",
							venta.getIdVenta(), idVenta));
		}

		Venta ventaBD = this.ventaRepository.findById(idVenta)
				.orElseThrow(() -> new VentaNotFoundException("No es posible encontrar la venta con ID: " + idVenta));

		// 1. Actualizamos los datos
		if (venta.getPrecio() != null && venta.getPrecio() > 0) {
			ventaBD.setPrecio(venta.getPrecio());
		} else {
			throw new VentaExceptions("El precio debe ser un valor positivo");
		}

		if (venta.getRolUltimoModificador() != null) {
			ventaBD.setRolUltimoModificador(venta.getRolUltimoModificador());
		}

		// 2. Guardamos los cambios
		Venta ventaGuardada = this.ventaRepository.save(ventaBD);

		// 3. Enviamos la notificación a la persona contraria
		// Si el último que tocó la oferta fue el VENDEDOR, avisamos al CLIENTE
		if (ventaGuardada.getRolUltimoModificador() == Rol.VENDEDOR) {
			emailService.notificarRespuestaOferta(ventaGuardada.getCliente().getCorreo(),
					ventaGuardada.getVendedor().getNombre(), ventaGuardada.getVehiculo().getModelo(),
					ventaGuardada.getPrecio());
		}
		// Si el último que tocó la oferta fue el CLIENTE, avisamos al VENDEDOR
		else if (ventaGuardada.getRolUltimoModificador() == Rol.CLIENTE) {
			emailService.notificarNuevaOferta(ventaGuardada.getVendedor().getCorreo(),
					ventaGuardada.getCliente().getNombre(), ventaGuardada.getVehiculo().getModelo(),
					ventaGuardada.getPrecio());
		}

		return ventaMapper.toDto(ventaGuardada);
	}

}
