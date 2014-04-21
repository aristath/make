/* global jQuery, _ */
var oneApp = oneApp || {}, $oneApp = $oneApp || jQuery(oneApp);

(function (window, $, _, oneApp, $oneApp) {
	'use strict';

	oneApp.TextView = oneApp.SectionView.extend({
		events: function() {
			return _.extend({}, oneApp.SectionView.prototype.events, {
				'change .ttf-one-text-columns' : 'handleColumns'
			});
		},

		handleColumns : function (evt) {
			evt.preventDefault();

			var columns = $(evt.target).val(),
				$stage = $('.ttf-one-text-columns-stage', this.$el);

			$stage.removeClass('ttf-one-text-columns-1 ttf-one-text-columns-2 ttf-one-text-columns-3 ttf-one-text-columns-4');
			$stage.addClass('ttf-one-text-columns-' + parseInt(columns, 10));
		}
	});

	// Makes gallery items sortable
	oneApp.initializeTextColumnSortables = function(view) {
		var $selector;
		view = view || '';

		if (view.$el) {
			$selector = $('.ttf-one-text-columns-stage', view.$el);
		} else {
			$selector = $('.ttf-one-text-columns-stage');
		}

		$selector.sortable({
			handle: '.ttf-one-sortable-handle',
			placeholder: 'sortable-placeholder',
			forcePlaceholderSizeType: true,
			distance: 2,
			tolerance: 'pointer',
			start: function (event, ui) {
				// Set the height of the placeholder to that of the sorted item
				var $item = $(ui.item.get(0)),
					$stage = $item.parents('.ttf-one-text-columns-stage');

				$('.sortable-placeholder', $stage).height($item.height());
				oneApp.disableEditors($item);
			},
			stop: function (event, ui) {
				var $item = $(ui.item.get(0)),
					$stage = $item.parents('.ttf-one-section-body'),
					$orderInput = $('.ttf-one-text-columns-order', $stage),
					i;

				oneApp.setOrder($(this).sortable('toArray', {attribute: 'data-id'}), $orderInput);
				oneApp.enableEditors($item);

				// Label the columns according to the position they are in
				i = 1;
				$('.ttf-one-text-column', $stage).each(function(){
					$(this)
						.removeClass('ttf-one-text-column-position-1 ttf-one-text-column-position-2 ttf-one-text-column-position-3 ttf-one-text-column-position-4')
						.addClass('ttf-one-text-column-position-' + i);
					i++;
				});
			}
		});
	};

	// Initialize the sortables
	$oneApp.on('afterSectionViewAdded', function(evt, view) {
		if ('text' === view.model.get('sectionType')) {
			oneApp.initializeTextColumnSortables(view);
		}
	});

	// Initialize sortables for current columns
	oneApp.initializeTextColumnSortables();
})(window, jQuery, _, oneApp, $oneApp);