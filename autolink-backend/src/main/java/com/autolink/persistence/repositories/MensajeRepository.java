package com.autolink.persistence.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.autolink.persistence.entities.Mensaje;

@Repository
public interface MensajeRepository extends JpaRepository<Mensaje, Integer> {

	@Query("SELECT m FROM Mensaje m WHERE " + "(m.remitente.id = :user1 AND m.destinatario.id = :user2) OR "
			+ "(m.remitente.id = :user2 AND m.destinatario.id = :user1) " + "ORDER BY m.fechaEnvio ASC")
	List<Mensaje> findConversacion(@Param("user1") Integer user1, @Param("user2") Integer user2);

	@Query("SELECT m FROM Mensaje m WHERE m.destinatario.id = :userId AND m.leido = false")
	List<Mensaje> findMensajesNoLeidos(@Param("userId") Integer userId);

	@Query("SELECT DISTINCT p FROM Persona p WHERE p.id IN ("
			+ "SELECT m.remitente.id FROM Mensaje m WHERE m.destinatario.id = :userId UNION "
			+ "SELECT m.destinatario.id FROM Mensaje m WHERE m.remitente.id = :userId)")
	List<com.autolink.persistence.entities.Persona> findContactos(@Param("userId") Integer userId);

	@Query("SELECT COUNT(m) FROM Mensaje m WHERE m.destinatario.id = :userId AND m.remitente.id = :remitenteId AND m.leido = false")
	long countUnreadFromSpecificUser(@Param("userId") Integer userId, @Param("remitenteId") Integer remitenteId);

	@Query("SELECT COUNT(m) FROM Mensaje m WHERE m.destinatario.id = :userId AND m.leido = false")
	long countTotalUnread(@Param("userId") Integer userId);
}
