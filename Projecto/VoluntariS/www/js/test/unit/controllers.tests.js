describe("Controller Suite", function () {  
    // Since we could be using $httpBackend in every test, we add a reference here.
    var $scope, $httpBackend, $controller;

    beforeEach(module("starter"));

    // inject the $httpBackend service. Remember, if you want to use the same name
    // ($httpBackend) instead of renaming it, you'll need to wrap the injected service
    // in underscores so there isn't a naming conflict.
    beforeEach(inject(function ($controller, $rootScope, _$httpBackend_) {
        $scope = $rootScope.$new();
        $httpBackend = _$httpBackend_;
        $controller("InsideCtrl", {$scope: $scope});
    }));

    // These get run after each it() block and just make sure that everything happened as expected,
    // and makes sure everything is set up correctly to run for the next test.
    // It's a good idea to make sure this is included anytime you're going to be using the $httpBackend mock service
    afterEach(function () {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });

    describe("should have all the reindeer available on $scope.getUser", function () {
        // Since we're running the $http.get call immediately when the controller loads,
        // we are safe to expect that it will happen. This line below both sets the expectation
        // that the $http.get call will be made, AND responds with an array of data. It's not
        // quite as important WHAT data it responds with, because that's not really the important
        // part of our controller.
        $httpBackend.expect('GET',"http://voluntaris.herokuapp.com/api/profileuser").respond(200, {});

        // The $httpBackend.flush() method basically "runs" the request it intercepted. This has to
        // do with the importance of our tests being synchronous, but it's more important to know
        // that you NEED to run this method if you're ever going to get a passing test.
        $httpBackend.flush();

        // Since the $http.get ran on controller load, it should have set $scope.reindeer to what got returned
        // We told the fake backend to return ["Dasher", "Dancer"], so we can assume that $scope.reindeer
        // contains "Dasher".
        expect($scope.profileuser).toContain("Dasher");
    });
});