
( function ( $, mw, OO, ve ) {
	'use strict';

	/**
	 * this launch the visual editor on a given textarea
	 * 
	 * usage :
	 *   new mw.pageForms.ve.Editor(node, initialContent);
	 * where :
	 * - node is the html element of the textarea
	 * - initialContent is the text content (wikitext format)
	 * 
	 */

	
	/**
	 * @class
	 * @extends mw.flow.editors.AbstractEditor
	 * @constructor
	 * @param {jQuery} $node Node to replace with a VisualEditor
	 * @param {string} [content='']
	 */
	mw.pageForms.ve.Editor = function ( $node, content ) {
			
			var config = {};
			config.toolbarConfig = {};
			//disable floatable behaviour
			config.toolbarConfig.floatable = false;
			

			var target = new mw.pageForms.ve.Target(config);

			// node the editor is associated with.
			this.$node = $node;

			// add class for css :
			$($node).closest('.inputSpan').addClass('ve-area-wrapper');
			

			// HACK: make textarea look pending in case we didn't come from an editor switch
			// Once this is an OO.ui.TextInputWidget we'll be able to use real PendingElement
			// functionality for this
			$($node)
				.prop( 'disabled', true )
				.addClass( 'oo-ui-texture-pending' );
			
			// show or hide toolbar when loose focus
			$($node).on( 'blur', function (data) {
				target.updateToolbarVisibility();
			} );
			$($node).on( 'focus', function (data) {
				target.updateToolbarVisibility();
			} );

			// load dependencies & init editor
			//mw.loader.using( 'ext.visualEditorForPageForm.init', $.proxy( this.init, this, content || '' ) );
			// dependencies should already be loaded, call init directly :
			this.init(content);
	};
	
	/**
	 * List of callbacks to execute when VE is fully loaded
	 */
	mw.pageForms.ve.Editor.prototype.initCallbacks = [];
	
	
	mw.pageForms.ve.Editor.prototype.init = function ( content ) {
		var $veNode, htmlDoc, surface, $documentNode,
			$focusedElement = $( ':focus' );

		// ve.createDocumentFromHtml documents support for an empty string
		// to create an empty document, but does not mention other falsy values.
		content = content || '';

		// add i18n messages to VE
		ve.init.platform.addMessages( mw.messages.values );

		this.target = ve.init.mw.targetFactory.create( 'pageForms' );

		htmlDoc = ve.createDocumentFromHtml( content ); // HTMLDocument

		// Based on ve.init.mw.ArticleTarget.prototype.setupSurface
		this.dmDoc = ve.dm.converter.getModelFromDom( htmlDoc, {
			lang: mw.config.get( 'wgVisualEditor' ).pageLanguageCode,
			dir: mw.config.get( 'wgVisualEditor' ).pageLanguageDir
		} );

		// attach VE to DOM
		console.log(this.dmDoc);
		surface = this.target.addSurface( this.dmDoc, { placeholder: $(this.$node).attr( 'placeholder' ) } );
		this.target.setSurface( surface );
		this.target.$element.insertAfter( $(this.$node));

		$(this.$node)
			.hide()
			.removeClass( 'oo-ui-texture-pending' )
			.prop( 'disabled', false );

		// Add appropriately mw-content-ltr or mw-content-rtl class
		$documentNode = surface.getView().getDocument().getDocumentNode().$element;
		$documentNode.addClass(
			'mw-content-' + mw.config.get( 'wgVisualEditor' ).pageLanguageDir
		);

		// Pass surface focus state to parent
		surface.getView()
			.on( 'focus', $.proxy( function () {
				this.target.$element.addClass( 'flow-ui-focused' );
			}, this ) )
			.on( 'blur', $.proxy( function () {
				this.target.$element.removeClass( 'flow-ui-focused' );
			}, this ) );

		// focus VE instance if textarea had focus
		if ( !$focusedElement.length || this.$node.is( $focusedElement ) ) {
			//surface.getView().focus();
		}

		$veNode = surface.$element.find( '.ve-ce-documentNode' );

		// HACK: simulate a keyup event on the original node, so the validation code will
		// pick up changes in the new node
		$veNode.keyup( $.proxy( function () {
			this.$node.keyup();
		}, this ) );

		//surface.getModel().connect( this, { documentUpdate: [ 'emit', 'change' ] } );

		$.each( this.initCallbacks, $.proxy( function ( k, callback ) {
			callback.apply( this );
		}, this ) );
	};
	
}( jQuery, mediaWiki, OO, ve ) );