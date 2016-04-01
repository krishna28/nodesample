console.log("called from index");
angular.module('userstory', ['appRoutes', 'authService', 'userService', 'mainCtrl', 'userCtrl', 'storyService', 'storyCtrl'])
    .config(function ($httpProvider) {

        $httpProvider.interceptors.push('AuthInterceptor');

    })