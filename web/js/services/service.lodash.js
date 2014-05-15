'use strict';

angular.module('service.lodash', [])
	.factory('_', function() {
		return require('lodash');
	})
;