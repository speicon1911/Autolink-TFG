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

    @Transactional
    public List<VentaDTO> findAll() {
        return this.ventaRepository.findAll().stream()
                .map(ventaMapper::toDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public List<VentaDTO> findByVendedor(int idVendedor) {
        List<Venta> ventas = this.ventaRepository.findByVendedor_Id(idVendedor);
        return ventas.stream().map(ventaMapper::toDto).collect(Collectors.toList());
    }

    @Transactional
    public List<VentaDTO> findByCliente(int idCliente) {
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
        Persona vendedorActual = personaRepository.findById(venta.getVendedor().getId())
                .orElseThrow(
                        () -> new VentaNotFoundException("Vendedor no encontrado: " + venta.getVendedor().getId()));
        Persona clienteActual = personaRepository.findById(venta.getCliente().getId())
                .orElseThrow(() -> new VentaNotFoundException("Cliente no encontrado: " + venta.getCliente().getId()));
        Vehiculo vehiculoActual = vehiculoRepository.findById(venta.getVehiculo().getIdVehiculo())
                .orElseThrow(() -> new VehiculoNotFoundException(
                        "Vehículo no encontrado: " + venta.getVehiculo().getIdVehiculo()));

        venta.setVendedor(vendedorActual);
        venta.setCliente(clienteActual);
        venta.setVehiculo(vehiculoActual);

        if (venta.getFecha() == null) {
            venta.setFecha(LocalDate.now());
        }

        // Siempre empezamos en progreso y el primer modificador es el cliente
        venta.setEstadoVenta(EstadoVenta.EN_PROGRESO);
        venta.setRolUltimoModificador(Rol.CLIENTE);

        // El vehículo NO se marca como no disponible aquí (se mantiene en el mercado)
        return ventaMapper.toDto(this.ventaRepository.save(venta));
    }

    @Transactional
    public void anularVenta(int idVenta) {
        Venta venta = this.ventaRepository.findById(idVenta)
                .orElseThrow(() -> new VentaNotFoundException("No es posible encontrar la venta con ID: " + idVenta));

        venta.setEstadoVenta(EstadoVenta.ANULADA);

        // Asegurar que el vehículo esté disponible (por si acaso estaba en otro estado)
        if (venta.getVehiculo() != null) {
            Vehiculo vehiculo = venta.getVehiculo();
            vehiculo.setDisponible(true);
            vehiculoRepository.save(vehiculo);
        }

        this.ventaRepository.save(venta);
    }

    @Transactional
    public void completarVenta(int idVenta) {
        Venta venta = this.ventaRepository.findById(idVenta)
                .orElseThrow(() -> new VentaNotFoundException("Venta no encontrada"));
        
        // 1. Marcar el vehículo como vendido
        Vehiculo vehiculo = venta.getVehiculo();
        vehiculo.setDisponible(false);
        this.vehiculoRepository.save(vehiculo);

        // 2. Marcar esta venta como REALIZADA
        venta.setEstadoVenta(EstadoVenta.REALIZADA);
        this.ventaRepository.save(venta);

        // 3. ANULAR automáticamente todas las demás ofertas EN_PROGRESO para este mismo vehículo
        List<Venta> otrasOfertas = this.ventaRepository.findByVehiculo_IdVehiculo(vehiculo.getIdVehiculo());
        for (Venta v : otrasOfertas) {
            if (v.getIdVenta() != idVenta && v.getEstadoVenta() == EstadoVenta.EN_PROGRESO) {
                v.setEstadoVenta(EstadoVenta.ANULADA);
                this.ventaRepository.save(v);
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

        if (venta.getPrecio() != null && venta.getPrecio() > 0) {
            ventaBD.setPrecio(venta.getPrecio());
        } else {
            throw new VentaExceptions("El precio debe ser un valor positivo");
        }

        if (venta.getRolUltimoModificador() != null) {
            ventaBD.setRolUltimoModificador(venta.getRolUltimoModificador());
        }

        return ventaMapper.toDto(this.ventaRepository.save(ventaBD));
    }
}
