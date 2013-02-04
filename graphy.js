(function(window, document, $) {
	'use strict';
	
	
	$.fn.extend({
		graphy: function (customParams) {
			var defaults;
			var core;
			var options;
			var pieElements;
			var iter;
			var deg;
			var percent;
			var tempValue;
			
			defaults = {
				valueDataset: 'data-value',
				startDataset: 'data-start',
				titleDataset: 'data-title',
				colors: ['#fd795b', '#bcf1ed', '#fdedd0', '#b76eb8']
			};
			
			options  = $.extend({}, defaults, customParams);
			
			pieElements = this.children('[' + options.valueDataset + ']');
			iter = 0;
			
			core = {
				fullValue: 0,
				dataValues: [],
				currentColorIndex: 0,
				ieMatrixCount: function (deg) {
					
				  // use parseFloat twice to kill exponential numbers and avoid things like 0.00000000
				  var rad = deg * (Math.PI/180),
							costheta = parseFloat(parseFloat(Math.cos(rad)).toFixed(8)),
				  		sintheta = parseFloat(parseFloat(Math.sin(rad)).toFixed(8));
						
					// collect all of the values  in our matrix
			    var a = costheta,
			        b = sintheta,
			        c = -sintheta,
			        d = costheta,
			        tx = 0,
			        ty = 0;
					
					return 'progid:DXImageTransform.Microsoft.Matrix(M11=' + a + ', M12=' + c + ', M21=' + b + ', M22=' + d + ', sizingMethod=\'auto expand\')';		

				},
				dataStartStyles: function (value) {
					$(this).css({
						'-moz-transform': 'rotate(' + value + 'deg)', /* Firefox */
						'-ms-transform': 'rotate(' + value + 'deg)', /* IE */
						'-webkit-transform': 'rotate(' + value + 'deg)', /* Safari and Chrome */
						'-o-transform': 'rotate(' + value + 'deg)', /* Opera */
						'transform': 'rotate(' + value + 'deg)',
						'-ms-filter': core.ieMatrixCount(value)
					});
					
					// TODO: add here fixes for IE 7/8
				},
				dataValueStyles: function (value) {
					value = value + 1;
					if(value > 360) { value = 360 };
					
					$(this).children('.before').css({
						'-moz-transform': 'rotate(' + value + 'deg)', /* Firefox */
						'-ms-transform': 'rotate(' + value + 'deg)', /* IE */
						'-webkit-transform': 'rotate(' + value + 'deg)', /* Safari and Chrome */
						'-o-transform': 'rotate(' + value + 'deg)', /* Opera */
						'transform': 'rotate(' + value + 'deg)',
						//'-ms-filter': core.ieMatrixCount(value)
						'-ms-filter': 'progid:DXImageTransform.Microsoft.Matrix()'
					});
				},
				dataAppendColors: function () {
					if(core.currentColorIndex === options.colors.length) {
						core.currentColorIndex = 0;
					}
					$(this).children().css({
						'background-color': options.colors[core.currentColorIndex]
					});

					core.currentColorIndex++;
				},
				countFullValue: function () {
					pieElements.each(function (index) {		
						core.fullValue += ~~$(this).attr(options.valueDataset);
					});
				},
				createElements: function () {
					$(this).append('<div class="before">');
					$(this).append('<div class="after">');
				}
			};
			
			core.countFullValue();
			
			pieElements.each(function (index) {
				tempValue = (~~$(this).attr(options.valueDataset) / core.fullValue);
				deg = tempValue * 360;
				percent = tempValue * 100;
				console.log('value: ' + tempValue, 'deg: ' + deg, 'percent: ' + percent);
				core.createElements.call(this);
				core.dataAppendColors.call(this);
				core.dataStartStyles.call(this, iter);
				core.dataValueStyles.call(this, deg);
				
				if(percent>50) {
					$(this).addClass('big');
				}
				iter += deg;
			});
			
		}
	});
})(window, document, jQuery);