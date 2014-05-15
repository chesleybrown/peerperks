'use strict';

angular
	.module('service.participant', ['firebase'])
	.factory('ParticipantService', ['$firebase', function($firebase) {
		var ref = new Firebase('https://peerperks.firebaseio.com/participants');
		return $firebase(ref);
	}])
;