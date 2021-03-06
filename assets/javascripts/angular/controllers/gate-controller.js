angular.module('unfiltered')
    .controller('GateController', [
        '$location', '$scope', '$rootScope', '$window',
        function ($location, $scope, $rootScope, $window) {

            $scope.$on('$viewContentLoaded', function (event) {
                $window.ga('send', 'pageview', { page: $location.path() });
            });

            this.months = [];
            this.days = [];
            this.years = [];
            this.date = {};
            this.legalDate = moment().subtract('years', 21);

            $rootScope.oldEnough = $("meta[name='old_enough']").attr('content') === "true";

            $rootScope.userInfo = {};

            // Populate date arrays
            for (var i = 1; i <= 12; i += 1) {
                this.months.push(i);
            }
            for (var i = 1; i <= 31; i += 1) {
                this.days.push(i);
            }
            for (var i = moment().year(); i > moment().subtract('years', 120).year(); i -= 1) {
                this.years.push(i);
            }

            $rootScope.months = this.months;
            $rootScope.days = this.days;
            $rootScope.years = this.years;

            // create a date object from inputs
            this.createValidDate = function () {
                // create date for mobile
                if (typeof $scope.ageGateForm.date !== 'undefined') {
                    this.date = moment($scope.ageGateForm.date);
                    $rootScope.userInfo.birthday = this.date;
                    return true;
                }
                // create date for desktop
                if (typeof $scope.ageGateForm.year === 'number'
                    && typeof $scope.ageGateForm.month === 'number'
                    && typeof $scope.ageGateForm.day === 'number') {
                    this.date = moment([parseInt($scope.ageGateForm.year),
                                        parseInt($scope.ageGateForm.month)-1,
                                        parseInt($scope.ageGateForm.day)]);
                    $rootScope.userInfo.birthday = this.date;
                    return this.date.isValid();
                }
                // if already logged into Facebook, able to bypass age-gate
                if($rootScope.oldEnough) {
                    this.date = moment().subtract('years', 23); // fake
                    return true;
                }
                return false;
            }

            // check if date of birth is legal
            this.isLegalDate = function () {
                if (this.createValidDate()) {
                    return this.date.isBefore(this.legalDate);
                }
                return false;
            }

            // Leave the age gate
            this.leaveAgeGate = function () {
                if (this.isLegalDate() && $scope.ageGateForm.terms === true) {
                    $rootScope.oldEnough = true;
                    $location.path('/journey');
                }
            }
        }]);
