angular.module('appRoutes', ['ngRoute'])

.config(function ($routeProvider, $locationProvider) {
    $routeProvider
        .when('/', {
            templateUrl: 'app/views/partials/home.html',
            controller:'MainController',
            controllerAs:'main'
        })
        .when('/login', {
            templateUrl: 'app/views/partials/login.html'
        })
       .when('/signup', {
            templateUrl: 'app/views/partials/signup.html'
        })

    $locationProvider.html5Mode(true);

})