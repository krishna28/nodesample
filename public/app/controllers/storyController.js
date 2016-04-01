angular.module('storyCtrl', ['storyService'])

.controller('storyController', function (Story, socketio) {

    var vm = this;
    vm.processing = true;
    vm.stories = [];
    Story.allStory()
        .success(function (data) {
            console.log(data)
            console.log("inside the allStry");
            vm.stories = data.stories;
        });

    vm.createStory = function () {
        console.log("called inside create story");
        console.log(vm.storyData);
        vm.message = "";
        Story.create(vm.storyData)
            .success(function (data) {
                console.log("data is as follows");
                console.log(data);

                vm.storyData = "";
                vm.mesage = data.message;
                vm.stories.push(data.story);
                console.log(vm.stories);
            });
    };

    socketio.on('story', function (data) {
        vm.stories.push(data);
    })


})