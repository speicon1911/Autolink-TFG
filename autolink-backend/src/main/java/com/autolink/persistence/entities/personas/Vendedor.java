package com.autolink.persistence.entities.personas;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "vendedor")
@Getter
@Setter
@NoArgsConstructor
public class Vendedor extends Persona {
    private int telefono;
}
