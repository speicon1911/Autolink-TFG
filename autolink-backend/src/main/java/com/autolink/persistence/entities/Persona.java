package com.autolink.persistence.entities;

import com.autolink.persistence.entities.enums.TipoUsuario;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
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

    private String correo;
    private String password;

    @Column(name = "tipo_usuario")
    @Enumerated(EnumType.STRING)
    private TipoUsuario tipoUsuario;

    // --- CAMPOS ESPECÍFICOS (Antes en subclases) ---

    // De Vendedor
    private Integer telefono;

    // De Administrador
    @Column(name = "salario_anual")
    private Double salarioAnual;

    @Column(name = "ciudad_asignada")
    private String ciudadAsignada;

 
}
