var DRGAdViewablilityIndicator = ( function() {
	'use strict';

	var adElementStyle = 'position: relative;';
	var adBeforePseudoElementStyle = 'content: ""; display: block; height: 100%; width: 100%; position: absolute; z-index: 5000; top: 0; left: 0; background: green; opacity: 0.65;';
	var adAfterPsuedoElementStyle = 'content: "Ad Viewable"; display: inline-block; position: absolute; z-index: 5001; top: calc( 50% - 10px ); left: calc(50% - 55px );font-size: 16px; font-weight: bold; text-transform: uppercase; color: #fff; text-shadow: -1px -1px #000; font-family: sans-serif;';

	window.googletag = window.googletag || {};
	window.googletag.cmd = window.googletag.cmd || [];

	var setupViewableDetection = function() {
		if ( ! window.googletag || ! window.googletag.pubadsReady ) {
			setTimeout( setupViewableDetection, 20 );
			return;
		}

		var stylesheet = createStylesheet();

		window.googletag.cmd.push( function() {
			window.googletag.pubads().addEventListener( 'impressionViewable', function( viewed ) {
				var slotElementID = viewed.slot.getSlotElementId();
				insertStyles( slotElementID, stylesheet );
			} );
		} );
	};

	var createStylesheet = function() {
		var style = document.createElement( 'style' );

		// Required for Webkit.
		style.appendChild( document.createTextNode( '' ) );

		document.head.appendChild( style );

		return style.sheet;
	};

	var insertStyles = function( elementID, stylesheet ) {
		stylesheet.insertRule(
			'#' + elementID + ' { ' +
			adElementStyle + '}',
			0
		);
		stylesheet.insertRule(
			'#' + elementID + '::before { ' +
			adBeforePseudoElementStyle + '}',
			0
		);
		if ( document.getElementById( elementID ).offsetHeight > 20 ) {
			stylesheet.insertRule(
				'#' + elementID + '::after { ' +
				adAfterPsuedoElementStyle + '}',
				0
			);
		}
	};

	var init = function() {
		setupViewableDetection();
	};

	return {
		init: init
	};

} )();

DRGAdViewablilityIndicator.init();
