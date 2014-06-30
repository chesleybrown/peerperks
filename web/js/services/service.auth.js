'use strict';

angular
	.module('service.auth', [
		'firebase',
		'config.app',
		'service.participant',
		'angular-flash.service',
		'service.lodash'
	])
	.factory('AuthService', function(_, $firebase, $firebaseSimpleLogin, ParticipantService, API_URL) {

		var loginRef = new Firebase(API_URL);
		var auth = $firebaseSimpleLogin(loginRef);

		return {
			getCurrentUser: auth.$getCurrentUser,
			sendPasswordResetEmail: auth.$sendPasswordResetEmail,
			login: function(email, password, rememberMe) {
				return auth.$login('password', {
					email: email,
					password: password,
					rememberMe: rememberMe
				});
			},
			signup: function (name, email, password) {
				return auth.$createUser(email, password)
					.then(function(user) {
						authHandler(user.uid, name, email);

						return auth.$login('password', {
							email: email,
							password: password
						});
					});
			},
			githubLogin: function() {
				return auth.$login('github', {
					rememberMe: true,
					scope: 'user:email'
				}).then(function(user) {
					var name, email;

					email = (user.thirdPartyUserData.email) ? user.thirdPartyUserData.email : user.thirdPartyUserData.emails[0].email;
					name = (user.displayName) ? user.displayName : user.username;

					authHandler(user.uid, name, email, user.username);

					return user;
				});
			},
			logout: function() {
				auth.$getCurrentUser().then(function(user) {
					var presenceRef = new Firebase(API_URL + '/participants/' + user.uid + '/status');
					presenceRef.set('offline');
					auth.$logout();
				});
			}
		};

		function authHandler(uid, name, email, username) {
			var participant = _.find(ParticipantService, function(participant) {
				return (participant.email === email || participant.username === username);
			});

			// if not participating yet, then add the user
			if (!participant) {
				ParticipantService.$child(uid).$set({
					email: email,
					name: name,
					username: username,
					points: {
						current: 0,
						allTime: 0,
						redeemed: 0,
						perks: 0
					}
				}).then(function() {
					// make sure logged in user appears on top
					var participantRef = new Firebase(API_URL + '/participants/' + uid);
					var participant = $firebase(participantRef);
					participant.$priority = 0;
					participant.$save();
				});
			}
		}


	});