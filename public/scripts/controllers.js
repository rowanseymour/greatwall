
var klablunches = angular.module('klablunches', []);

klablunches.controller('GreatWall', ['$scope', '$http', function($scope, $http) {

	$scope.items = [];
	$scope.error = '';
	$scope.loading = false;

	/**
	 * Refreshes the order
	 */
	$scope.refresh = function() {
		$scope.error = '';
		$scope.loading = true;

		$http.get('/order', { params: { people: $scope.people } })
			.success(function(data) {
				$scope.items = data;
				$scope.loading = false;
			})
			.error(function(data) {
				$scope.error = data.message;
				$scope.items = [];
				$scope.loading = false;
			});
	};
}]);