(function() {
    "use strict";

    describe("NavController Unit:Test", function() {
        //add app module
        beforeEach(module("app"));

        //add controller service need to inject controller to test
        var $controller;
        beforeEach(inject(function(_$controller_){
            $controller = _$controller_;
        }));

        describe("NavController.scope", function(){
            var $scope;
            var nav;

            // instantiate scope and pass it to controller
            beforeEach(function() {
                $scope = {};
                nav = $controller("NavController", {$scope: $scope});
            });

            it("should verify that nav.displayLoggedIn is false", function() {
                expect(nav.displayLoggedIn).toEqual(false);
            });
            it("should verify that nav.displaySignUp is false", function() {
                expect(nav.displaySignUp).toEqual(false);
            });

            describe("NavController methods", function () {

                it("should verify that calling toggleLoggedIn reverses nav.displayLoggedIn", function() {
                    var oldVal = nav.displayLoggedIn;
                    nav.toggleLoggedIn();
                    expect(nav.displayLoggedIn).toEqual(!oldVal);
                });
                it("should verify that calling toggleSignUp reverses nav.displaySignUp", function() {
                    var oldVal = nav.displaySignUp;
                    nav.toggleSignUp();
                    expect(nav.displaySignUp).toEqual(!oldVal);
                });
                it("should verify that nav.isAuthenticated is present", function(){
                    expect(nav.isAuthenticated).toBeDefined();
                });
                xit("should  verify that nav.isAuthenticated is returns boolean", function(){
                    // needs to import $auth Service to call this.
                    expect(nav.isAuthenticated).toBeDefined();
                });
            });
            
        });
    });
})();