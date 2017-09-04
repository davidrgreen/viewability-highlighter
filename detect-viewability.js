var DRGAdViewablilityIndicator = ( function() {
	'use strict';

	var adElementStyle = 'position: relative;';
	var adBeforePseudoElementStyle = 'content: ""; display: block; height: 100%; width: 100%; position: absolute; z-index: 5000; top: 0; left: 0; background: green; opacity: 0.65;';
	var adAfterPsuedoElementStyle = 'content: "Ad Viewable"; display: inline-block; position: absolute; z-index: 5001; top: calc( 50% - 10px ); left: calc(50% - 55px );font-size: 16px; font-weight: bold; text-transform: uppercase; color: #fff; text-shadow: -1px -1px #000; font-family: sans-serif;';
	var enableAttempts = 0,
		maxAttempts = 500,
		sheet,
		insertedStyleCount = 0;

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
					console.log( 'Slot ' + slotElementID + ' is viewable' );
					insertStyles( viewed.slot );
				}
			);
			googletag.companionAds().addEventListener(
				'impressionViewable',
				function( viewed ) {
					var slotElementID = viewed.slot.getSlotElementId();
					console.log( 'Slot ' + slotElementID + ' is viewable' );
					insertStyles( viewed.slot );
				}
			);
			googletag.content().addEventListener(
				'impressionViewable',
				function( viewed ) {
					var slotElementID = viewed.slot.getSlotElementId();
					console.log( 'Slot ' + slotElementID + ' is viewable' );
					insertStyles( viewed.slot );
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

	var insertStyles = function( slot ) {
		var slotElementId = slot.getSlotElementId(),
			element,
			className,
			selector,
			adPath;
		if ( isValidID( slotElementId ) ) {
			element = document.getElementById( slotElementId );
			selector = '#' + slotElementId;
		} else {
			// The slot does not have a valid ID that can be recognized by a
			// CSS style, such as beginning with a number, so need to add
			// a class to the ad element and target that.
			adPath = slot.getAdUnitPath();
			element = document.querySelector( 'div[id*="' + adPath + '"]' );
			if ( element ) {
				className = 'DRGViewableAd-' + insertedStyleCount;
				insertedStyleCount += 1;
				selector = '.' + className;
				addClass( element, className );
			}
		}

		getSheet().insertRule(
			selector + ' { ' +
			adElementStyle + '}'
		);
		getSheet().insertRule(
			selector + '::before { ' +
			adBeforePseudoElementStyle + '}'
		);
		if ( element.offsetHeight > 20 ) {
			getSheet().insertRule(
				selector + '::after { ' +
				adAfterPsuedoElementStyle + '}'
			);
		}
	};

	var isValidID = function( id ) {
		return id.match( /^[a-z][\w:.-]*$/i );
	};

	var addClass = function( element, className ) {
		if ( element.classList ) {
			element.classList.add( className );
		} else {
			element.className += ' ' + className;
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
