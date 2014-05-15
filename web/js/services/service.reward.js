'use strict';

angular
	.module('service.reward', ['firebase'])
	.factory('RewardService', ['$firebase', function($firebase) {
		var ref = new Firebase('https://peerperks.firebaseio.com/rewards');
		return $firebase(ref);
	}])
;