'use strict';

angular
	.module('service.activity', ['firebase'])
	.factory('ActivityService', ['$firebase', function($firebase) {
		var ref = new Firebase('https://peerperks.firebaseio.com/activities');
		return $firebase(ref);
	}])
;