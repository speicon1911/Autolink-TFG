package com.autolink.services;

import java.io.IOException;
import java.util.Base64;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

@Service
public class ImgBBService {
	@Value("${imgbb.api.key}")
	private String apiKey;
	
	public String subirAImgBB(MultipartFile archivo) throws IOException{
		RestTemplate restTemplate = new RestTemplate();
		String url = "https://api.imgbb.com/1/upload?key=" + apiKey;
		
		// convertir la imagen a base64 para imgbb
		String base64Image = Base64.getEncoder().encodeToString(archivo.getBytes());
		
		// se configura la peticion
		MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
		body.add("image", base64Image);
		
		// se envia la peticion POST
		Map<String, Object> response = restTemplate.postForObject(url, body, Map.class);
		
		Map<String, Object> data = (Map<String, Object>) response.get("data");
		return (String) data.get("url");
	}

}
