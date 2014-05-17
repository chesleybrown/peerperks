'use strict';

angular
	.module('service.perk', ['firebase'])
	.factory('PerkService', ['$firebase', function($firebase) {
		var ref = new Firebase('https://peerperks.firebaseio.com/perks');
		return $firebase(ref);
	}])
;