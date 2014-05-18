'use strict';

angular
	.module('service.perk', [
		'firebase',
		'config.app'
	])
	.factory('PerkService', ['$firebase', 'API_URL', function($firebase, API_URL) {
		var ref = new Firebase(API_URL + '/perks');
		return $firebase(ref);
	}])
;