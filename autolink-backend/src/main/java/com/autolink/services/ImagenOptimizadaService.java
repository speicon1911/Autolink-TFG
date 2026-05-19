package com.autolink.services;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.Base64;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import net.coobird.thumbnailator.Thumbnails;

@Service
public class ImagenOptimizadaService {
	public String optimizarYconvertirABase64(MultipartFile archivo) throws IOException {
		ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
		// 1. Optimización y Redimensionamiento Extremo
		// Ajustamos la resolución máxima a 800px de ancho manteniendo la relación de
		// aspecto.
		// Reducimos la calidad al 50% para lograr el tamaño óptimo sin pérdida visual
		// detectable.
		Thumbnails.of(archivo.getInputStream())
		.width(700)
		.keepAspectRatio(true)
		.outputFormat("jpg")
		.outputQuality(0.50)
		.toOutputStream(outputStream);
		
		byte[] imageBytes = outputStream.toByteArray();
		
		// 2. Codificación a Base64
		String base64Content = Base64.getEncoder().encodeToString(imageBytes);
		
		// devuelve el formato data URI para html
		return "data:image/jpeg;base64," + base64Content;
		
	}
	// Método específico para fotos de perfil (Ultra ligero)
	public String optimizarAvatarYconvertirABase64(MultipartFile archivo) throws IOException {
	    ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
	    Thumbnails.of(archivo.getInputStream())
	            .width(200) // Redimensionado a 200px máximo para avatares
	            .keepAspectRatio(true)
	            .outputFormat("jpg")
	            .outputQuality(0.55) // Un poco menos de calidad (55%) imperceptible en miniatura
	            .toOutputStream(outputStream);
	    
	    byte[] imageBytes = outputStream.toByteArray();
	    String base64Content = Base64.getEncoder().encodeToString(imageBytes);
	    return "data:image/jpeg;base64," + base64Content;
	}


}
