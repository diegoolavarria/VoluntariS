angular.module('starter', ['ionic','ionic.service.core', 'ngMap'])
 
.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }

    var push = new Ionic.Push({
      "debug": true
    });
 
    push.register(function(token) {
      console.log("My Device token:",token.token);
      push.saveToken(token);  // persist the token in the Ionic Platform
    });

  });
})

.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {

  $ionicConfigProvider.tabs.position('top');
 
  $stateProvider
  .state('outside', {
    url: '/outside',
    abstract: true,
    templateUrl: 'templates/outside.html'
  })
  .state('outside.login', {
    url: '/login',
    templateUrl: 'templates/login.html',
    controller: 'LoginCtrl'
  })
  .state('outside.register', {
    url: '/register',
    templateUrl: 'templates/register.html',
    controller: 'RegisterCtrl'
  })

  .state('inside', {
    url: '/inside',
    templateUrl: 'templates/inside.html',
    controller: 'InsideCtrl'
  })

  .state('menu', {
    url: '/menu',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'InsideCtrl'
  })

  .state('menu.home', {
    url: '/home',
    views: {
      'menuContent': {
        templateUrl: 'templates/home.html'
      }
    }
  })

  .state('menu.home.misiones', {
    url: '/misiones',
    views: {
      'misiones-tab': {
        templateUrl: 'templates/misiones.html'
      }
    }
  })

  .state('menu.home.mensajes', {
    url: '/mensajes',
    views: {
      'mensajes-tab': {
        templateUrl: 'templates/mensajes.html'
      }
    }
  })
  .state('menu.about', {
    url: '/about',
    views: {
      'menuContent': {
        templateUrl: 'templates/about.html'
      }
    }
  })
  .state('menu.perfil', {
    url: '/perfil',
    views: {
      'menuContent': {
        templateUrl: 'templates/perfil.html'
      }
    }
  })
 //$urlRouterProvider.otherwise('/menu/home');
  $urlRouterProvider.otherwise('/menu/home/misiones');
})

.controller('HomeTabCtrl', function($scope) {
  $scope.showForm = true;
})

.run(function ($rootScope, $state, AuthService, AUTH_EVENTS) {
  $rootScope.$on('$stateChangeStart', function (event,next, nextParams, fromState) {
    if (!AuthService.isAuthenticated()) {
      console.log(next.name);
      if (next.name !== 'outside.login' && next.name !== 'outside.register') {
        event.preventDefault();
        $state.go('outside.login');
      }
    }
  });
})

.controller("cerrarApp", function($scope)
{
  $scope.exit = function()
  {
    //alert(1)
    if(window.navigator.app)
    {
      navigator.app.exitApp();
    }
    else if(window.navigator.device)
    {
      navigator.device.exitApp();
    }
  }
})

/*.controller('DashboardController', function ($scope, $state, $ionicPlatform, $location, $ionicHistory) {
  $ionicPlatform.registerBackButtonAction(function() {
    if (($location.path() === "/menu/home/misiones") || ($location.path() === "/outside/login")) {
      navigator.app.exitApp();
    }
    else {
      $ionicHistory.goBack();
    }
  }, 100);
});*/

.controller('DashboardController', function ($scope, $state, $ionicPlatform, $location, $ionicHistory) {
  $ionicPlatform.registerBackButtonAction(function (event) {
    if($state.current.name=="outside.login" || $state.current.name=="menu.home.misiones"){
      navigator.app.exitApp(); //<-- remove this line to disable the exit
    }
    else {
      navigator.app.backHistory();
    }
  }, 100);
});