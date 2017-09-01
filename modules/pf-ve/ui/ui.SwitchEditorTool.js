( function ( mw, OO, ve ) {
	'use strict';

	/**
	 * Tool for switching editors
	 *
	 * @class
	 * @extends ve.ui.Tool
	 *
	 * @constructor
	 * @param {OO.ui.ToolGroup} toolGroup
	 * @param {Object} [config] Configuration options
	 */

	mw.pageForms.ve.ui.SwitchEditorTool = function VefpgVeSwitchEditorTool( toolGroup, config ) {
		mw.pageForms.ve.ui.SwitchEditorTool.parent.call( this, toolGroup, config );
	};

	OO.inheritClass( mw.pageForms.ve.ui.SwitchEditorTool, ve.ui.Tool );

	// Static
	mw.pageForms.ve.ui.SwitchEditorTool.static.commandName = 'vefpgSwitchEditor';
	mw.pageForms.ve.ui.SwitchEditorTool.static.name = 'vefpgSwitchEditor';
	mw.pageForms.ve.ui.SwitchEditorTool.static.icon = 'wikiText';
	mw.pageForms.ve.ui.SwitchEditorTool.static.title = OO.ui.deferMsg( 'flow-ve-switch-editor-tool-title' );

	ve.ui.toolFactory.register( mw.pageForms.ve.ui.SwitchEditorTool );
}( mediaWiki, OO, ve ) );
