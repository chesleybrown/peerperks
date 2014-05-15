'use strict';

var app = angular.module('ngPeerPerks', [
		'ngRoute',
		'service.participant',
		'service.activity',
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
	
	.controller('AppCtrl', function ($scope, ParticipantService, ActivityService) {
		$scope.participants = ParticipantService;
		$scope.participants.$bind($scope, 'remoteParticipants');
		
		$scope.activities = ActivityService;
	})
	
;