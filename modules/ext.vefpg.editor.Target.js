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
		
		var config = {};
		config.toolbarConfig = {};
		//disable floatable behaviour
		config.toolbarConfig.floatable = false;
		
		// Parent constructor
		mw.ext.vefpg.editor.Target.parent.call( this , config);

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
	
	mw.ext.vefpg.editor.Target.static.toolbarGroups = [
		// History
		/*{
			header: OO.ui.deferMsg( 'visualeditor-toolbar-history' ),
			include: [ 'undo', 'redo' ]
		},*/
		// Format
		/*{
			header: OO.ui.deferMsg( 'visualeditor-toolbar-paragraph-format' ),
			type: 'menu',
			indicator: 'down',
			title: OO.ui.deferMsg( 'visualeditor-toolbar-format-tooltip' ),
			include: [ { group: 'format' } ],
			promote: [ 'paragraph' ],
			demote: [ 'preformatted', 'blockquote' ]
		},*/
		// Text style
		/*{
			header: OO.ui.deferMsg( 'visualeditor-toolbar-text-style' ),
			title: OO.ui.deferMsg( 'visualeditor-toolbar-style-tooltip' ),
			include: [ 'bold', 'italic', 'moreTextStyle' ]
		},*/
		{
			header: OO.ui.deferMsg( 'visualeditor-toolbar-paragraph-format' ),
			type: 'menu',
			indicator: 'down',
			title: OO.ui.deferMsg( 'visualeditor-toolbar-format-tooltip' ),
			include: [ 'paragraph', 'preformatted', 'blockquote' ],
			promote: [ 'paragraph' ],
			demote: [ 'preformatted', 'blockquote' ]
		},
		{
			icon: 'textStyle',
			indicator: 'down',
			title: OO.ui.deferMsg( 'visualeditor-toolbar-style-tooltip' ),
			include: [ 'bold', 'italic', 'preformatted' ],
			//allowCollapse: false
			forceExpand: [ 'bold', 'italic']
		},
		// Link
		{
			header: OO.ui.deferMsg( 'visualeditor-linkinspector-title' ),
			include: [ 'link' ]
		},
		// Structure
		{
			header: OO.ui.deferMsg( 'visualeditor-toolbar-structure' ),
			type: 'list',
			icon: 'listBullet',
			title: OO.ui.deferMsg( 'visualeditor-toolbar-structure' ),
			indicator: 'down',
			include: [ { group: 'structure' } ],
			demote: [ 'outdent', 'indent' ]
		},
		// Insert
		{
			header: OO.ui.deferMsg( 'visualeditor-toolbar-insert' ),
			type: 'list',
			icon: 'add',
			label: '',
			title: OO.ui.deferMsg( 'visualeditor-toolbar-insert' ),
			indicator: 'down',
			include: [ 'insertTable','comment', 'code', 'specialCharacter', 'preformatted' ]
		}
	];
	mw.ext.vefpg.editor.Target.static.actionGroups = [
		/*{
			type: 'list',
			icon: 'menu',
			title: OO.ui.deferMsg( 'visualeditor-pagemenu-tooltip' ),
			include: [ 'findAndReplace', 'commandHelp' ]
		}*/
	];
	
	mw.ext.vefpg.editor.Target.prototype.init = function ( content ) {
		var target = this;
		
		this.convertToHtml(content);
		
	}
	
	mw.ext.vefpg.editor.Target.prototype.createWithHtmlContent = function(content) {
		var target = this;
		var surface = this.addSurface(
				ve.dm.converter.getModelFromDom(
					ve.createDocumentFromHtml( content )
				)
			);

		// Append the target to the document
		$( this.$node ).before( this.$element );
		
		$ (this.$node)
			.hide()
			.removeClass( 'oo-ui-texture-pending' )
			.prop( 'disabled', false );

		// when Editor lose focus, we update the field input
		this.getSurface().getView().on( 'blur', function (data) {
			target.updateContent();
		} );

		// fix BUG in initialisation of toolbar position :
		target.getToolbar().onWindowResize();
		target.onToolbarResize();
		target.onContainerScroll();
	}
	
	
	mw.ext.vefpg.editor.Target.prototype.updateContent = function () {
		
		this.convertToWikiText(this.getSurface().getHtml());
	}
	
	mw.ext.vefpg.editor.Target.prototype.getPageName = function () {
		return mw.config.get( 'wgPageName' ).split(/(\\|\/)/g).pop();
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
				title: this.getPageName()
			} ).then( function (data) {
				$( target.$node ).val(data[ 'flow-parsoid-utils' ].content);
			})
			.fail( function (data) {
				alert('Error converting to wikitext');
			});
		
	}
	
	mw.ext.vefpg.editor.Target.prototype.convertToHtml = function ( content ) {
		var target = this;
		var oldFormat = 'wikitext';
		var newFormat = 'html';
		
		
		var apiCall = new mw.Api().post( {
				action: 'flow-parsoid-utils',
				from: oldFormat,
				to: newFormat,
				content: content,
				title: this.getPageName()
			} ).then( function (data) {
				
				target.createWithHtmlContent(data[ 'flow-parsoid-utils' ].content);
				
			})
			.fail( function (data) {
				alert('Error converting to html');
			});
		
	}
	
	

}( jQuery, mediaWiki, OO, ve ) );
