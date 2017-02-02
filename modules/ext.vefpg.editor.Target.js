mw.ext = mw.ext || {};
mw.ext.vefpg = mw.ext.vefpg || {};
mw.ext.vefpg.editor = mw.ext.vefpg.editor || {};

( function ( $, mw, OO, ve ) {
	'use strict';

	/**
	 * @class
	 * @extends ve.init.sa.Target
	 * @constructor
	 * @param {jQuery} $node Node to replace with a VisualEditor
	 * @param {string} [content='']
	 */
	mw.ext.vefpg.editor.Target = function ( $node, content ) {
		// Parent constructor
		mw.ext.vefpg.editor.Target.parent.call( this );

		// node the editor is associated with.
		this.$node = $node;

		// HACK: make textarea look pending in case we didn't come from an editor switch
		// Once this is an OO.ui.TextInputWidget we'll be able to use real PendingElement
		// functionality for this
		$($node)
			.prop( 'disabled', true )
			.addClass( 'oo-ui-texture-pending' );

		// load dependencies & init editor
		mw.loader.using( 'ext.visualEditorForPageForm.init', $.proxy( this.init, this, content || '' ) );
	};

	OO.inheritClass( mw.ext.vefpg.editor.Target, ve.init.sa.Target );
	
	mw.ext.vefpg.editor.Target.prototype.init = function ( content ) {
		var target = this;
		
		this.addSurface(
			ve.dm.converter.getModelFromDom(
				ve.createDocumentFromHtml( content )
			)
		);

		// Append the target to the document
		$( this.$node ).before( this.$element );
		
		var new_ele = $("<a>click me</a>");
		new_ele.click(function() {
			target.updateContent();
		}); 
		$( this.$node ).before(new_ele);
		
/*
		$( this.$node ).on( 'click', function () {
			// Get the current HTML from the surface and display
			alert('Save');
			$( this ).val( this.getSurface().getHtml() );
		} );
*/
		$ (this.$node)
			//.hide()
			.removeClass( 'oo-ui-texture-pending' )
			.prop( 'disabled', false );
		
	}
	
	mw.ext.vefpg.editor.Target.prototype.updateContent = function () {
		
		this.convertToWikiText(this.getSurface().getHtml());
	}
	

	mw.ext.vefpg.editor.Target.prototype.convertToWikiText = function ( content ) {
		var target = this;
		var oldFormat = 'html';
		var newFormat = 'wikitext';
		
		
		var apiCall = new mw.Api().post( {
			action: 'flow-parsoid-utils',
			from: oldFormat,
			to: newFormat,
			content: content,
			title: mw.config.get( 'wgPageName' )
		} ).then( function (data) {
				console.log(data);
				$( target.$node ).val(data[ 'flow-parsoid-utils' ].content);
			})
			.fail( function (data) {
				alert('Error converting to wikitext');
			});
		
		console.log('waiting...');
		
	}
	
	

}( jQuery, mediaWiki, OO, ve ) );
