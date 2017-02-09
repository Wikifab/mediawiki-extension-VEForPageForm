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

	mw.ext.vefpg.ui.SwitchEditorTool = function VefpgVeSwitchEditorTool( toolGroup, config ) {
		mw.ext.vefpg.ui.SwitchEditorTool.parent.call( this, toolGroup, config );
	};

	OO.inheritClass( mw.ext.vefpg.ui.SwitchEditorTool, ve.ui.Tool );

	// Static
	mw.ext.vefpg.ui.SwitchEditorTool.static.commandName = 'vefpgSwitchEditor';
	mw.ext.vefpg.ui.SwitchEditorTool.static.name = 'vefpgSwitchEditor';
	mw.ext.vefpg.ui.SwitchEditorTool.static.icon = 'wikiText';
	mw.ext.vefpg.ui.SwitchEditorTool.static.title = OO.ui.deferMsg( 'flow-ve-switch-editor-tool-title' );

	ve.ui.toolFactory.register( mw.ext.vefpg.ui.SwitchEditorTool );
}( mediaWiki, OO, ve ) );
