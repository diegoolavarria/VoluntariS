angular.module('starter')

//Controlador de las funciones de login.
.controller('LoginCtrl', function($scope, AuthService, $ionicPopup, $state) {
  $scope.admin = {
    name: '',
    password: ''
  };
//Función para iniciar sesión.
  $scope.login = function() {
    AuthService.login($scope.admin).then(function(msg) {
      alert("Bienvenido!");
      $state.go('menu.homeadmin');
    }, function(errMsg) {
      var alertPopup = $ionicPopup.alert({
        title: 'Error al iniciar sesión',
        template: errMsg
      });
    });
  };
})
//Controlador de las funciones para crear nuevo admnistrador.
.controller('RegisterCtrl', function($scope, AuthService, $ionicPopup, $state) {
  $scope.admin = {
    name: '',
    password: '',
    nombrecompleto: ''
  };
//Función para tomar los datos del formularío y crear nuevo usuario.
  $scope.signup = function() {
    AuthService.register($scope.admin).then(function(msg) {
      $state.go('outside.loginadmin');
      var alertPopup = $ionicPopup.alert({
        title: 'Register success!',
        template: msg
      });
    }, function(errMsg) {
      var alertPopup = $ionicPopup.alert({
        title: 'Register failed!',
        template: errMsg
      });
    });
  };
})
//Controlador de las funciones de la aplicación una vez que se haya iniciado sesión.
.controller('InsideCtrl', function($scope, $rootScope, $ionicLoading, AuthService, $ionicPopup, API_ENDPOINT, $http, $state, $location, $anchorScroll) {

  $scope.positions = [];

  $scope.point = {
    name: '',
    ubicacion: '',
    direccion: '',
    descripcion: '',
    cantvoluntarios: '',
    nombreadmin: '',
    tipoactividad: '',
    fechainicio: '',
    diasdetrabajo: '',
    llamado: ''
  };

  $scope.fecha = {
    fechacont: ''
  };

  var monthNames = [
    "Enero", "Febrero", "Marzo",
    "Abril", "Mayo", "Junio", "Julio",
    "Agosto", "Septiembre", "Octubre",
    "Noviembre", "Diciembre"
  ];

  $scope.map;
  $scope.clickOn3='con3';
  $scope.clickOn='con3';
  $scope.clickOn2='con3';
  var markers = [];
  var latitud = -33.4429046;
  var longitud = -70.6560639;
  var geodireccion = "";
  var emailadmin = "";
  var idtarea = "";
  var cantvoltarea = 0;
  var date =  new Date();
      $scope.fechainiciocal1 = date;

  $scope.$on('mapInitialized', function(event, map) {
    var infowindow = new google.maps.InfoWindow;
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

    $scope.map = map;

    map.mapTypes.set('map_style', styledMap);
    map.setMapTypeId('map_style');

    $http.get(API_ENDPOINT.url + '/adminuser').then(function(result) {
      emailadmin = result.data.msg.name;
    });

    var initialLocation = new google.maps.LatLng(latitud, longitud);
    var marker = new google.maps.Marker;
    lastMarker = marker;   

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
          if(lastMarker){
            lastMarker.setMap(null);
          }
          var date =  new Date(data.fechainicio);
          var infoguindou = ('<h3>' + data.name + '</h3><p>' + data.descripcion +
                            '<p>Inicio: ' + date.getDate() + ' de ' + monthNames[date.getMonth()] + ' de ' + date.getFullYear() + ' (' + data.diasdetrabajo + ' dias)');
          if (data.nombreadmin == emailadmin){
            infoguindou = infoguindou + ('<h3><center><a href="#/menu/{{data.name}}" class="subdued">Ver</a></center></h3>');
            $scope.clickOn3='con2';
          }
          else{
            $scope.clickOn3='con';
          }
          infowindow.setContent(infoguindou);
          $scope.pointe = data;
          $scope.fecha.fechacont = date.getDate() + ' de ' + monthNames[date.getMonth()] + ' de ' + date.getFullYear()
          $scope.clickOn='con3';
          $scope.clickOn2='con3';
          $scope.$apply();
          idtarea = data._id;
          infowindow.open(map, marker);
          markers.push(marker);
        });
        $scope.positions.push(marker);
      }
    })

    // Function for moving to a selected location
    map.panTo(new google.maps.LatLng(latitud, longitud));

    // Clicking on the Map moves the bouncing red marker
    google.maps.event.addListener(map, 'click', function(e){

      google.maps.event.trigger(map, 'resize');
      $scope.gotoTop();
      infowindow.close(map);
      var marker = new google.maps.Marker({
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
      $scope.fecha.fechacont = "";
      idtarea = "a";
      $scope.clickOn3='con1';
      $scope.clickOn='con3';
      $scope.$apply();
      $rootScope.$broadcast("clicked");
      var geocoder = new google.maps.Geocoder;
      geocodeLatLng(geocoder, map, infowindow, marker);
    });

    $scope.newmarker = function() {
      $scope.point.ubicacion = [latitud, longitud];
      $scope.point.direccion = geodireccion;
      $scope.point.nombreadmin = emailadmin;
      $scope.point.llamado = 0;
      console.log($scope.point);
      $http.post(API_ENDPOINT.url + '/addmarker', $scope.point).success(function(response) {  
        var alertPopup = $ionicPopup.alert({
          title: 'Punto creado'
        });
        $scope.gotoTop();
        console.log(response);
        var MyLatLng = new google.maps.LatLng(latitud, longitud);
        if ($scope.point.tipoactividad == "Reconstrucción"){
          var marker = new google.maps.Marker({
            position: MyLatLng,
            animation: google.maps.Animation.BOUNCE,
            map: map,
            title: $scope.point.name,
            icon: 'img/icono1.png'
         });
        }
        else if ($scope.point.tipoactividad == "Salud"){
          var marker = new google.maps.Marker({
            position: MyLatLng,
            animation: google.maps.Animation.BOUNCE,
            map: map,
            title: $scope.point.name,
            icon: 'img/icono2.png'
         });
        }
        else if ($scope.point.tipoactividad == "Limpieza"){
          var marker = new google.maps.Marker({
            position: MyLatLng,
            animation: google.maps.Animation.BOUNCE,
            map: map,
            title: $scope.point.name,
            icon: 'img/icono3.png'
         });
        }
        else if ($scope.point.tipoactividad == "Recolección"){
          var marker = new google.maps.Marker({
            position: MyLatLng,
            animation: google.maps.Animation.BOUNCE,
            map: map,
            title: $scope.point.name,
            icon: 'img/icono4.png'
         });
        }
        else if ($scope.point.tipoactividad == "Clasificación"){
          var marker = new google.maps.Marker({
            position: MyLatLng,
            animation: google.maps.Animation.BOUNCE,
            map: map,
            title: $scope.point.name,
            icon: 'img/icono5.png'
         });
        }
        else if ($scope.point.tipoactividad == "Animales"){
          var marker = new google.maps.Marker({
            position: MyLatLng,
            animation: google.maps.Animation.BOUNCE,
            map: map,
            title: $scope.point.name,
            icon: 'img/icono6.png'
         });
        }
        else if ($scope.point.tipoactividad == "Apoyo"){//Apoyo
          var marker = new google.maps.Marker({
            position: MyLatLng,
            animation: google.maps.Animation.BOUNCE,
            map: map,
            title: $scope.point.name,
            icon: 'img/icono7.png'
         });
        }
        markers.push(marker);
        setMapOnAll(map);
      });
    };

    $scope.eliminar = function(idpoint) {
      $http.delete(API_ENDPOINT.url + '/deletePoint/' + idtarea).success(function(response) {
        console.log(idtarea);
        var alertPopup = $ionicPopup.alert({
          title: 'Punto eliminado'
        });
        console.log("Eliminado");
      });
      $http.delete(API_ENDPOINT.url + '/deleteActPorId/' + idtarea).success(function(response) {
        console.log("Actividad eliminada");
      });
      setMapOnAll(null);
    }; 

  });

  function setMapOnAll(map) {
    for (var i = 0; i < markers.length; i++) {
      markers[i].setMap(map);
    }
  }

  function geocodeLatLng(geocoder, map, infowindow, marker) {
    var input = String(latitud + "," + longitud);
    var latlngStr = input.split(',', 2);
    var latlng = {lat: parseFloat(latlngStr[0]), lng: parseFloat(latlngStr[1])};
    var geocoder = new google.maps.Geocoder;
    geocoder.geocode({'location': latlng}, function(results, status) {
      if (status === google.maps.GeocoderStatus.OK) {
        if (results[1]) {
          infowindow.setContent(results[1].formatted_address);
          geodireccion = results[1].formatted_address;
          infowindow.open(map, marker);
        } else {
          window.alert('No results found');
        }
      } else {
        window.alert('Geocoder failed due to: ' + status);
      }
    });
  }

  $scope.centerOnMe= function(){
    $ionicLoading.show({
      template: 'Loading...'
    });

    navigator.geolocation.getCurrentPosition(function(position) {
      var pos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
      latitud = position.coords.latitude;
      longitud = position.coords.longitude;
      $scope.map.setCenter(pos);
      $ionicLoading.hide();
    });

  };

  $scope.showCon=function(con){
    $scope.clickOn=con;
  }
  $scope.showCon2=function(con){
    $scope.clickOn2=con;
    console.log($scope.seleccion);
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
    $http.get(API_ENDPOINT.url + '/adminuser').then(function(result) {
      $scope.adminuser = result.data.msg;
      console.log($scope.adminuser)
    });
  };

  $scope.getPointName = function() {
    $http.get(API_ENDPOINT.url + '/getPointName/' + idtarea).success(function(data) {
      $scope.pointname = data;
    })
  }; 

  $scope.getGrupos = function() {
    $http.get(API_ENDPOINT.url + '/getGrupos').success(function(data) {
      $scope.grupos = data;
    })
  }; 

  $scope.getPoints = function() {
    $http.get(API_ENDPOINT.url + '/getPoints').success(function(data) {
      $scope.points = data;
    })
  }; 

  $scope.seleccion = {};

  $scope.Finalizar = function() {
    var variables = [];
    angular.forEach($scope.seleccion, function (item, idx) {
    if (item)
      variables.push(idx);
    });
    for(i=0;i<variables.length;i++){
      $http.delete(API_ENDPOINT.url + '/deleteMensaje/' + variables[i]).success(function(response) {
        console.log("Mensaje eliminado");
      });
      $http.delete(API_ENDPOINT.url + '/deleteActividad/' + variables[i]).success(function(response) {
        console.log("Actividad eliminada");
      });
      $http.put(API_ENDPOINT.url + '/updateRanking/' + variables[i]).success(function(response) {
        console.log("Ranking subido");
      });
      $scope.clickOn2='con4';
    }
  }; 

  $scope.datosTarea = function() {
    $http.get(API_ENDPOINT.url + '/getDatosTarea/' + idtarea).success(function(data) {
      $scope.dataobts = data;
      cantvoltarea = data.length;
      $http.get(API_ENDPOINT.url + '/getMensaje/' + $scope.dataobts[0].voluntario).success(function(data) {
        if(isEmpty(data)){
          $scope.clickOn2='con3';
        }
        else{
          $scope.clickOn2='con1';
        }
      })
    });
  }; 

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

  $scope.comenzar = function(con) {
    if(cantvoltarea == 0){
    }
    else{
      $http.get(API_ENDPOINT.url + '/comenzar/' + idtarea).success(function(response) {
        enviarcorreo();
        $scope.clickOn2=con;
      });
      $http.put(API_ENDPOINT.url + '/updatePoint/' + idtarea).success(function(response) {
        console.log("Punto listo");
      });
    }
  };

  function enviarcorreo() {
    $http.get(API_ENDPOINT.url + '/enviarcorreo/').success(function(response) {
      console.log(response);
    }); 
  };

  $scope.logout = function() {
    AuthService.logout();
    $state.go('outside.loginadmin');
  };

  $scope.grupo = {
    name: ''
  };

  $scope.newgroup = function() {
    $http.post(API_ENDPOINT.url + '/addgroup', $scope.grupo).success(function(response) {
      var alertPopup = $ionicPopup.alert({
          title: 'Grupo creado'
        });
      $scope.getGrupos();
    });
  };

  $scope.deleteGroup = function(gruponame) {
    console.log(gruponame);
    $http.delete(API_ENDPOINT.url + '/deleteGrupo/' + gruponame).success(function(response) {
        var alertPopup = $ionicPopup.alert({
          title: 'Grupo eliminado'
        });
        console.log("Grupo eliminado");
        $scope.getGrupos();
      });
  };
})
 
.controller('AppCtrl', function($scope, $state, $ionicPopup, AuthService, AUTH_EVENTS) {
  $scope.$on(AUTH_EVENTS.notAuthenticated, function(event) {
    AuthService.logout();
    $state.go('outside.loginadmin');
    var alertPopup = $ionicPopup.alert({
      title: 'Session Lost!',
      template: 'Sorry, You have to login again.'
    });
  });
});