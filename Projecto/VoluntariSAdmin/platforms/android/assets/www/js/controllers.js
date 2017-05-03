angular.module('starter')
 
.controller('LoginCtrl', function($scope, AuthService, $ionicPopup, $state) {
  $scope.admin = {
    name: '',
    password: ''
  };
 
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
 
.controller('RegisterCtrl', function($scope, AuthService, $ionicPopup, $state) {
  $scope.admin = {
    name: '',
    password: '',
    nombrecompleto: ''
  };
 
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
 
.controller('InsideCtrl', function($scope, $rootScope, $ionicLoading, AuthService, $ionicPopup, API_ENDPOINT, $http, $state) {

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

  var latitud = -33.4429046;
  var longitud = -70.6560639;
  var geodireccion = "a";
  var geocoder = new google.maps.Geocoder;
  var infowindow = new google.maps.InfoWindow;
  var idtarea = "a";
  var cantvoltarea = 0;

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

    $scope.map = map;
    map.mapTypes.set('map_style', styledMap);
    map.setMapTypeId('map_style');

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
        if (data.tipoactividad == "Limpieza"){
          var marker = new google.maps.Marker({
             position: MyLatLng,
             map: map,
             title: data.name,
             icon: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'
         });
        }
        else{
          var marker = new google.maps.Marker({
             position: MyLatLng,
             map: map,
             title: data.name,
             icon: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png'
         });
        }
        google.maps.event.addListener(marker, 'click', function () {
          infowindow.setContent('<h3>' + data.name + '</h3><p>' + data.direccion + '<p>' + data.descripcion +
                                 '<p>Cantidad de voluntarios por día: ' + data.cantvoluntarios + '<p>' +
                                 '<h2><center><a href="#/menu/{{data.name}}" class="subdued">Ver</a></center></h2>');
          $scope.point = data;
          idtarea = data.name;
          infowindow.open(map, marker);
        });
        $scope.positions.push(marker);
      }
    })

    // Function for moving to a selected location
    map.panTo(new google.maps.LatLng(latitud, longitud));

    // Clicking on the Map moves the bouncing red marker
    google.maps.event.addListener(map, 'click', function(e){
      var marker = new google.maps.Marker({
        position: e.latLng,
        animation: google.maps.Animation.BOUNCE,
        map: map,
        icon: '../img/icono1.png'
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
      geocodeLatLng(geocoder, map, infowindow, marker);
    });
  });

  function geocodeLatLng(geocoder, map, infowindow, marker) {
    var input = String(latitud + "," + longitud);
    var latlngStr = input.split(',', 2);
    var latlng = {lat: parseFloat(latlngStr[0]), lng: parseFloat(latlngStr[1])};
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
    $scope.positions = [];
      
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

  $scope.showForm = true;

  $scope.destroySession = function() {
    AuthService.logout();
  };
 
  $scope.getInfoName = function() {
    $http.get(API_ENDPOINT.url + '/adminname').then(function(result) {
      $scope.adminname = result.data.msg;
    });
  };

  $scope.getUser = function() {
    $http.get(API_ENDPOINT.url + '/adminuser').then(function(result) {
      $scope.adminuser = result.data.msg;
    });
  };

  $scope.getPointName = function() {
    $http.get(API_ENDPOINT.url + '/getPointName/' + $scope.point._id).success(function(data) {
      $scope.pointname = data;
    })
  }; 

  $scope.datosTarea = function() {
    $http.get(API_ENDPOINT.url + '/getDatosTarea/' + idtarea).success(function(data) {
      $scope.dataobt = data;
      cantvoltarea = data.length;
      console.log($scope.dataobt);
    })
  }; 

  $scope.comenzar = function() {
    console.log(cantvoltarea);
    if(cantvoltarea == 0){
      console.log("dtfg");
    }
    else{
      $http.get(API_ENDPOINT.url + '/comenzar/' + idtarea).success(function(data) {
        //$scope.dataobt = data;
        //cantvoltarea = data.length;
        //console.log($scope.dataobt);
      })
    }
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
      console.log(response);
    });
  };

  $scope.newmarker = function() {
    $scope.point.ubicacion = [latitud, longitud];
    $scope.point.direccion = geodireccion;
    $http.post(API_ENDPOINT.url + '/addmarker', $scope.point).success(function(response) {
      console.log(response);
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