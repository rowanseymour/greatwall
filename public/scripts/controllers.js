/**
 * This file is part of Greatwall.
 *
 * Greatwall is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Greatwall is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with Greatwall. If not, see <http://www.gnu.org/licenses/>.
 */

var greatwall = angular.module('greatwall', []);

greatwall.controller('OrderGenerator', ['$scope', '$http', function($scope, $http) {

  $scope.items = [];
  $scope.error = '';
  $scope.loading = false;

  /**
   * Refreshes the order
   */
  $scope.refresh = function() {
    $scope.items = [];
    $scope.error = '';

    if ($scope.people) {
      $scope.loading = true;

      $http.get('/order', { params: { people: $scope.people } })
          .success(function(data) {
            $scope.items = data;
            $scope.loading = false;
          })
          .error(function(data) {
            $scope.error = data.message;
            $scope.loading = false;
          });
    }
  };
}]);