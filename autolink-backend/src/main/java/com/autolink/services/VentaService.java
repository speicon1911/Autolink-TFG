package com.autolink.services;

import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.autolink.persistence.entities.Venta;
import com.autolink.persistence.repositories.VentaRepository;
import com.autolink.services.exceptions.VentaExceptions;
import com.autolink.services.exceptions.VentaNotFoundException;

@Service
public class VentaService {

	@Autowired
	private VentaRepository ventaRepository;

	public List<Venta> findAll() {
		return this.ventaRepository.findAll();
	}

	// obtener ventas de un vendedor
	public List<Venta> findByVendedor(int idVendedor) {
		// Llamar al REPOSITORIO
		List<Venta> ventas = this.ventaRepository.findByVendedor_Id(idVendedor);

		// Si la lista está vacía, lanzamos excepción
		if (ventas.isEmpty()) {
			throw new VentaNotFoundException("No se han encontrado ventas para el vendedor con ID: " + idVendedor);
		}
		return ventas;
	}

	// obtener compras o intentos
	public List<Venta> findByCliente(int idCliente) {
		List<Venta> compras = this.ventaRepository.findByCliente_Id(idCliente);
		if (compras.isEmpty()) {
			throw new VentaNotFoundException("No se han encontrado compras por parte del cliente con ID: " + idCliente);
		}
		return compras;
	}

	// crear 
	public Venta createVenta(Venta venta) {
        // Validamos actores antes de guardar
        if (venta.getVendedor() == null || venta.getCliente() == null) {
            throw new VentaExceptions("La venta debe estar asociada a un vendedor y un cliente");
        }

        // Asignamos fecha de hoy si viene vacía
        if (venta.getFecha() == null) {
            venta.setFecha(LocalDate.now());
        }

        return this.ventaRepository.save(venta);
    }

	// eliminar
    public void deleteVenta(int idVenta) {
        if (!this.ventaRepository.existsById(idVenta)) {
            throw new VentaNotFoundException("No es posible eliminar la venta con ID: " + idVenta);
        }
        this.ventaRepository.deleteById(idVenta);
    }
	
	// editar ventas finales
	public Venta updatePrecioVenta(Venta venta, int idVenta) {
		// 1. Validar IDs
		if (venta.getIdVenta() != idVenta) {
			throw new VentaExceptions(
					String.format("El id introducido en el cuerpo (%d) y el de la ruta (%d) no coinciden",
							venta.getIdVenta(), idVenta));
		}

		// 2. Buscar la venta real en la BD
		// Usamos orElseThrow para obtener la venta o lanzar error si no existe
		Venta ventaBD = this.ventaRepository.findById(idVenta)
				.orElseThrow(() -> new VentaNotFoundException("No es posible encontrar la venta con ID: " + idVenta));

		// 3. Actualizar el precio
		// Aquí es donde usas el getter del objeto 'venta' (el parámetro)
		if (venta.getPrecio() != null && venta.getPrecio() > 0) {
			ventaBD.setPrecio(venta.getPrecio());
		} else {
			throw new VentaExceptions("El precio debe ser un valor positivo");
		}

		// 4. Guardar los cambios
		return this.ventaRepository.save(ventaBD);
	}
}
