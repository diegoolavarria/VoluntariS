angular.module('starter')
 
.controller('LoginCtrl', function($scope, AuthService, $ionicPopup, $state) {
  $scope.user = {
    name: '',
    password: ''
  };

  $scope.login = function() {
    AuthService.login($scope.user).then(function(msg) {
      var alertPopup = $ionicPopup.alert({
        title: '¡Bienvenido!'
      });
      $state.go('menu.home');
    }, function(errMsg) {
      var alertPopup = $ionicPopup.alert({
        title: 'Error al iniciar sesión',
        template: errMsg
      });
    });
  };
})

.controller('RegisterCtrl', function($scope, $rootScope, $ionicLoading, AuthService, API_ENDPOINT, $ionicPopup, $state, $http) {
  
  $scope.positions = [];

  var latitud = -33.4429046;
  var longitud = -70.6560639;
  var geodireccionuser = "asd";
  var geocoder = new google.maps.Geocoder;
  var infowindow = new google.maps.InfoWindow;
  var Toquen = "";

  var push = new Ionic.Push({
    "debug": true
  });

  push.register(function(token) {
    console.log("My Device token:",token.token);
    push.saveToken(token);  // persist the token in the Ionic Platform
    Toquen = token;
  });


  $scope.$on('mapInitialized', function(event, map) {
    var styles = [
      {
        stylers: [
          { hue: "#00ffe6" },
          { saturation: -20 }
        ]
      },
      {
        featureType: "poi",
        elementType: "labels",
        stylers: [
              { visibility: "off" }
        ]
      }
    ];
    var styledMap = new google.maps.StyledMapType(styles,
    {name: "Styled Map"});

    $scope.map2 = map;
    map.mapTypes.set('map_style', styledMap);
    map.setMapTypeId('map_style');
    var initialLocation = new google.maps.LatLng(latitud, longitud);
    var marker = new google.maps.Marker;
    lastMarker = marker;

    // Function for moving to a selected location
    map.panTo(new google.maps.LatLng(latitud, longitud));

    // Clicking on the Map moves the bouncing red marker
    google.maps.event.addListener(map, 'click', function(e){
      marker = new google.maps.Marker({
        position: e.latLng,
        animation: google.maps.Animation.BOUNCE,
        map: map,
        icon: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png'
      });
      infowindow.open(map, marker);
      // When a new spot is selected, delete the old red bouncing marker
      if(lastMarker){
        lastMarker.setMap(null);
      }

      // Create a new red bouncing marker and move to it
      lastMarker = marker;
      map.panTo(lastMarker.position);

      // Update Broadcasted Variable (lets the panels know to change their lat, long values)
      latitud = marker.getPosition().lat();
      longitud = marker.getPosition().lng();
      $rootScope.$broadcast("clicked");
      var input = String(latitud + "," + longitud);
      var latlngStr = input.split(',', 2);
      var latlng = {lat: parseFloat(latlngStr[0]), lng: parseFloat(latlngStr[1])};
      geocoder.geocode({'location': latlng}, function(results, status) {
        if (status === google.maps.GeocoderStatus.OK) {
          if (results[1]) {
            geodireccionuser = results[1].formatted_address;
            infowindow.setContent(results[1].formatted_address); 
            console.log(geodireccionuser + "ads")
          } else {
            window.alert('No hay resultados');
          }
        } else {
          window.alert('Geocoder failed due to: ' + status);
        }
      });
      console.log(geodireccionuser)
    });
  });

  $scope.centerOnMe= function(){
    $scope.positions = [];
    $ionicLoading.show({
      template: 'Cargando...'
    });
    navigator.geolocation.getCurrentPosition(function(position) {
      var pos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
      latitud = position.coords.latitude;
      longitud = position.coords.longitude;
      $scope.map2.setCenter(pos);
      $ionicLoading.hide();
    });
  };

  $scope.user = {
    name: '',
    password: '',
    nombre1: '',
    nombre2: '',
    apellido1: '',
    apellido2: '',
    rut: '',
    ubicacion: '',
    direccion: '',
    grupo: '',
    ranking: '',
    token: ''
  };
 
  $scope.signup = function() {
    $scope.user.ranking = 0;
    $scope.user.ubicacion = [latitud, longitud];
    $scope.user.direccion = geodireccionuser;
    console.log("TOKEN: ", Toquen);
    $scope.user.token = Toquen.token;
    console.log($scope.user);
    AuthService.register($scope.user).then(function(msg) {
      var alertPopup = $ionicPopup.alert({
        title: '¡Registro exitoso!',
        template: msg
      });
      $state.go('outside.login');
    }, function(errMsg) {
      var alertPopup = $ionicPopup.alert({
        title: 'Error al registrar'
      });
    });
  }; 

  $scope.getGrupos = function() {
    $http.get(API_ENDPOINT.url + '/getGrupos').success(function(data) {
      $scope.grupos = data;
    })
  }; 
})
 
