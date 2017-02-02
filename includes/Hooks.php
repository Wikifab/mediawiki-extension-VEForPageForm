<?php
namespace VeForPageForm;

class Hooks {

	public static function onBeforePageDisplay( \OutputPage &$output, \Skin &$skin ) {

		$output->addModules( [
				'ext.visualEditorForPageForm.init'
		] );
	}
}