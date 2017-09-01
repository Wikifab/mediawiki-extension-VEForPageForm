( function ( mw, OO, ve ) {
	'use strict';
	mw.pageForms = mw.pageForms || {};
	mw.pageForms.ve = mw.pageForms.ve || {
		ui: {}
	};

	/**
	 * PageForms-specific target, inheriting from the stand-alone target
	 *
	 * @class
	 * @extends ve.init.sa.Target
	 */
	mw.pageForms.ve.Target = function PageFormsVeTarget(node, content) {
		
		this.$node = node;
		var config = {};
		config.toolbarConfig = {};
		config.toolbarConfig.actions = true;
		//disable floatable behaviour
		config.toolbarConfig.floatable = false;
		
		
		mw.pageForms.ve.Target.parent.call( this, config );

		// HACK: stop VE's education popups from appearing (T116643)
		this.dummyToolbar = true;
		
		this.init(content);
	};

	OO.inheritClass( mw.pageForms.ve.Target, ve.init.sa.Target );
	

	
	mw.pageForms.ve.Target.prototype.init = function ( content ) {
		this.convertToHtml(content);
	}

	// Static

	mw.pageForms.ve.Target.static.name = 'pageForms';


	mw.pageForms.ve.Target.static.toolbarGroups = [
		// History
		//{ include: [ 'undo', 'redo' ] },
		// Format
		{
			header: OO.ui.deferMsg( 'visualeditor-toolbar-paragraph-format' ),
			title: OO.ui.deferMsg( 'visualeditor-toolbar-format-tooltip' ),
			type: 'menu',
			include: [ { group: 'format' } ],
			promote: [ 'paragraph' ],
			demote: [ 'preformatted', 'blockquote' ]
		},
		// Text style
		{
			header: OO.ui.deferMsg( 'visualeditor-toolbar-text-style' ),
			title: OO.ui.deferMsg( 'visualeditor-toolbar-style-tooltip' ),
			include: [ 'bold', 'italic', 'moreTextStyle' ]
		},
		// Link
		{ include: [ 'link' ] },
		// Structure
		{
			header: OO.ui.deferMsg( 'visualeditor-toolbar-structure' ),
			title: OO.ui.deferMsg( 'visualeditor-toolbar-structure' ),
			type: 'list',
			icon: 'listBullet',
			include: [ { group: 'structure' } ],
			demote: [ 'outdent', 'indent' ]
		},
		// Insert
		{
			header: OO.ui.deferMsg( 'visualeditor-toolbar-insert' ),
			title: OO.ui.deferMsg( 'visualeditor-toolbar-insert' ),
			type: 'list',
			icon: 'add',
			label: '',
			include: [ 'insertTable', 'specialCharacter' ]
		},
		// Special character toolbar
		//{ include: [ 'specialCharacter' ] }
	];
	
	mw.pageForms.ve.Target.static.actionGroups = [
			{ include: [ 'vefpgSwitchEditor' ] }
			/*{
				type: 'list',
				icon: 'textStyle',
				indicator: 'down',
				title: OO.ui.deferMsg( 'visualeditor-toolbar-style-tooltip' ),
				include: [ 'bold', 'italic' ],
				forceExpand: [ 'bold', 'italic' ]
			},*/
			//{ include: [ 'link' ] }
	];
	

	// Allow pasting links
	mw.pageForms.ve.Target.static.importRules = ve.copy( mw.pageForms.ve.Target.static.importRules );
	mw.pageForms.ve.Target.static.importRules.external.blacklist = OO.simpleArrayDifference(
		mw.pageForms.ve.Target.static.importRules.external.blacklist,
		[ 'link/mwExternal' ]
	);

	// Static Methods
	mw.pageForms.ve.Target.static.setSwitchable = function ( switchable ) {
		// FIXME this isn't supposed to be a global state thing, it's supposed to be
		// variable per EditorWidget instance

		if ( switchable ) {
			mw.pageForms.ve.Target.static.actionGroups = [ {
				type: 'list',
				icon: 'edit',
				title: mw.msg( 'visualeditor-mweditmode-tooltip' ),
				include: [ 'editModeVisual', 'editModeSource' ]
			} ];
		} else {
			mw.pageForms.ve.Target.static.actionGroups = [];
		}
	};

	// Methods
/*
	mw.pageForms.ve.Target.prototype.loadHtml = function ( html ) {
		var doc = this.parseDocument( html );
		this.documentReady( doc );
	};

	// These tools aren't available so don't bother generating them
	mw.pageForms.ve.Target.prototype.generateCitationFeatures = function () {};

	mw.pageForms.ve.Target.prototype.attachToolbar = function () {
		this.$element.after( this.getToolbar().$element );
	};

	mw.pageForms.ve.Target.prototype.setDisabled = function ( disabled ) {
		var i, len;
		for ( i = 0, len = this.surfaces.length; i < len; i++ ) {
			this.surfaces[ i ].setDisabled( disabled );
		}
	};
*/
	
	/**
	 * add listener to show or hide toolbar if the area get focus or loose it
	 */
	mw.pageForms.ve.Target.prototype.setPulloutToolbar = function () {
		var target = this;
		this.getSurface().getView().on( 'blur', function (data) {
			target.updateToolbarVisibility();
		} );
		this.getSurface().getView().on( 'focus', function (data) {
			target.updateToolbarVisibility();
		} );
		this.updateToolbarVisibility();
	}
	/**
	 * hide toolbar if area not focused (VE area or textarea )
	 */
	mw.pageForms.ve.Target.prototype.updateToolbarVisibility = function () {
		if ( $(this.$node).closest('.inputSpan').find(":focus").length > 0){
			this.getToolbar().$element.show(500);
		} else {
			this.getToolbar().$element.hide(500);
		}
	}
	
	

	/**
	 * create a new surface with VisualEditor, and add it to the target
	 * 
	 * @param String content text to initiate content, in html format
	 */
	mw.pageForms.ve.Target.prototype.createWithHtmlContent = function(content) {
		var target = this;
		var surface = this.addSurface(
				ve.dm.converter.getModelFromDom(
					ve.createDocumentFromHtml( content )
				)
			);
		//this.setSurface( surface );
		//this.$element.insertAfter( this.$node );

		// Append the target to the document
		$( this.$node ).before( this.$element );
		
		$ (this.$node)
			.hide()
			.removeClass( 'oo-ui-texture-pending' )
			.prop( 'disabled', false );

		// when Editor loose focus, we update the field input
		this.getSurface().getView().on( 'blur', function (data) {
			target.updateContent();
		} );
		this.getSurface().on( 'switchEditor', function (data) {
			console.log('switchEditor event');
			target.switchEditor();
		} );
		
		// show or hide toolbar when loose focus
		this.getSurface().getView().on( 'blur', function (data) {
			target.updateToolbarVisibility();
		} );
		this.getSurface().getView().on( 'focus', function (data) {
			target.updateToolbarVisibility();
		} );
		target.updateToolbarVisibility();

		// focus VE instance if textarea had focus
		var $focusedElement = $( ':focus' );
		if ( !$focusedElement.length || this.$node.is( $focusedElement ) ) {
			this.getSurface().getView().focus();
		}
		

		// fix BUG on initialisation of toolbar position :
		target.getToolbar().onWindowResize();
		target.onToolbarResize();
		target.onContainerScroll();
	}
	

	/**
	 * update the original textarea value with the content of VisualEditor surface 
	 * (converte the content into wikitext)
	 */
	mw.pageForms.ve.Target.prototype.updateContent = function () {

		this.convertToWikiText(this.getSurface().getHtml());
	}
	
	mw.pageForms.ve.Target.prototype.getPageName = function () {
		return mw.config.get( 'wgPageName' ).split(/(\\|\/)/g).pop();
	}

	mw.pageForms.ve.Target.prototype.convertToWikiText = function ( content ) {
		var target = this;
		var oldFormat = 'html';
		var newFormat = 'wikitext';

		$(this.$node)
			.prop( 'disabled', true )
			.addClass( 'oo-ui-texture-pending' );
		
		var apiCall = new mw.Api().post( {
				action: 'flow-parsoid-utils',
				from: oldFormat,
				to: newFormat,
				content: content,
				title: this.getPageName()
			} ).then( function (data) {
				$( target.$node ).val(data[ 'flow-parsoid-utils' ].content);
				$( target.$node ).change();
				
				$ (target.$node)
					.removeClass( 'oo-ui-texture-pending' )
					.prop( 'disabled', false );
			})
			.fail( function (data) {
				console.log('Error converting to wikitext');
			});
		
	}
	
	mw.pageForms.ve.Target.prototype.convertToHtml = function ( content ) {
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
				console.log('Error converting to html');
			});
		
	}
	
	mw.pageForms.ve.Target.prototype.switchEditor = function ( content ) {

		var textarea = this.$node;
		
		if ( $(textarea).is(":visible") ) {
			// switch back to VE
			this.clearSurfaces();
			$(textarea).hide();
			//$(this.getSurface().$element).show();
			//this.getSurface().getView().focus();
			this.convertToHtml($(textarea).val());
		} else {
			// switch to text editor
			$(this.getSurface().$element).hide();
			$(textarea).show().focus();
			this.updateContent();
		}
	}

	
	/**
	 * Attach the toolbar to the DOM
	 * redifine attach Toolbar function to place on the bottom
	 */
	mw.pageForms.ve.Target.prototype.attachToolbar = function ( surface ) {
		$(this.$node).after( this.getToolbar().$element );
		this.getToolbar().initialize();
		this.getActions().initialize();
	};
	// Registration

	ve.init.mw.targetFactory.register( mw.pageForms.ve.Target );

}( mediaWiki, OO, ve ) );
