export const environment = {
  production: true,
  // Para el navegador usamos la IP dinámica. Para SSR en Docker, usamos el nombre del contenedor interno.
  apiUrl: typeof window !== 'undefined' ? `${window.location.protocol}//${window.location.host}` : 'http://backend:8082',
  recaptchaSiteKey: '6LdoKPIsAAAAAIQrzVB1LqZGcJosmyTRmhV4ujGY' // Reemplazar por tu clave de sitio de producción real cuando despliegues
};
