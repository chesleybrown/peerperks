'use strict';

var app = angular.module('ngPeerPerks', [
		'firebase',
		'config.app',
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
	
	.controller('AppCtrl', function ($scope, $firebaseSimpleLogin, $firebase, _, ParticipantService, ActivityService, API_URL) {
		var loginRef = new Firebase(API_URL);
		var auth;
		
		$scope.error = null;
		
		$scope.presence = function() {
			if ($scope.user) {
				var amOnline = new Firebase(API_URL + '/.info/connected');
				var presenceRef = new Firebase(API_URL + '/participants/' + $scope.user.username + '/status');
				
				amOnline.on('value', function(snapshot) {
					if (snapshot.val()) {
						presenceRef.onDisconnect().set('offline');
						presenceRef.set('online');
					}
				});
			}
		};
		
		$scope.participants = ParticipantService;
		$scope.participants.$bind($scope, 'remoteParticipants').then(function() {
			auth = $firebaseSimpleLogin(loginRef);
			auth.$getCurrentUser().then(function(user) {
				$scope.user = user;
				
				if ($scope.user) {
					$scope.presence();
				}
			});
		});
		
		$scope.activities = ActivityService;
		
		$scope.login = function() {
			auth.$login('github', {
				rememberMe: true,
				scope: 'user:email'
			}).then(function(user) {
				$scope.user = user;
				
				$scope.presence();
				
				// successful login
				$scope.error = null;
				
				var participant = _.find($scope.participants, function(participant) {
					return (participant.username === $scope.user.username);
				});
				
				// if not participating yet, then add the user
				if (!participant) {
					$scope.participants.$child($scope.user.username).$set({
						email: ($scope.user.thirdPartyUserData.email) ? $scope.user.thirdPartyUserData.email : $scope.user.thirdPartyUserData.emails[0].email,
						name: ($scope.user.displayName) ? $scope.user.displayName : $scope.user.username,
						username: $scope.user.username,
						points: {
							current: 0,
							allTime: 0,
							redeemed: 0,
							perks: 0
						}
					}).then(function(ref) {
						$scope.presence();
						
						var participant = $firebase(ref);
						participant.$priority = 0;
						participant.$save();
					});
				}
				
				$scope.error = null;
			}, function(error) {
				$scope.error = error.message;
			});
		};
		
		$scope.logout = function() {
			var presenceRef = new Firebase(API_URL + '/participants/' + $scope.user.username + '/status');
			presenceRef.set('offline');
			auth.$logout();
			$scope.user = null;
		};
		
		$scope.cancel = function() {
			$scope.selectReward = false;
			$scope.selectPerk = false;
		};
	})
	
;