'use strict';

var app = angular.module('ngPeerPerks', [
		'ngRoute',
		'service.participants',
		'directive.reward'
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
		$scope.participants.$bind($scope, 'remoteParticipants');
		
		$scope.addPoint = function(participant) {
			participant.points = participant.points + 1;
		};
	})
	
;