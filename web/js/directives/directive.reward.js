angular
	.module('directive.reward', [
		'angularjs-gravatardirective'
	])
	.directive('ppReward', function() {
		return {
			restrict: 'E',
			replace: true,
			scope: {
				participants: '='
			},
			template:
				'<div class="row">' +
					'<div ng-repeat="participant in participants" class="col-lg-3 col-md-4 col-xs-6 thumb">' +
						'<a href="#" class="thumbnail text-center">' +
							'<gravatar-image data-gravatar-email="participant.email" data-gravatar-size="64" data-gravatar-default="identicon" data-gravatar-css-class="img-circle"></gravatar-image>' +
							'<h4 class="text-center">{{participant.name}}</h4>' +
						'</a>' +
					'</div>' +
				'</div>',
			controller: function($scope) {
				
			}
		};
	})
;