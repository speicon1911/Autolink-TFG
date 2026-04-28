package com.autolink.services;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.Base64;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import net.coobird.thumbnailator.Thumbnails;

@Service
public class ImgBBService {
	@Value("${imgbb.api.key}")
	private String apiKey;

	@Value("${imgbb.api.url}")
	private String imgBBUrl;

	public String subirAImgBB(MultipartFile archivo) throws IOException {
		RestTemplate restTemplate = new RestTemplate();
		String url = imgBBUrl + "?key=" + apiKey;

		// Redimensionar a máx. 1280px de ancho y comprimir a JPEG al 80%
		// Esto reduce imágenes de 2-3 MB a ~300-500 KB (reducción ~80%)
		ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
		Thumbnails.of(archivo.getInputStream())
				.width(1280)
				.keepAspectRatio(true)
				.outputFormat("jpg")
				.outputQuality(0.80)
				.toOutputStream(outputStream);

		// Convertir la imagen comprimida a base64 para imgBB
		String base64Image = Base64.getEncoder().encodeToString(outputStream.toByteArray());

		// Configurar la petición
		MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
		body.add("image", base64Image);

		// Enviar la petición POST a imgBB
		Map<String, Object> response = restTemplate.postForObject(url, body, Map.class);

		if (response == null || !response.containsKey("data")) {
			throw new IOException("La respuesta de ImgBB fue nula o inválida.");
		}

		Map<String, Object> data = (Map<String, Object>) response.get("data");
		if (data == null || !data.containsKey("url")) {
			throw new IOException("No se encontró la URL de la imagen en la respuesta de ImgBB.");
		}

		return (String) data.get("url");
	}

}
