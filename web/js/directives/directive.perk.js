'use strict';

angular
	.module('directive.perk', [
		'angularjs-gravatardirective',
		'service.participant',
		'service.perk',
		'service.activity',
		'firebase'
	])
	.directive('ppPerk', function($firebase, ParticipantService, PerkService, ActivityService) {
		return {
			restrict: 'E',
			replace: true,
			scope: {
				enabled: '='
			},
			template:
				'<div>' +
					'<h5>1. Select participant</h5>' +
					'<div class="row equal">' +
						'<div ng-repeat="(id, participant) in participants" class="col-lg-3 col-md-4 col-sm-6 col-xs-12 thumb">' +
							'<a class="thumbnail text-center" ng-click="selectUser(id)" ng-class="{active: selected.participant.$id === id}">' +
								'<gravatar-image data-gravatar-email="participant.email" data-gravatar-size="64" data-gravatar-default="identicon" data-gravatar-css-class="img-circle" data-gravatar-secure="1"></gravatar-image>' +
								'<h4 class="text-center">{{participant.name}}</h4>' +
								'<h5 class="text-center">{{participant.points.current}} <span class="glyphicon glyphicon-thumbs-up"></span></h5>' +
							'</a>' +
						'</div>' +
					'</div>' +
					'<h5>2. Select perk</h5>' +
					'<div class="row equal">' +
						'<div ng-repeat="perk in perks | orderByPriority" class="col-lg-3 col-md-4 col-sm-6 col-xs-12 thumb">' +
							'<a class="perk thumbnail text-center" ng-click="selectPerk(perk.$id)" ng-class="{active: selected.perk.$id === perk.$id}">' +
								'<p class="value">{{perk.points}} <span class="glyphicon glyphicon-thumbs-up"></span></p>' +
								'<p>{{perk.name}}</p>' +
							'</a>' +
						'</div>' +
					'</div>' +
					'<div class="row">' +
						'<div class="col-xs-10">' +
							'<div class="alert alert-info" ng-show="selected.participant && selected.perk && sufficient"><span class="glyphicon glyphicon-info-sign"></span> <strong>{{selected.participant.name}}</strong> will redeem <strong>{{selected.perk.name}}</strong> for <strong>{{selected.perk.points}} <span class="glyphicon glyphicon-thumbs-up"></span></strong></div>' +
							'<div class="alert alert-danger" ng-show="selected.participant && selected.perk && !sufficient"><span class="glyphicon glyphicon-exclamation-sign"></span> <strong>{{selected.participant.name}}</strong> doesn\'t have <strong>{{selected.perk.points}} <span class="glyphicon glyphicon-thumbs-up"></span></strong></div>' +
						'</div>' +
						'<div class="col-xs-2">' +
							'<button type="button" class="btn btn-lg btn-success pull-right" ng-click="save()" ng-disabled="!selected.participant || !selected.perk || !sufficient">Save</button>' +
						'</div>' +
					'</div>' +
				'</div>',
			controller: function($scope) {
				$scope.selected = {
					participant: null,
					perk: null
				};
				$scope.sufficient = true;
				$scope.perks = PerkService;
				$scope.participants = ParticipantService;
				
				$scope.selectUser = function(participantId) {
					$scope.selected.participant = $scope.participants.$child(participantId);
					$scope.verify();
				};
				
				$scope.selectPerk = function(perkId) {
					$scope.selected.perk = $scope.perks.$child(perkId);
					$scope.verify();
				};
				
				$scope.verify = function() {
					if ($scope.selected.participant && $scope.selected.perk) {
						if ($scope.selected.participant.points.current - $scope.selected.perk.points >= 0) {
							$scope.sufficient = true;
						}
						else {
							$scope.sufficient = false;
						}
					}
				};
				
				$scope.save = function() {
					$scope.verify();
					
					if ($scope.sufficient) {
						$scope.selected.participant.points.current = $scope.selected.participant.points.current - $scope.selected.perk.points;
						$scope.selected.participant.points.redeemed = $scope.selected.participant.points.redeemed + $scope.selected.perk.points;
						$scope.selected.participant.points.perks = $scope.selected.participant.points.perks + 1;
						$scope.selected.participant.$child('perks').$add($scope.selected.perk);
						$scope.selected.participant.$priority = -Math.abs($scope.selected.participant.points.current);
						$scope.selected.participant.$save().then(function() {
							ActivityService.$add({
								participant: $scope.selected.participant,
								perk: $scope.selected.perk,
								created: Firebase.ServerValue.TIMESTAMP
							})
							.then(function(ref) {
								var activity = $firebase(ref);
								activity.$priority = -Math.abs(new Date().getTime());
								activity.$save();
								
								// reset
								$scope.selected.participant = null;
								$scope.selected.perk = null;
								
								$scope.enabled = false;
							});
						});
					}
				};
				
				// $scope.perks.$add({
				// 	name: 'Half-hour off early on Friday',
				// 	points: 25
				// }).then(function(ref) {
				// 	var perk = $firebase(ref);
				// 	perk.$priority = 25;
				// 	perk.$save();
				// });
				
				// $scope.perks.$add({
				// 	name: 'Hour off early on Friday',
				// 	points: 50
				// }).then(function(ref) {
				// 	var perk = $firebase(ref);
				// 	perk.$priority = 50;
				// 	perk.$save();
				// });
				
				// $scope.perks.$add({
				// 	name: 'Pick any one task you want to work on',
				// 	points: 30
				// }).then(function(ref) {
				// 	var perk = $firebase(ref);
				// 	perk.$priority = 30;
				// 	perk.$save();
				// });
				
				// $scope.perks.$add({
				// 	name: '$20 Futureshop/Bestbuy Gift card',
				// 	points: 100
				// }).then(function(ref) {
				// 	var perk = $firebase(ref);
				// 	perk.$priority = 100;
				// 	perk.$save();
				// });
				
				// $scope.perks.$add({
				// 	name: '$15 Beverage Package',
				// 	points: 80
				// }).then(function(ref) {
				// 	var perk = $firebase(ref);
				// 	perk.$priority = 80;
				// 	perk.$save();
				// });
			}
		};
	})
;