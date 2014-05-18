'use strict';

angular
	.module('directive.reward', [
		'angularjs-gravatardirective',
		'service.participant',
		'service.reward',
		'service.activity',
		'firebase'
	])
	.directive('ppReward', function($firebase, ParticipantService, RewardService, ActivityService) {
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
							'</a>' +
						'</div>' +
					'</div>' +
					'<h5>2. Select reward</h5>' +
					'<div class="row equal">' +
						'<div ng-repeat="(id, reward) in rewards" class="col-lg-3 col-md-4 col-sm-6 col-xs-12 thumb">' +
							'<a class="reward thumbnail text-center" ng-click="selectReward(id)" ng-class="{active: selected.reward.$id === id}">' +
								'<p class="value">{{reward.points}} <span class="glyphicon glyphicon-thumbs-up"></span></p>' +
								'<p>{{reward.name}}</p>' +
							'</a>' +
						'</div>' +
					'</div>' +
					'<div class="row">' +
						'<div class="col-xs-10">' +
							'<div class="alert alert-info" ng-show="selected.participant && selected.reward"><span class="glyphicon glyphicon-info-sign"></span> <strong>{{selected.participant.name}}</strong> will earn <strong>{{selected.reward.points}} <span class="glyphicon glyphicon-thumbs-up"></span></strong> for <strong>{{selected.reward.name}}</strong></div>' +
						'</div>' +
						'<div class="col-xs-2">' +
							'<button type="button" class="btn btn-lg btn-success pull-right" ng-click="save()" ng-disabled="!selected.participant || !selected.reward">Save</button>' +
						'</div>' +
					'</div>' +
				'</div>',
			controller: function($scope) {
				$scope.selected = {
					participant: null,
					reward: null
				};
				$scope.participants = ParticipantService;
				
				$scope.rewards = RewardService;
				
				$scope.selectUser = function(participantId) {
					$scope.selected.participant = $scope.participants.$child(participantId);
				};
				
				$scope.selectReward = function(rewardId) {
					$scope.selected.reward = $scope.rewards.$child(rewardId);
				};
				
				$scope.save = function() {
					$scope.selected.participant.points.current = $scope.selected.participant.points.current + $scope.selected.reward.points;
					$scope.selected.participant.points.allTime = $scope.selected.participant.points.allTime + $scope.selected.reward.points;
					$scope.selected.participant.$child('rewards').$add($scope.selected.reward);
					$scope.selected.participant.$priority = -Math.abs($scope.selected.participant.points);
					$scope.selected.participant.$save().then(function() {
						ActivityService.$add({
							participant: $scope.selected.participant,
							reward: $scope.selected.reward,
							created: Firebase.ServerValue.TIMESTAMP
						})
						.then(function(ref) {
							var activity = $firebase(ref);
							activity.$priority = -Math.abs(new Date().getTime());
							activity.$save();
							
							// reset
							$scope.selected.participant = null;
							$scope.selected.reward = null;
							
							$scope.enabled = false;
						});
					});
				};
				
				// $scope.rewards.$add({
				// 	name: 'Open a pull request',
				// 	points: 1
				// });
				// $scope.rewards.$add({
				// 	name: 'Have your pull request merged',
				// 	points: 2
				// });
				// $scope.rewards.$add({
				// 	name: 'Pull request merged without any reported issues',
				// 	points: 3
				// });
				// $scope.rewards.$add({
				// 	name: 'Approved someone else\'s pull request',
				// 	points: 1
				// });
				// $scope.rewards.$add({
				// 	name: 'Found issue in someone else\’s pull request',
				// 	points: 2
				// });
				// $scope.rewards.$add({
				// 	name: 'Finished on top this week',
				// 	points: 3
				// });
				// $scope.rewards.$add({
				// 	name: 'Kudos from fellow coder',
				// 	points: 1
				// });
				// $scope.rewards.$add({
				// 	name: 'Helpful commit on someone else\'s pull request',
				// 	points: 1
				// });
				// $scope.rewards.$add({
				// 	name: 'Found jshint errors in pull request',
				// 	points: 1
				// });
				// $scope.rewards.$add({
				// 	name: 'Found broken tests in pull request',
				// 	points: 1
				// });
			}
		};
	})
;