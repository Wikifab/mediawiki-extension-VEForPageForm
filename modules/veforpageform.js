( function ( $ , mw) {
	
	/**
	 * what does this file do :
	 * - Load VisualEditor librairy
	 * - look for every textearea where we must activate visual editor, and activate it
	 * - watch click on save button, to defer the save request after all visualEditor requests are done.
	 * 
	 */
	
	var veInstances = [];
	
	function initVisualEditor() {
		// init VisualEditor Platform
		new ve.init.mw.Platform( ).initialize()
			.fail( function () {
				$( editor ).text( 'Sorry, this browser is not supported.' );
			} )
			.done( function () {


				// add i18n messages to VE
				ve.init.platform.addMessages( mw.messages.get() );
				
				// init all VisualEditor areas
				addVisualEditorOnTextareas();
				
				// add event on new step button, to appli VE on new steps
				mw.hook( 'pf.addTemplateInstance' ).add( function(div) {
						$(div).find('.createboxInput.form-textarea').each(function() {
							activeVisualEditorOnTextArea(this);
						});
					} );
			} );
		

		// we catch event on save button, to wait that every VE content is up to date
		// (ie api calls triggered and received)
		catchAndDelayClickEvent('wpSave');
		catchAndDelayClickEvent('wpSaveAndContinue');
		
	}
	
	var clickCount = [];
	
	function catchAndDelayClickEvent(buttonId) {
		if( ! clickCount[buttonId]) {
			clickCount[buttonId] = 0;
		}
		
		$('#'+buttonId).click( function(event) {
			clickCount[buttonId] ++;
			// the click count var is a security to avoid infinite loop if api calls do not end
			var updateNeeded = true;
			// if one VE area is focused, we force to update his data by bluring it
		    for (var int = 0; int < veInstances.length; int++) {
		    	if (veInstances[int].target.getSurface().getView().isFocused()) {
		    		veInstances[int].target.getSurface().getView().blur();
		    		updateNeeded = true;
		    	}
			}
		    if ((updateNeeded || jQuery.active > 0) && clickCount[buttonId] < 2) {
		    	// if update needed, stop event propagation, and delay before relaunch
		    	event.preventDefault();
		    	setTimeout( function () { 
		    		clickWhenApiCallDone('#'+buttonId);
			    }, 100);
		    } else {
			    // if success, we can reset the clickCount to 0 to re enable other calls
			    clickCount[buttonId] = 0;
		    }
		});
	}
	
	function clickWhenApiCallDone(button, maxCount = 5) {
		if (jQuery.active > 0 && maxCount > 0) {
			setTimeout( function () { 
				clickWhenApiCallDone(button, maxCount -1);
		    }, 500);
		} else {
		    $(button).click();
		}
	}
	
	function addVisualEditorOnTextareas() {
		$('.createboxInput.form-textarea').not( ".multipleTemplateStarter .form-textarea" ).each(function() {
			activeVisualEditorOnTextArea(this);
		});
	}
	
	function activeVisualEditorOnTextArea(textarea) {
		var logo = $('<div class="ve-demo-logo"></div>');
		var toolbar = $('<div class="ve-demo-toolbar ve-demo-targetToolbar"></div>');
		var editor = $('<div class="ve-demo-editor"></div>');
		
		$(textarea).before(logo, editor, toolbar);
		var veEditor = new mw.pageForms.ve.Editor(textarea, $(textarea).val());
		veInstances.push( veEditor);
	}
	
	mw.loader.using( 'ext.visualEditorForPageForm.visualEditor', $.proxy( initVisualEditor ) );
	
}( jQuery , mw) );

$ = jQuery;
