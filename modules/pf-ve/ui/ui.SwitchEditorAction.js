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
mw.pageForms.ve.ui.SwitchEditorAction = function MwVefpgUiSwitchEditorAction( surface ) {
	// Parent constructor
	ve.ui.Action.call( this, surface );
};

/* Inheritance */

OO.inheritClass( mw.pageForms.ve.ui.SwitchEditorAction, ve.ui.Action );

/* Static Properties */

/**
 * Name of this action
 *
 * @static
 * @property
 */
mw.pageForms.ve.ui.SwitchEditorAction.static.name = 'vefpgSwitchEditor';

/**
 * List of allowed methods for the action.
 *
 * @static
 * @property
 */
mw.pageForms.ve.ui.SwitchEditorAction.static.methods = [ 'switch' ];

/* Methods */

/**
 * Switch to wikitext editing.
 *
 * @method
 */
mw.pageForms.ve.ui.SwitchEditorAction.prototype.switch = function () {
	this.surface.emit('switchEditor');
	
};

ve.ui.actionFactory.register( mw.pageForms.ve.ui.SwitchEditorAction );

}( mediaWiki, OO, ve ) );
