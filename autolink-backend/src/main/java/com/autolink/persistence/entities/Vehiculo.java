package com.autolink.persistence.entities;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import com.autolink.persistence.entities.enums.CombustibleVehiculo;
import com.autolink.persistence.entities.enums.EtiquetaMedioambiental;
import com.autolink.persistence.entities.enums.EstadoVerificacion;
import com.autolink.persistence.entities.enums.TipoVehiculo;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Table(name = "vehiculo")
@Getter
@Setter
@NoArgsConstructor
@Entity
public class Vehiculo {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "id_vehiculo")
	private int idVehiculo;

	private Integer precio;

	private Integer plazas;

	private Integer potencia;

	private Integer puertas;

	private Integer kilometraje;

	private String color;

	@Column(name = "combustible")
	@Enumerated(EnumType.STRING)
	private CombustibleVehiculo combustible;

	@Column(name = "tipo_vehiculo")
	@Enumerated(EnumType.STRING)
	private TipoVehiculo tipoVehiculo;

	@ManyToOne
	@JoinColumn(name = "id_marca")
	private Marca marca;

	private String modelo;

	@Column(name = "anio_fabricacion")
	private int anioFabricacion;

	private Boolean disponible;

	@Enumerated(EnumType.STRING)
	private EstadoVerificacion verificado;

	@Column(name = "fecha_verificacion")
	private LocalDate fechaVerificacion;

	@ManyToOne
	@JoinColumn(name = "id_vendedor")
	private Persona vendedor;

	@Column(length = 10)
	private String matricula;

	@Column(name = "fecha_matriculacion")
	private LocalDate fechaMatriculacion;

	@Column(name = "vencimiento_itv")
	private LocalDate vencimientoItv;

	@Column(name = "etiqueta_medioambiental")
	@Enumerated(EnumType.STRING)
	private EtiquetaMedioambiental etiquetaMedioambiental;

	@Column(length = 1000)
	private String descripcion;

	private String ciudad;

	@OneToMany(mappedBy = "vehiculo", cascade = CascadeType.ALL, orphanRemoval = true)
	private List<ImagenVehiculo> imagenes = new ArrayList<>();

}
