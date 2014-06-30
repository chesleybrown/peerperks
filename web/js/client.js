'use strict';

var app = angular.module('ngPeerPerks', [
		'firebase',
		'config.app',
		'ngRoute',
		'service.lodash',
		'service.auth',
		'service.participant',
		'service.activity',
		'directive.reward',
		'directive.perk',
		'angular-flash.service',
		'angular-flash.flash-alert-directive'
	])
	
	.config(function ($routeProvider, $locationProvider) {
		$locationProvider
			.html5Mode(true)
		;
		
		$routeProvider
			.when('/login', {controller: 'LoginCtrl', templateUrl: '/login.html'})
			.when('/', {controller: 'AppCtrl', templateUrl: '/app.html'})
			.otherwise({templateUrl: '/404.html'})
		;
	})

	.controller('LoginCtrl', function($scope, AuthService, ParticipantService, flash, $location) {
		$scope.showform = 'login';

		$scope.loginform = {};
		$scope.signupform = {};

		$scope.login = function() {
			AuthService.login(
				$scope.loginform.email,
				$scope.loginform.password,
				$scope.loginform.rememberme
			).then(function(user) {
				flash.success = 'Welcome back, ' + ParticipantService.$child(user.uid).name + '!';
				$location.path('/');
			}, function(error) {
				$scope.loginform.errordetail = error.message.replace(/FirebaseSimpleLogin\: /g, '');
			});
		};

		$scope.signup = function() {
			AuthService.signup(
				$scope.signupform.name,
				$scope.signupform.email,
				$scope.signupform.password
			).then(function(user) {
				flash.success = 'Welcome to PeerPerks, ' + $scope.signupform.name + '. Thank you for signing up.';
				$location.path('/');
			}, function(error) {
				$scope.signupform.errordetail = error.message.replace(/FirebaseSimpleLogin\: /g, '');
			});
		};

		$scope.githubLogin = function() {
			AuthService.githubLogin()
				.then(function(user) {
					flash.success = 'Welcome back, ' + ParticipantService.$child(user.uid).name + '!';
					$location.path('/');
				}, function(error) {
					flash.error = error.message.replace(/FirebaseSimpleLogin\: /g, '');
				});
		};

		$scope.forgotPassword = function() {
			AuthService.sendPasswordResetEmail($scope.forgotpasswordform.email)
				.then(function() {
					flash.success = 'We have sent a link to your email that you can use to reset your password.';
				}, function(error) {
					flash.error = error.message.replace(/FirebaseSimpleLogin\: /g, '');
				});
		}

	})

	.controller('AppCtrl', function ($scope, AuthService, $firebase, _, ParticipantService, ActivityService, API_URL) {
		$scope.error = null;
		
		$scope.participants = ParticipantService;
		$scope.participants.$bind($scope, 'remoteParticipants').then(function() {
			AuthService.getCurrentUser().then(function(user) {
				$scope.user = user;
				
				if ($scope.user) {
					$scope.presence();
				}
			});
		});

		$scope.presence = function() {
			if ($scope.user) {
				var amOnline = new Firebase(API_URL + '/.info/connected');
				var presenceRef = new Firebase(API_URL + '/participants/' + $scope.user.uid + '/status');

				amOnline.on('value', function(snapshot) {
					if (snapshot.val()) {
						presenceRef.onDisconnect().set('offline');
						presenceRef.set('online');
					}
				});
			}
		};
		
		$scope.activities = ActivityService;
		
		$scope.logout = function() {
			AuthService.logout();
			$scope.user = null;
		};
		
		$scope.cancel = function() {
			$scope.selectReward = false;
			$scope.selectPerk = false;
		};
	})
	
;