angular.module('starter')
//Constante que revisa si existe un usuario autenticado.
.constant('AUTH_EVENTS', {
  notAuthenticated: 'auth-not-authenticated'
})
//Constante que conecta a la API.
.constant('API_ENDPOINT', {
  url: 'http://voluntaris.herokuapp.com/api'
  //url: 'http://localhost:8080/api'
});
