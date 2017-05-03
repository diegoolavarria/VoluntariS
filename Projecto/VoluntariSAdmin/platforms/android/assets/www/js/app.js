angular.module('starter', ['ionic', 'ngMap'])
 
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
  });
})

.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {

  $ionicConfigProvider.tabs.position('top'); //bottom
 
  $stateProvider
  .state('outside', {
    url: '/outside',
    abstract: true,
    templateUrl: 'templates/outside.html'
  })
  .state('outside.loginadmin', {
    url: '/loginadmin',
    templateUrl: 'templates/loginadmin.html',
    controller: 'LoginCtrl'
  })
  .state('outside.registeradmin', {
    url: '/registeradmin',
    templateUrl: 'templates/registeradmin.html',
    controller: 'RegisterCtrl'
  }) 

  .state('menu', {
    url: '/menu',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'InsideCtrl'
  })

  .state('menu.homeadmin', {
    url: '/homeadmin',
    views: {
      'menuContent': {
        templateUrl: 'templates/homeadmin.html'
      }
    }
  })

  .state('menu.gestion', {
    url: '/gestion',
    views: {
      'menuContent': {
        templateUrl: 'templates/gestion.html'
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
  .state('menu.puntoId', {
    url: "/:puntoId",
    views: {
      'menuContent' :{
        templateUrl: "templates/puntoId.html"
      }
    }
  });
 
  $urlRouterProvider.otherwise('/menu/homeadmin');
})

.controller('HomeTabCtrl', function($scope) {
  $scope.showForm = true;
})

.run(function ($rootScope, $state, AuthService, AUTH_EVENTS) {
  $rootScope.$on('$stateChangeStart', function (event,next, nextParams, fromState) {
    if (!AuthService.isAuthenticated()) {
      console.log(next.name);
      if (next.name !== 'outside.loginadmin' && next.name !== 'outside.registeradmin') {
        event.preventDefault();
        $state.go('outside.loginadmin');
      }
    }
  });
})

.controller("cerrarApp", function($scope)
{
  $scope.exit = function()
  {
    alert(1)
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

.controller('DashboardController', function ($scope, $state, $ionicPlatform, $location, $ionicHistory) {
  $ionicPlatform.registerBackButtonAction(function() {
    if ($location.path() === "/home" || $location.path() === "home") {
      navigator.app.exitApp();
    }
    else {
      $ionicHistory.goBack();
    }
  }, 100);
});