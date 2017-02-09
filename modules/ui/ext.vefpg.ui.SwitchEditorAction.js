( function ( mw, OO, ve ) {

/**
 * Action to switch from VisualEditor to the Wikitext editing interface
 * within Flow.
 *
 * @class
 * @extends ve.ui.Action
 *
 * @constructor
 * @param {ve.ui.Surface} surface Surface to act on
 */
mw.ext.vefpg.ui.SwitchEditorAction = function MwVefpgUiSwitchEditorAction( surface ) {
	// Parent constructor
	ve.ui.Action.call( this, surface );
};

/* Inheritance */

OO.inheritClass( mw.ext.vefpg.ui.SwitchEditorAction, ve.ui.Action );

/* Static Properties */

/**
 * Name of this action
 *
 * @static
 * @property
 */
mw.ext.vefpg.ui.SwitchEditorAction.static.name = 'vefpgSwitchEditor';

/**
 * List of allowed methods for the action.
 *
 * @static
 * @property
 */
mw.ext.vefpg.ui.SwitchEditorAction.static.methods = [ 'switch' ];

/* Methods */

/**
 * Switch to wikitext editing.
 *
 * @method
 */
mw.ext.vefpg.ui.SwitchEditorAction.prototype.switch = function () {
	this.surface.emit('switchEditor');
	
};

ve.ui.actionFactory.register( mw.ext.vefpg.ui.SwitchEditorAction );

}( mediaWiki, OO, ve ) );
