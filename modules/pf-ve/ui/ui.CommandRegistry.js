
mw.pageForms = mw.pageForms || {};
mw.pageForms.ve = mw.pageForms.ve || {};
mw.pageForms.ve.ui = mw.pageForms.ve.ui || {};

( function ( ve ) {
	'use strict';
/*
	ve.ui.commandRegistry.register(
		new ve.ui.Command(
			'flowMention',
			'window',
			'open',
			{ args: [ 'flowMention' ], supportedSelections: [ 'linear' ] }
		)
	);

	ve.ui.commandRegistry.register(
		new ve.ui.Command(
			'flowMentionAt',
			'window',
			'open',
			{ args: [ 'flowMention', { selectAt: true } ], supportedSelections: [ 'linear' ] }
		)
	);
*/
	ve.ui.commandRegistry.register(
		new ve.ui.Command(
			'vefpgSwitchEditor',
			'vefpgSwitchEditor',
			'switch',  // method to call on action
			{ args: [] } // arguments to pass to action
		)
	);
}( ve ) );
