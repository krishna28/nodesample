angular.module('userCtrl',['userService'])

.controller('userController',function(User){
    
    var vm = this;
    
    vm.processing = true;
    
    User.all()
       .success(function(data){
           vm.users = data;
       });
       
    
})
.controller('userCreateController',function(User,$location,$window){
    
    var vm = this;
    
    vm.signupUser = function(){
        
        vm.message = "";
        
        User.create(vm.userData)
            .then(function(result){
                
            vm.userData = {};
            vm.message = result.data.message;
            $window.localStorage.setItem('token',result.data.token);
            $location.path('/');
            });
  
    };

    
});