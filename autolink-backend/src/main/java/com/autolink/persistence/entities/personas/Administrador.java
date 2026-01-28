package com.autolink.persistence.entities.personas;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "administrador")
@Getter
@Setter
@NoArgsConstructor
public class Administrador extends Persona {

    @Column(name = "salario_anual")
    private double salarioAnual;

    @Column(name = "ciudad_asignada")
    private String ciudadAsignada;
}
