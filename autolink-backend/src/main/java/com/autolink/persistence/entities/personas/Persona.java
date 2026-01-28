package com.autolink.persistence.entities.personas;

import java.util.List;

import com.autolink.persistence.entities.Mensaje;
import com.autolink.persistence.entities.enums.TipoUsuario;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
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

    @Column(columnDefinition = "CHAR(9)", unique = true, nullable = false)
    private String DNI;

    @Column(length = 100, unique = true, nullable = false)
    private String correo;
    @Column(length = 100, nullable = false)
    private String password;

    @Column(name = "tipo_usuario")
    private TipoUsuario tipoUsuario;

    // --- RELACIONES ---

    // Relación 1:N (Una persona envía muchos mensajes)
    // "mappedBy" apunta al nombre del atributo en la clase Mensaje
    @OneToMany(mappedBy = "remitente", cascade = CascadeType.ALL)
    private List<Mensaje> mensajesEnviados;

    // Relación 1:N (Una persona recibe muchos mensajes)
    @OneToMany(mappedBy = "destinatario", cascade = CascadeType.ALL)
    private List<Mensaje> mensajesRecibidos;

}
