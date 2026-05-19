export const environment = {
  production: true,
  // Para el navegador usamos la IP dinámica. Para SSR en Docker, usamos el nombre del contenedor interno.
  apiUrl: typeof window !== 'undefined' ? `http://${window.location.hostname}:8080` : 'http://backend:8082',
  recaptchaSiteKey: '6LdoKPIsAAAAAIQrzVB1LqZGcJosmyTRmhV4ujGY' // Reemplazar por tu clave de sitio de producción real cuando despliegues
};
