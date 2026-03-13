package com.autolink.persistence.entities;

import java.util.List;

import com.autolink.persistence.entities.enums.Rol;
import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "persona")
@Getter
@Setter
@NoArgsConstructor
public class Persona {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_persona")
    private int id;

    @Column(length = 25)
    private String nombre;

    @Column(length = 50)
    private String apellidos;

    private String DNI;

    @Column(unique = true, nullable = false, length = 100)
    private String correo;
    private String password;

    @Column(name = "rol")
    @Enumerated(EnumType.STRING)
    private Rol rol;

    // --- CAMPOS ESPECÍFICOS (Antes en subclases) ---

    // De Vendedor
    private Integer telefono;

    // De Administrador
    @Column(name = "salario_anual")
    private Double salarioAnual;

    @Column(name = "ciudad_asignada")
    private String ciudadAsignada;
    
    @Column(columnDefinition = "boolean default true", nullable = false)
    private Boolean activo = true;
    
    @OneToMany(mappedBy = "vendedor")
    @JsonIgnore // bloquea que aparezcan las ventas realizadas al buscar
    private List<Venta> ventasRealizadas;
    
    @OneToMany(mappedBy = "cliente")
    @JsonIgnore
    private List<Venta> comprasRealizadas;
    
    @OneToMany(mappedBy = "vendedor")
    @JsonIgnore
    private List<Vehiculo> vehiculosEnStock;

 
}
