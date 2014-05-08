'use strict';

var app = angular.module('ngPeerPerks', [
		'ngRoute',
		'service.participants'
	])
	
	.config(function ($routeProvider, $locationProvider) {
		$locationProvider
			.html5Mode(true)
		;
		
		$routeProvider
			.when('/', {controller: 'AppCtrl', templateUrl: '/app.html'})
			.otherwise({templateUrl: '/404.html'})
		;
	})
	
	.controller('AppCtrl', function ($scope, ParticipantsService) {
		$scope.participants = ParticipantsService;
		$scope.participants.$bind($scope, 'participants');
		// $scope.participants.$add({
		// 	'name': 'Trudel',
		// 	'points': 20
		// });
		
		$scope.addPoint = function(participant) {
			participant.points = participant.points + 1;
		};
	})
	
;