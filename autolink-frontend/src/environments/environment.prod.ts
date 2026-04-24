export const environment = {
  production: true,
  // Usamos window.location.hostname para adaptarnos a cualquier IP/dominio dinámicamente
  apiUrl: `http://${window.location.hostname}:8080`
};
