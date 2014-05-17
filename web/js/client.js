'use strict';

var app = angular.module('ngPeerPerks', [
		'ngRoute',
		'service.lodash',
		'service.participant',
		'service.activity',
		'directive.reward',
		'directive.perk'
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
	
	.controller('AppCtrl', function ($scope, _, ParticipantService, ActivityService) {
		$scope.error = null;
		$scope.participants = ParticipantService;
		$scope.participants.$bind($scope, 'remoteParticipants');
		
		var loginRef = new Firebase('https://peerperks.firebaseio.com');
		var auth = new FirebaseSimpleLogin(loginRef, function(error, user) {
			$scope.user = user;
			
			if (error){
				$scope.error = error.message;
			}
			else if (user) {
				// successful login
				$scope.error = null;
				var participant = _.find($scope.participants, function(participant) {
					return (participant.username === $scope.user.username);
				});
				
				// if not participating yet, then add the user
				if (!participant) {
					$scope.participants.$add({
						email: $scope.user.thirdPartyUserData.email,
						name: $scope.user.displayName,
						username: $scope.user.username,
						points: 0
					});
				}
			}
			else {
				// user is logged out
				$scope.error = null;
			}
			
			$scope.$digest();
		});
		
		$scope.activities = ActivityService;
		
		$scope.login = function() {
			auth.login('github', {
				rememberMe: true,
				scope: 'user:email'
			});
		};
		
		$scope.logout = function() {
			auth.logout();
		};
		
		$scope.cancel = function() {
			$scope.selectReward = false;
			$scope.selectPerk = false;
		};
	})
	
;