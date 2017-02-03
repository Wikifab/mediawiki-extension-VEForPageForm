( function ( $ , mw) {
	
	
	var veInstances = [];
	
	
	function initVisualEditor() {
		
		// init VisualEditor Platform
		new ve.init.mw.Platform( ).initialize()
			.fail( function () {
				$( editor ).text( 'Sorry, this browser is not supported.' );
			} )
			.done( function () {
				// init all VisualEditor areas
				addVisualEditorOnTextareas();
			} );
	}
	
	function addVisualEditorOnTextareas() {
		$('.createboxInput.form-textarea').each(function() {
			activeVisualEditorOnTextArea(this);
		});
	}
	
	function activeVisualEditorOnTextArea(textarea) {
		var logo = $('<div class="ve-demo-logo"></div>');
		var toolbar = $('<div class="ve-demo-toolbar ve-demo-targetToolbar"></div>');
		var editor = $('<div class="ve-demo-editor"></div>');
		
		$(textarea).before(logo, toolbar, editor);
		$(textarea).css('border', '1px solid #F00');
		var target = new mw.ext.vefpg.editor.Target(textarea, $(textarea).val());
		veInstances.push( target);
	}
	
	mw.loader.using( 'ext.visualEditorForPageForm.init', $.proxy( initVisualEditor ) );
	
	
}( jQuery , mw) );