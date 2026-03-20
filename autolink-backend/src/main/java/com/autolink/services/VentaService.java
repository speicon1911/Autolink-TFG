package com.autolink.services;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.autolink.persistence.entities.Venta;
import com.autolink.persistence.repositories.VentaRepository;
import com.autolink.services.dto.VentaDTO;
import com.autolink.services.mappers.VentaMapper;
import com.autolink.services.exceptions.VentaExceptions;
import com.autolink.services.exceptions.VentaNotFoundException;

@Service
public class VentaService {

	@Autowired
	private VentaRepository ventaRepository;

	@Autowired
	private VentaMapper ventaMapper;

	public List<VentaDTO> findAll() {
		return this.ventaRepository.findAll().stream()
				.map(ventaMapper::toDto)
				.collect(Collectors.toList());
	}

	public List<VentaDTO> findByVendedor(int idVendedor) {
		List<Venta> ventas = this.ventaRepository.findByVendedor_Id(idVendedor);

		if (ventas.isEmpty()) {
			throw new VentaNotFoundException("No se han encontrado ventas para el vendedor con ID: " + idVendedor);
		}
		return ventas.stream().map(ventaMapper::toDto).collect(Collectors.toList());
	}

	public List<VentaDTO> findByCliente(int idCliente) {
		List<Venta> compras = this.ventaRepository.findByCliente_Id(idCliente);
		if (compras.isEmpty()) {
			throw new VentaNotFoundException("No se han encontrado compras por parte del cliente con ID: " + idCliente);
		}
		return compras.stream().map(ventaMapper::toDto).collect(Collectors.toList());
	}

	public VentaDTO createVenta(Venta venta) {
        if (venta.getVendedor() == null || venta.getCliente() == null) {
            throw new VentaExceptions("La venta debe estar asociada a un vendedor y un cliente");
        }

        if (venta.getFecha() == null) {
            venta.setFecha(LocalDate.now());
        }

        return ventaMapper.toDto(this.ventaRepository.save(venta));
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

		return ventaMapper.toDto(this.ventaRepository.save(ventaBD));
	}
}
