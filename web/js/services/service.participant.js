'use strict';

angular
	.module('service.participant', [
		'firebase',
		'config.app'
	])
	.factory('ParticipantService', ['$firebase', 'API_URL', function($firebase, API_URL) {
		var ref = new Firebase(API_URL + '/participants');
		return $firebase(ref);
	}])
;