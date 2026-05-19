package com.autolink.services;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import java.util.Map;

@Service
public class RecaptchaService {

    // Extrae la clave secreta de application.properties (mapeada a la variable del .env)
    @Value("${google.recaptcha.secret}")
    private String secretKey;

    private static final String GOOGLE_VERIFY_URL = "https://www.google.com/recaptcha/api/siteverify";

    public boolean validarToken(String tokenRecibido) {
        if (tokenRecibido == null || tokenRecibido.isEmpty()) {
            System.err.println("[reCAPTCHA] El token recibido está vacío o es nulo.");
            return false;
        }

        try {
            RestTemplate restTemplate = new RestTemplate();

            // Configurar las cabeceras HTTP como exige Google (application/x-www-form-urlencoded)
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

            // Formar los parámetros en el cuerpo del formulario POST
            MultiValueMap<String, String> body = new LinkedMultiValueMap<>();
            body.add("secret", secretKey);
            body.add("response", tokenRecibido);

            HttpEntity<MultiValueMap<String, String>> requestEntity = new HttpEntity<>(body, headers);

            // Realizar la llamada HTTP POST enviando los parámetros en el body de la petición
            @SuppressWarnings("unchecked")
            Map<String, Object> response = restTemplate.postForObject(GOOGLE_VERIFY_URL, requestEntity, Map.class);
            
            System.out.println("[reCAPTCHA] Respuesta recibida de Google: " + response);

            if (response != null && response.containsKey("success")) {
                boolean success = (Boolean) response.get("success");
                if (!success) {
                    System.err.println("[reCAPTCHA] Verificación fallida. Códigos de error de Google: " + response.get("error-codes"));
                }
                return success;
            }
        } catch (Exception e) {
            System.err.println("[reCAPTCHA] Excepción al conectar con la API de Google: " + e.getMessage());
            e.printStackTrace();
            return false;
        }
        return false;
    }
}