.controller('InsideCtrl', function($scope, $rootScope, $ionicLoading, AuthService, $ionicPopup, API_ENDPOINT, $http, $state, $interval, $location, $anchorScroll) {

  $scope.positions = [];

  $scope.point = {
    name: '',
    ubicacion: '',
    direccion: '',
    descripcion: '',
    cantvoluntarios: '',
    fechainicio: '',
    diasdetrabajo: ''
  };

  $scope.actividad = {
    name: '',
    voluntario: '',
    posactividad: '',
    posvoluntario: '',
    fechainicio: '',
    fechafin: '',
    ranking: '',
    idtarea: '',
    token: ''
  };

  var voluntarioxactividad = "v";
  var tokenxactividad = "t";
  var rankingvol = 100;
  var longitudvol = 0;
  var latitudvol = 0;
  var latitudact = 0;
  var longitudact = 0;
  var rutaimage = "img/progreso/ranking"

  var monthNames = [
  "Enero", "Febrero", "Marzo",
  "Abril", "Mayo", "Junio", "Julio",
  "Agosto", "Septiembre", "Octubre",
  "Noviembre", "Diciembre"
  ];

  var latitud = -33.4429046;
  var longitud = -70.6560639;
  var puntocantmod = 0;
  var latituduser = 0;
  var longituduser = 0;
  var asd = "a";
  var idtareaactividad = "asd";
  var nombreactividad = "asd";
  var geodireccion = "asd";

  $scope.$on('mapInitialized', function(event, map) {
    var infowindow = new google.maps.InfoWindow
    var styles = [
      {
        stylers: [
          { hue: "#00ffe6" },
          { saturation: -20 }
        ]
      },
      {
        featureType: "poi",
        stylers: [
              { visibility: "off" }
        ]
      }
    ];

    var styledMap = new google.maps.StyledMapType(styles,{
      name: "Styled Map"
    });

    $scope.map1 = map;

    map.mapTypes.set('map_style', styledMap);
    map.setMapTypeId('map_style');

    $http.get(API_ENDPOINT.url + '/profileuser').then(function(result) {
      voluntarioxactividad = result.data.msg.name;
      tokenxactividad = result.data.msg.token;
      $http.get(API_ENDPOINT.url + '/getMensaje/' + voluntarioxactividad).success(function(data) {
        if(isEmpty(data)){
          $scope.clickOn='con';
        }
        else{
          latitudact = data[0].posactividad[0];
          longitudact = data[0].posactividad[1];
          $scope.clickOn='con3';
          $scope.centerOnTarea(data[0].posactividad)
        }
      });
    });
    $http.get(API_ENDPOINT.url + '/profilepos').then(function(data) {
        latitudvol = data.data[0];
        longitudvol = data.data[1];
    });
    $http.get(API_ENDPOINT.url + '/profiletodo').then(function(result) {
        rankingvol = result.data.msg;
        rutaimage = rutaimage + rankingvol + ".jpg";
    });

    $http.get(API_ENDPOINT.url + '/getPoints').success(function(data) {
      $scope.points = data;
      for(i=0;i < $scope.points.length;i++){
        addMarker($scope.points[i]);
      }
      function addMarker(data) {
        var MyLatLng = new google.maps.LatLng(data.ubicacion[0], data.ubicacion[1]);
        if (data.tipoactividad == "Reconstrucción"){
          var marker = new google.maps.Marker({
            position: MyLatLng,
        animation: google.maps.Animation.BOUNCE,
            map: map,
            title: data.name,
            icon: 'img/icono1.png'
         });
        }
        else if (data.tipoactividad == "Salud"){
          var marker = new google.maps.Marker({
            position: MyLatLng,
        animation: google.maps.Animation.BOUNCE,
            map: map,
            title: data.name,
            icon: 'img/icono2.png'
         });
        }
        else if (data.tipoactividad == "Limpieza"){
          var marker = new google.maps.Marker({
            position: MyLatLng,
        animation: google.maps.Animation.BOUNCE,
            map: map,
            title: data.name,
            icon: 'img/icono3.png'
         });
        }
        else if (data.tipoactividad == "Recolección"){
          var marker = new google.maps.Marker({
            position: MyLatLng,
        animation: google.maps.Animation.BOUNCE,
            map: map,
            title: data.name,
            icon: 'img/icono4.png'
         });
        }
        else if (data.tipoactividad == "Clasificación"){
          var marker = new google.maps.Marker({
            position: MyLatLng,
        animation: google.maps.Animation.BOUNCE,
            map: map,
            title: data.name,
            icon: 'img/icono5.png'
         });
        }
        else if (data.tipoactividad == "Animales"){
          var marker = new google.maps.Marker({
            position: MyLatLng,
        animation: google.maps.Animation.BOUNCE,
            map: map,
            title: data.name,
            icon: 'img/icono6.png'
         });
        }
        else if (data.tipoactividad == "Apoyo"){//Apoyo
          var marker = new google.maps.Marker({
            position: MyLatLng,
        animation: google.maps.Animation.BOUNCE,
            map: map,
            title: data.name,
            icon: 'img/icono7.png'
         });
        }
        google.maps.event.addListener(marker, 'click', function () {
          if(($scope.clickOn != 'con3')&&(data.llamado == 0)){
            var date =  new Date(data.fechainicio);
            var date2 = new Date(data.fechainicio);
            infowindow.setContent('<div class="siteNotice"><h3 style="text-align:center;">' + data.name + '</h3><p>' + data.descripcion +
                                   '<p>Cantidad de voluntarios necesarios por dia: ' + data.cantvoluntarios + '<p>Inicio: ' + 
                                   date.getDate() + ' de ' + monthNames[date.getMonth()] + ' de ' + date.getFullYear() + 
                                   ' (' + data.diasdetrabajo + ' dias)</div>');
            $scope.fechainiciocal1 = date;
            $scope.fechafincal1 = date2.setDate(date.getDate()+data.diasdetrabajo);
            $scope.clickOn='con1';
            $scope.$apply();
            nombreactividad = data.name;
            idtareaactividad = data._id;
            latitud = data.ubicacion[0];
            longitud = data.ubicacion[1];
            $scope.point = data;
            infowindow.open(map, marker);
          }
        });
        $scope.positions.push(marker);
        
      }
    })
    map.panTo(new google.maps.LatLng(latitud, longitud));
    google.maps.event.addListener(map, 'click', function(e){
      $scope.gotoTop();
      if($scope.clickOn != 'con3'){
        infowindow.close(map);
        $scope.clickOn='con';
        $scope.$apply();
      }
    });
  });

  $scope.getRanking= function(){
    $scope.imageranking = {
      image: rutaimage
    }
  }
  
  $scope.centerOnMe= function(){
    $scope.positions = [];
      
    $ionicLoading.show({
      template: 'Loading...'
    });

    navigator.geolocation.getCurrentPosition(function(position) {
      var pos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
      latitud = position.coords.latitude;
      longitud = position.coords.longitude;
      $scope.map1.setCenter(pos);
      $scope.map1.setZoom(15);
      $ionicLoading.hide();
    });
  };

  $scope.centerOnTarea = function(ubicacion){
    var infowindow = new google.maps.InfoWindow
    $scope.positions = [];
    $ionicLoading.show({
      template: 'Loading...'
    });
    $scope.clickOn='con3';
    if($scope.clickOn == 'con3'){
      var MyLatLng2 = new google.maps.LatLng(ubicacion[0] + 0.00200, ubicacion[1]);
      var marker2 = new google.maps.Marker({
           position: MyLatLng2,
           map: $scope.map1
       });
      marker2.setVisible(false)
      infowindow.setContent('¡Se te esperará en esta ubicación!');
      infowindow.open($scope.map1, marker2);
    }
    navigator.geolocation.getCurrentPosition(function(position) {
      var pos2 = new google.maps.LatLng(ubicacion[0]  + 0.00200, ubicacion[1]);
      $scope.map1.setCenter(pos2);
      $scope.map1.setZoom(15);
      $ionicLoading.hide();
    });
  };

  $scope.crearRuta= function(){
    var end = new google.maps.LatLng(latitudact, longitudact);
    navigator.geolocation.getCurrentPosition(function(position) { 
     var coords = new google.maps.LatLng(position.coords.latitude, position.coords.longitude); //Creates variable for map coordinates
     var directionsService = new google.maps.DirectionsService;
     var directionsDisplay = new google.maps.DirectionsRenderer;
     directionsDisplay.setMap($scope.map1);
     directionsService.route({
        origin: coords,
        destination: end,
        travelMode: google.maps.TravelMode.TRANSIT
      }, function(response, status) {
        if (status === google.maps.DirectionsStatus.OK) {
          directionsDisplay.setDirections(response);
        } else {
          window.alert('Directions request failed due to ' + status);
        }
      });
   });
  };

  $scope.showCon=function(con){
    $scope.clickOn=con;
  }

  $scope.showForm = true;

  $scope.gotoBottom = function() {
      $location.hash('bottom');
      $anchorScroll();
  };

  $scope.gotoTop = function() {
    $location.hash('top');
    $anchorScroll();
  };

  $scope.destroySession = function() {
    AuthService.logout();
  };

  $scope.getUser = function() {
    $http.get(API_ENDPOINT.url + '/profileuser').then(function(result) {
      $scope.profileuser = result.data.msg;
    });
  }; 

  $scope.user = {
    grupo: ''
  }

  $scope.updateGrupo = function() {
    $http.put(API_ENDPOINT.url + '/updateGrupo/' + $scope.user.grupo).success(function(response) {
      var alertPopup = $ionicPopup.alert({
        title: '¡Grupo actualizado!'
      });
      $scope.getUser();
    });
  };

  $scope.datosMensaje = function() {
    $http.get(API_ENDPOINT.url + '/getMensaje/' + voluntarioxactividad).success(function(data) {
      if(isEmpty(data)){
        $scope.clickOn='con';
        $scope.$on('mapInitialized');
      }
      else{
        latitudact = data[0].posactividad[0];
        longitudact = data[0].posactividad[1];
        $scope.datamensajes = data;
        $scope.clickOn='con3';
        var MyLatLng2 = new google.maps.LatLng(latitudact + 0.00200, longitudact);
        var marker2 = new google.maps.Marker({
           position: MyLatLng2,
           map: $scope.map1
        });
        marker2.setVisible(false)
        infowindow.setContent('¡Se te esperará en esta ubicación!');
        infowindow.open($scope.map1, marker2);
        navigator.geolocation.getCurrentPosition(function(position) {
          var pos2 = new google.maps.LatLng(latitudact  + 0.00200, longitudact);
          $scope.map1.setCenter(pos2);
          $scope.map1.setZoom(15);
          $ionicLoading.hide();
        });
      }
    })
  }; 

  $interval( function(){ $scope.datosMensaje(); }, 300000);

  function isEmpty(obj) {

    // null and undefined are "empty"
    if (obj == null) return true;

    // Assume if it has a length property with a non-zero value
    // that that property is correct.
    if (obj.length > 0)    return false;
    if (obj.length === 0)  return true;

    // Otherwise, does it have any properties of its own?
    // Note that this doesn't handle
    // toString and valueOf enumeration bugs in IE < 9
    for (var key in obj) {
        if (hasOwnProperty.call(obj, key)) return false;
    }

    return true;
}
 
  $scope.logout = function() {
    AuthService.logout();
    $state.go('outside.login');
  };

  $scope.getGrupos = function() {
    $http.get(API_ENDPOINT.url + '/getGrupos').success(function(data) {
      $scope.grupos = data;
    })
  }; 

  $scope.newactividad = function() {
    if (latitud == -33.4429046){
    }
    else{
      $scope.actividad.posactividad = [latitud, longitud];
      $scope.actividad.name = nombreactividad;
      $scope.actividad.voluntario = voluntarioxactividad;
      $scope.actividad.token = tokenxactividad;
      $scope.actividad.posvoluntario = [latitudvol, longitudvol]; 
      $scope.actividad.idtarea = idtareaactividad;
      $scope.actividad.ranking = rankingvol;  
      console.log($scope.actividad);
      $http.post(API_ENDPOINT.url + '/addactividad', $scope.actividad).success(function(response) {
        if(response.msg == 'Error, no se pudo procesar postulación'){
          var alertPopup = $ionicPopup.alert({
            title: 'Error en la postulación'
          });
        }
        else{
          var alertPopup = $ionicPopup.alert({
            title: 'Postulación realizada en ' + $scope.actividad.name + '.'
          });
        }
      });
    }
  };  
})
 
.controller('AppCtrl', function($scope, $state, $ionicPopup, AuthService, AUTH_EVENTS) {
  $scope.$on(AUTH_EVENTS.notAuthenticated, function(event) {
    AuthService.logout();
    $state.go('outside.login');
    var alertPopup = $ionicPopup.alert({
      title: 'Se cerró la sesión',
      template: 'Lo sentimos, tendrás que iniciar sesión nuevamente.'
    });
  });
});

  function geocodeLatLng(geocoder, map, infowindow, marker, latitud, longitud) {
    var input = String(latitud + "," + longitud);
    var latlngStr = input.split(',', 2);
    var latlng = {lat: parseFloat(latlngStr[0]), lng: parseFloat(latlngStr[1])};
    var geocoder = new google.maps.Geocoder;
    geocoder.geocode({'location': latlng}, function(results, status) {
      if (status === google.maps.GeocoderStatus.OK) {
        if (results[1]) {
          infowindow.setContent(results[1].formatted_address);
          geodireccionuser = results[1].formatted_address;
          console.log(geodireccionuser)
        } else {
          window.alert('No results found');
        }
      } else {
        window.alert('Geocoder failed due to: ' + status);
      }
    });
  };