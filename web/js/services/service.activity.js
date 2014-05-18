'use strict';

angular
	.module('service.activity', [
		'firebase',
		'config.app'
	])
	.factory('ActivityService', ['$firebase', 'API_URL', function($firebase, API_URL) {
		var ref = new Firebase(API_URL + '/activities');
		return $firebase(ref);
	}])
;