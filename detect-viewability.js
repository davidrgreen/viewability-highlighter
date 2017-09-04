var DRGAdViewablilityIndicator = ( function() {
	'use strict';

	var adElementStyle = 'position: relative;';
	var adBeforePseudoElementStyle = 'content: ""; display: block; height: 100%; width: 100%; position: absolute; z-index: 5000; top: 0; left: 0; background: green; opacity: 0.65;';
	var adAfterPsuedoElementStyle = 'content: "Ad Viewable"; display: inline-block; position: absolute; z-index: 5001; top: calc( 50% - 10px ); left: calc(50% - 55px );font-size: 16px; font-weight: bold; text-transform: uppercase; color: #fff; text-shadow: -1px -1px #000; font-family: sans-serif;';
	var enableAttempts = 0,
		maxAttempts = 500,
		sheet;

	window.googletag = window.googletag || {};
	window.googletag.cmd = window.googletag.cmd || [];

	var setupViewableDetection = function() {
		if ( ! window.googletag || ! window.googletag.pubadsReady ) {
			enableAttempts += 1;
			if ( enableAttempts <= maxAttempts ) {
				setTimeout( setupViewableDetection, 20 );
				return;
			}
		}

		sheet = createStylesheet();

		googletag.cmd.push( function() {
			googletag.pubads().addEventListener(
				'impressionViewable',
				function( viewed ) {
					var slotElementID = viewed.slot.getSlotElementId();
					console.log( slotElementID + ' is viewable' );
					insertStyles( slotElementID );
				}
			);
			googletag.companionAds().addEventListener(
				'impressionViewable',
				function( viewed ) {
					var slotElementID = viewed.slot.getSlotElementId();
					console.log( slotElementID + ' is viewable' );
					insertStyles( slotElementID );
				}
			);
			googletag.content().addEventListener(
				'impressionViewable',
				function( viewed ) {
					var slotElementID = viewed.slot.getSlotElementId();
					console.log( slotElementID + ' is viewable' );
					insertStyles( slotElementID );
				}
			);
		} );
	};

	var createStylesheet = function() {
		var style = document.createElement( 'style' );

		// Required for Webkit.
		style.appendChild( document.createTextNode( '' ) );

		document.head.appendChild( style );

		return style.sheet;
	};

	var insertStyles = function( elementID ) {
		getSheet().insertRule(
			'#' + elementID + ' { ' +
			adElementStyle + '}'
		);
		getSheet().insertRule(
			'#' + elementID + '::before { ' +
			adBeforePseudoElementStyle + '}'
		);
		if ( document.getElementById( elementID ).offsetHeight > 20 ) {
			getSheet().insertRule(
				'#' + elementID + '::after { ' +
				adAfterPsuedoElementStyle + '}'
			);
		}
	};

	var init = function() {
		setupViewableDetection();
	};

	var getSheet = function() {
		return sheet;
	};

	return {
		init: init
	};

} )();

DRGAdViewablilityIndicator.init();
