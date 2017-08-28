/**
 * TODO:
 * - use https://davidwalsh.name/add-rules-stylesheets to ensure we don't insert this into a print stylesheet
 */


var DRGAdViewablilityIndicator = ( function() {
	'use strict';

	var DRGStylesheetReference = document.styleSheets[0];
	var DRGAdElementStyle = 'position: relative;';
	var DRGAdBeforePseudoElementStyle = 'content: ""; display: block; height: 100%; width: 100%; position: absolute; z-index: 5000; top: 0; left: 0; background: green; opacity: 0.65;';
	var DRGAdAfterPsuedoElementStyle = 'content: "Ad Viewable"; display: inline-block; position: absolute; z-index: 5001; top: calc( 50% - 10px ); left: calc(50% - 55px );font-size: 16px; font-weight: bold; text-transform: uppercase; color: #fff; text-shadow: -1px -1px #000; font-family: sans-serif;';

	var googletag = window.googletag || {};
	googletag.cmd = googletag.cmd || [];

	var setupViewableDetection = function() {
		if ( ! window.googletag || ! window.googletag.pubadsReady ) {
			setTimeout( setupViewableDetection, 20 );
			return;
		}
		googletag.cmd.push( function() {
			googletag.pubads().addEventListener( 'impressionViewable', function( viewed ) {
				var slotElementID = viewed.slot.getSlotElementId();
				console.log( slotElementID + ' slot now considered viewed:' );

				insertStyles( slotElementID );
			} );
		} );
	}

	var insertStyles = function( elementID ) {
		DRGStylesheetReference.insertRule(
			'#' + elementID + ' { ' +
			DRGAdElementStyle + '}',
			0
		);
		DRGStylesheetReference.insertRule(
			'#' + elementID + '::before { ' +
			DRGAdBeforePseudoElementStyle + '}',
			0
		);
		if ( document.getElementById( elementID ).offsetHeight > 20 ) {
			DRGStylesheetReference.insertRule(
				'#' + elementID + '::after { ' +
				DRGAdAfterPsuedoElementStyle + '}',
				0
			);
		}
	}

	var init = function() {
		setupViewableDetection();
	}

	return {
		init: init
	};

} )();

DRGAdViewablilityIndicator.init();
