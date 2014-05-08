angular
	.module('service.participants', ['firebase'])
	.factory('ParticipantsService', ['$firebase', function($firebase) {
		var ref = new Firebase('https://peerperks.firebaseio.com/participants');
		return $firebase(ref);
	}])
;