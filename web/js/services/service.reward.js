'use strict';

angular
	.module('service.reward', [
		'firebase',
		'config.app'
	])
	.factory('RewardService', ['$firebase', 'API_URL', function($firebase, API_URL) {
		var ref = new Firebase(API_URL + '/rewards');
		return $firebase(ref);
	}])
;